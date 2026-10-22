import {PLACES,FLOOR_NAMES} from './catalog.js';

// An HTML/SVG string renderer is convenient for this small diagram.
const escapeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&quot;'}[c]));
export class FloorMap {
  constructor(building,onPick){
    this.building=building;
    this.onPick=onPick;
    this.svg=document.getElementById('mallMap');
    this.stage=document.getElementById('mapStage');
    this.layer=document.getElementById('mapViewport');
    this.base=document.getElementById('mapBase');
    this.shops=document.getElementById('mapPlaces');
    this.line=document.getElementById('mapRoute');
    this.zoom=1;
    this.offset={x:0,y:0};
    this.pointer=null;
    this.attachEvents();
  }
  updateTransform(){
    this.layer.setAttribute('transform',`translate(${this.offset.x} ${this.offset.y}) translate(500 350) scale(${this.zoom}) translate(-500 -350)`);
  }
  changeZoom(factor){this.zoom=Math.max(.7,Math.min(2.8,this.zoom*factor));this.updateTransform();}
  reset(){this.zoom=1;this.offset={x:0,y:0};this.updateTransform();}
  attachEvents(){
    const pick=e=>{const selected=e.target.closest('[data-place]');if(selected)this.onPick(selected.dataset.place);};
    this.shops.addEventListener('click',pick);
    this.shops.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(e);}});
    this.svg.addEventListener('pointerdown',e=>{
      if(e.target.closest('[data-place]'))return;
      this.pointer={startX:e.clientX,startY:e.clientY,x:this.offset.x,y:this.offset.y};
      this.svg.setPointerCapture(e.pointerId);
      this.svg.classList.add('dragging');
    });
    this.svg.addEventListener('pointermove',e=>{
      if(!this.pointer)return;
      const factor=1000/this.svg.getBoundingClientRect().width;
      this.offset={x:this.pointer.x+(e.clientX-this.pointer.startX)*factor,y:this.pointer.y+(e.clientY-this.pointer.startY)*factor};
      this.updateTransform();
    });
    const up=()=>{this.pointer=null;this.svg.classList.remove('dragging');};
    this.svg.addEventListener('pointerup',up);this.svg.addEventListener('pointercancel',up);
    this.svg.addEventListener('wheel',e=>{e.preventDefault();this.changeZoom(e.deltaY<0?1.12:1/1.12);},{passive:false});
    document.getElementById('zoomIn').onclick=()=>this.changeZoom(1.2);
    document.getElementById('zoomOut').onclick=()=>this.changeZoom(1/1.2);
    document.getElementById('resetView').onclick=()=>this.reset();
  }
  buildingSVG(floor){
    const doors=this.building.rooms.map(room=>{
      const [x,y,w,h]=room,cx=x+w/2;
      return `<line x1="${cx}" x2="${cx}" y1="${y<300?y+h:y}" y2="${y<300?310:367}" class="room-door"/>`;
    }).join('');
    return `<rect x="76" y="102" width="848" height="470" rx="33" class="map-outline" filter="url(#mapShadow)"/>
      <rect x="94" y="305" width="812" height="61" rx="18" class="corridor"/>
      <rect x="478" y="116" width="44" height="445" rx="13" class="corridor"/>
      <line x1="102" y1="335" x2="898" y2="335" class="corridor-line"/>
      <line x1="500" y1="128" x2="500" y2="548" class="corridor-line"/>
      <text x="258" y="129" class="map-wing-label">WEST WING</text><text x="727" y="129" class="map-wing-label">EAST WING</text>
      <text x="500" y="608" class="map-floor-label">${escapeText(FLOOR_NAMES[floor].toUpperCase())} · CENTRAL ATRIUM</text>
      <circle cx="500" cy="335" r="30" fill="#dcece9" stroke="#c8dfdb" stroke-width="2"/>
      <circle cx="500" cy="335" r="20" fill="#fff" stroke="#8fb8b1" stroke-width="1.5"/>
      <text x="500" y="339" class="map-facility-label">LIFT</text>${doors}`;
  }
  splitLabel(name){
    const lines=[''];
    name.split(' ').forEach(w=>{
      const i=lines.length-1;
      if(lines[i]&&(lines[i]+' '+w).length>15)lines.push(w);
      else lines[i]=(lines[i]+' '+w).trim();
    });
    return lines.slice(0,3);
  }
  roomSVG(place,selected){
    const [x,y,w,h]=this.building.rooms[place.slot],cx=x+w/2,cy=y+h/2;
    const lines=this.splitLabel(place.name);
    const label=lines.map((text,i)=>`<tspan x="${cx}" dy="${i?19:0}">${escapeText(text)}</tspan>`).join('');
    return `<g class="poi-group ${selected===place.id?'selected':''}" tabindex="0" role="button" aria-label="${escapeText(place.name+', '+FLOOR_NAMES[place.floor])}" data-place="${escapeText(place.id)}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" class="map-room ${place.category.toLowerCase()}"/>
      <text x="${cx}" y="${y+30}" class="map-room-code">${place.floor} · ${String(place.slot+1).padStart(2,'0')}</text>
      <text x="${cx}" y="${cy-(lines.length-1)*9}" class="map-room-text">${label}</text></g>`;
  }
  facilitySVG(place,selected){
    const {x,y}=this.building.position(place);
    const initials=place.name==='Lift Lobby'?'L':place.name==='Restrooms'?'WC':place.name==='West Entrance'?'ENT':place.name==='West Escalator'?'ESC':'PR';
    return `<g class="facility-marker" tabindex="0" role="button" aria-label="${escapeText(place.name)}" data-place="${escapeText(place.id)}">
      <circle cx="${x}" cy="${y}" r="${place.name==='Lift Lobby'?19:23}" class="map-facility ${selected===place.id?'selected':''}"/>
      <text x="${x}" y="${y+4}" class="map-facility-label">${initials}</text>${place.name==='Lift Lobby'?'':`<text x="${x}" y="${y+39}" class="map-floor-label">${escapeText(place.name.toUpperCase())}</text>`}</g>`;
  }
  routeSVG(state){
    const output=[];
    if(state.route){
      let points=[];
      const add=()=>{
        if(points.length>=2){
          const d=points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ');
          output.push(`<path d="${d}" class="route-outline"/><path d="${d}" class="route-line"/>`);
        }
        points=[];
      };
      state.route.path.forEach(node=>node.floor===state.floor?points.push(node):add());
      add();
      if(state.route.involvedFloors.length>1&&state.route.path.some(n=>n.floor===state.floor&&n.x===500&&n.y===335)){
        output.push('<circle cx="500" cy="335" r="23" class="floor-change"/><text x="500" y="339" class="floor-change-text">⇅</text>');
      }
    }
    [['fromId','start','A'],['toId','end','B']].forEach(([field,type,label])=>{
      const place=PLACES.find(p=>p.id===state[field]);
      if(!place||place.floor!==state.floor)return;
      const {x,y}=this.building.position(place);
      output.push(`<circle cx="${x}" cy="${y}" r="17" class="route-pin ${type}"/><text x="${x}" y="${y+4}" class="route-pin-label">${label}</text>`);
    });
    return output.join('');
  }
  render(state){
    this.base.innerHTML=this.buildingSVG(state.floor);
    this.shops.innerHTML=PLACES.filter(p=>p.floor===state.floor).map(p=>p.slot===null?this.facilitySVG(p,state.selectedId):this.roomSVG(p,state.selectedId)).join('');
    this.line.innerHTML=this.routeSVG(state);
    document.getElementById('floorHeading').innerHTML=`${FLOOR_NAMES[state.floor]} <span class="map-heading-suffix">/ Directory</span>`;
    document.getElementById('mapStatus').textContent=state.route?`Route visible · ${state.route.involvedFloors.join(' → ')}`:'Select a place to explore';
  }
}
