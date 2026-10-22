import {PLACES, FLOOR_NAMES} from './data.js';
import {ROOM_SLOTS, positionOf} from './geometry.js';

const NS='http://www.w3.org/2000/svg';
const canvas=document.getElementById('mallMap');
const viewport=document.getElementById('mapViewport');
const base=document.getElementById('mapBase');
const routeGroup=document.getElementById('mapRoute');
const placesGroup=document.getElementById('mapPlaces');
let zoom=1,panX=0,panY=0,drag=null;
let placePicked=()=>{};

function svg(name,attrs={},text=null) {
  const el=document.createElementNS(NS,name);
  for (const [k,v] of Object.entries(attrs)) el.setAttribute(k,v);
  if (text!==null) el.textContent=text;
  return el;
}
function rect(parent,attrs) {parent.append(svg('rect',attrs));}
function line(parent,attrs){parent.append(svg('line',attrs));}
function label(parent,x,y,value,css){parent.append(svg('text',{x,y,class:css},value));}
function updateTransform(){viewport.setAttribute('transform',`translate(${panX} ${panY}) translate(500 350) scale(${zoom}) translate(-500 -350)`);}

function drawBuilding(floor) {
  base.replaceChildren();
  rect(base,{x:76,y:102,width:848,height:470,rx:33,class:'map-outline',filter:'url(#mapShadow)'});
  rect(base,{x:94,y:305,width:812,height:61,rx:18,class:'corridor'});
  rect(base,{x:478,y:116,width:44,height:445,rx:13,class:'corridor'});
  line(base,{x1:102,y1:335,x2:898,y2:335,class:'corridor-line'});
  line(base,{x1:500,y1:128,x2:500,y2:548,class:'corridor-line'});
  label(base,258,129,'WEST WING','map-wing-label');
  label(base,727,129,'EAST WING','map-wing-label');
  label(base,500,608,`${FLOOR_NAMES[floor].toUpperCase()} · CENTRAL ATRIUM`,'map-floor-label');
  base.append(svg('circle',{cx:500,cy:335,r:30,fill:'#dcece9',stroke:'#c8dfdb','stroke-width':2}));
  base.append(svg('circle',{cx:500,cy:335,r:20,fill:'#fff',stroke:'#8fb8b1','stroke-width':1.5}));
  label(base,500,339,'LIFT','map-facility-label');
  // Map room doors connect directly to the central corridor.
  for (const slot of ROOM_SLOTS) {
    const cx=slot.x+slot.w/2;
    line(base,{x1:cx,y1:slot.y<300?slot.y+slot.h:slot.y,x2:cx,y2:slot.y<300?310:367,class:'room-door'});
  }
}
function wrapName(name,max=15){
  const words=name.split(' ');const lines=[''];
  for (const word of words) {
    const last=lines.length-1;
    if ((lines[last]+' '+word).trim().length>max&&lines[last]) lines.push(word);
    else lines[last]=(lines[last]+' '+word).trim();
  }
  return lines.slice(0,3);
}
function roomSymbol(place,selectedId) {
  const slot=ROOM_SLOTS[place.slot],x=slot.x+slot.w/2, y=slot.y+slot.h/2;
  const g=svg('g',{class:`poi-group ${place.id===selectedId?'selected':''}`,tabindex:0,role:'button','aria-label':`${place.name}, ${FLOOR_NAMES[place.floor]}`,'data-place':place.id});
  rect(g,{x:slot.x,y:slot.y,width:slot.w,height:slot.h,rx:12,class:`map-room ${place.category.toLowerCase()}`});
  label(g,x,slot.y+30,`${place.floor} · ${String(place.slot+1).padStart(2,'0')}`,'map-room-code');
  const lines=wrapName(place.name);
  const t=svg('text',{x,y:y-(lines.length-1)*9,class:'map-room-text'});
  lines.forEach((s,i)=>t.append(svg('tspan',{x,dy:i?19:0},s)));
  g.append(t);
  return g;
}
function facilitySymbol(place,selectedId){
  const {x,y}=positionOf(place);
  const g=svg('g',{class:'facility-marker',tabindex:0,role:'button','aria-label':place.name,'data-place':place.id});
  g.append(svg('circle',{cx:x,cy:y,r:place.name==='Lift Lobby'?19:23,class:`map-facility ${selectedId===place.id?'selected':''}`}));
  const labelText=place.name==='Lift Lobby'?'L':place.name==='Restrooms'?'WC':place.name==='West Entrance'?'ENT':place.name==='West Escalator'?'ESC':'PR';
  label(g,x,y+4,labelText,'map-facility-label');
  if(place.name!=='Lift Lobby')label(g,x,y+39,place.name.toUpperCase(),'map-floor-label');
  return g;
}
function drawPins(state){
  for (const [id,type,letter] of [[state.fromId,'start','A'],[state.toId,'end','B']]) {
    const place=PLACES.find(p=>p.id===id);
    if (!place||place.floor!==state.floor) continue;
    const {x,y}=positionOf(place);
    routeGroup.append(svg('circle',{cx:x,cy:y,r:17,class:`route-pin ${type}`}));
    label(routeGroup,x,y+4,letter,'route-pin-label');
  }
}
function drawRoute(state){
  routeGroup.replaceChildren();
  if (state.route) {
    let segment=[];
    const flush=()=>{
      if(segment.length<2){segment=[];return;}
      const d=segment.map((n,i)=>`${i?'L':'M'}${n.x} ${n.y}`).join(' ');
      routeGroup.append(svg('path',{d,class:'route-outline'}));
      routeGroup.append(svg('path',{d,class:'route-line'}));
      segment=[];
    };
    for (const node of state.route.path) {
      if(node.floor===state.floor)segment.push(node);else flush();
    }
    flush();
    const liftNode=state.route.path.find(n=>n.floor===state.floor&&n.x===500&&n.y===335);
    if (liftNode&&state.route.involvedFloors.length>1){
      routeGroup.append(svg('circle',{cx:500,cy:335,r:23,class:'floor-change'}));
      label(routeGroup,500,339,'⇅','floor-change-text');
    }
  }
  drawPins(state);
}
export function renderMap(state) {
  drawBuilding(state.floor);
  placesGroup.replaceChildren();
  for (const p of PLACES.filter(p=>p.floor===state.floor)) {
    placesGroup.append(p.slot===null?facilitySymbol(p,state.selectedId):roomSymbol(p,state.selectedId));
  }
  drawRoute(state);
  document.getElementById('floorHeading').innerHTML=`${FLOOR_NAMES[state.floor]} <span class="map-heading-suffix">/ Directory</span>`;
  document.getElementById('mapStatus').textContent=state.route?`Route visible · ${state.route.involvedFloors.join(' → ')}`:'Select a place to explore';
}
export function setZoom(change) {zoom=Math.max(.7,Math.min(2.8,zoom*change));updateTransform();}
export function resetView(){zoom=1;panX=0;panY=0;updateTransform();}
export function bindMap(onPick){
  placePicked=onPick;
  placesGroup.addEventListener('click',e=>{
    const element=e.target.closest('[data-place]');if(element)placePicked(element.dataset.place);
  });
  placesGroup.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){const element=e.target.closest('[data-place]');if(element){e.preventDefault();placePicked(element.dataset.place);}}
  });
  canvas.addEventListener('pointerdown',e=>{
    if(e.target.closest('[data-place]'))return;
    drag={x:e.clientX,y:e.clientY,panX,panY};canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');
  });
  canvas.addEventListener('pointermove',e=>{
    if(!drag)return;
    const b=canvas.getBoundingClientRect(),factor=1000/b.width;
    panX=drag.panX+(e.clientX-drag.x)*factor;panY=drag.panY+(e.clientY-drag.y)*factor;updateTransform();
  });
  const stop=()=>{drag=null;canvas.classList.remove('dragging');};
  canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);
  canvas.addEventListener('wheel',e=>{e.preventDefault();setZoom(e.deltaY<0?1.12:1/1.12);},{passive:false});
  document.getElementById('zoomIn').addEventListener('click',()=>setZoom(1.2));
  document.getElementById('zoomOut').addEventListener('click',()=>setZoom(1/1.2));
  document.getElementById('resetView').addEventListener('click',resetView);
}
