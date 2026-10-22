import {PLACES,FLOORS,FLOOR_NAMES,CATEGORIES} from './catalog.js';

const escape=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

export class Sidebar {
  constructor(send){
    this.send=send;
    this.controls={};
    ['fromInput','toInput','fromSuggestions','toSuggestions','routeResult','placeList','placePopup','filterChips','floorButtons','browseSearch','helpDialog'].forEach(id=>this.controls[id]=document.getElementById(id));
    this.setupControls();
  }
  find(id){return PLACES.find(p=>p.id===id);}
  setupControls(){
    const floorOptions=this.controls.floorButtons;
    floorOptions.innerHTML=FLOORS.map(f=>`<button class="floor-button" type="button" data-floor="${f}" aria-label="${FLOOR_NAMES[f]}">${f==='G'?'Ground':f}</button>`).join('');
    this.controls.filterChips.innerHTML=CATEGORIES.map(c=>`<button type="button" class="filter-chip" data-category="${c}">${c}</button>`).join('');
    document.getElementById('tabDirections').onclick=()=>this.send('tab','directions');
    document.getElementById('tabBrowse').onclick=()=>this.send('tab','browse');
    ['from','to'].forEach(which=>{
      const input=this.controls[which+'Input'];
      input.addEventListener('focus',()=>this.suggest(which));
      input.addEventListener('input',()=>{this.send('edit',which);this.suggest(which);});
      input.addEventListener('keydown',event=>{
        if(event.key==='Escape'){this.hideSuggestions();input.blur();}
        if(event.key==='Enter'){
          const candidate=this.controls[which+'Suggestions'].querySelector('.suggestion');
          if(candidate){event.preventDefault();candidate.click();}
        }
      });
      document.getElementById(which==='from'?'clearFrom':'clearTo').onclick=()=>{
        this.send('point',which,null);input.focus();
      };
    });
    document.addEventListener('pointerdown',event=>{if(!event.target.closest('.field-wrap'))this.hideSuggestions();});
    document.getElementById('swapButton').onclick=()=>{this.hideSuggestions();this.send('swap');};
    document.getElementById('routeButton').onclick=()=>{this.hideSuggestions();this.send('route');};
    this.controls.browseSearch.addEventListener('input',e=>this.send('query',e.target.value));
    floorOptions.addEventListener('click',e=>{const btn=e.target.closest('[data-floor]');if(btn)this.send('floor',btn.dataset.floor);});
    this.controls.filterChips.addEventListener('click',e=>{const btn=e.target.closest('[data-category]');if(btn)this.send('category',btn.dataset.category);});
    [this.controls.routeResult,this.controls.placeList,this.controls.placePopup].forEach(parent=>parent.addEventListener('click',e=>{
      const btn=e.target.closest('button');if(!btn)return;
      if(btn.dataset.floor)return this.send('floor',btn.dataset.floor);
      switch(btn.dataset.action){
        case 'start':this.send('point','from',btn.dataset.id);break;
        case 'destination':this.send('point','to',btn.dataset.id);break;
        case 'pick':this.send('pick',btn.dataset.id);break;
        case 'resetRoute':this.send('clearRoute');break;
        case 'closePopup':this.send('dismiss');break;
      }
    }));
    document.getElementById('helpButton').onclick=()=>this.controls.helpDialog.showModal();
    document.getElementById('closeHelp').onclick=()=>this.controls.helpDialog.close();
    this.controls.helpDialog.addEventListener('click',event=>{if(event.target===this.controls.helpDialog)this.controls.helpDialog.close();});
  }
  suggest(which){
    const input=this.controls[which+'Input'],popup=this.controls[which+'Suggestions'];
    const q=input.value.trim().toLowerCase();
    const matches=PLACES.filter(p=>(p.name+' '+p.category+' '+FLOOR_NAMES[p.floor]).toLowerCase().includes(q)).slice(0,9);
    if(!matches.length){popup.innerHTML='<div class="no-suggestions">No matching locations</div>';}
    else{
      popup.innerHTML=matches.map(p=>`<button class="suggestion" role="option" type="button" data-id="${p.id}"><span class="suggestion-icon">⌖</span><span><strong>${escape(p.name)}</strong><small>${FLOOR_NAMES[p.floor]} · ${escape(p.category)}</small></span></button>`).join('');
    }
    popup.hidden=false;
    // Delegation keeps the click handler even when results are rebuilt.
    popup.onclick=event=>{const selected=event.target.closest('[data-id]');if(!selected)return;this.hideSuggestions();this.send('point',which,selected.dataset.id);};
    popup.onmousedown=e=>e.preventDefault();
  }
  hideSuggestions(){this.controls.fromSuggestions.hidden=true;this.controls.toSuggestions.hidden=true;}
  renderRoute(state){
    const panel=this.controls.routeResult;
    if(state.error){panel.innerHTML=`<div class="route-error">${escape(state.error)}</div>`;return;}
    const r=state.route;
    if(!r){panel.innerHTML='<div class="empty-route"><span class="empty-route-icon">↗</span><strong>Ready when you are</strong><p>Choose your starting point and destination to see an indoor walking route.</p></div>';return;}
    const steps=r.steps.map((step,i)=>`<div class="step"><span class="step-index">${i+1}</span><div><strong>${escape(step.title)}</strong><small>${escape(step.detail)}</small></div></div>`).join('');
    const floors=r.involvedFloors.map(f=>`<button type="button" data-floor="${f}">Show ${FLOOR_NAMES[f]} →</button>`).join('');
    panel.innerHTML=`<div class="route-heading"><strong>Your walking route</strong><button data-action="resetRoute" type="button">Clear route ×</button></div>
      <div class="route-metrics"><div class="metric"><strong>${r.metres} m</strong><small>Approx. distance</small></div><div class="metric"><strong>${r.minutes} min</strong><small>Estimated walk</small></div></div>
      <div class="route-steps">${steps}</div><div class="route-floor-buttons">${floors}</div>
      <p class="route-note">Illustrative walking distance. Follow on-site signage when visiting a real mall.</p>`;
  }
  renderPlaces(state){
    const query=state.browseQuery.trim().toLowerCase();
    const results=PLACES.filter(place=>{
      const categoryOkay=state.category==='All'||state.category===place.category;
      const searchOkay=(place.name+' '+place.description+' '+FLOOR_NAMES[place.floor]).toLowerCase().includes(query);
      return categoryOkay&&searchOkay;
    });
    document.getElementById('resultCount').textContent=results.length+' PLACES';
    this.controls.filterChips.querySelectorAll('[data-category]').forEach(el=>el.classList.toggle('active',el.dataset.category===state.category));
    this.controls.placeList.innerHTML=results.length?results.map(p=>{
      const symbol=p.category==='Food'?'☕':p.category==='Shopping'?'▣':p.category==='Entertainment'?'✦':'⌖';
      return `<article class="place-card"><button class="place-card-main" type="button" data-action="pick" data-id="${p.id}"><span class="place-card-icon">${symbol}</span><span class="place-card-name"><strong>${escape(p.name)}</strong><small>${FLOOR_NAMES[p.floor]} · ${p.category}</small></span><span class="place-card-chevron">›</span></button><div class="place-card-actions"><button type="button" data-action="start" data-id="${p.id}">Set as start</button><button type="button" data-action="destination" data-id="${p.id}">Set as destination</button></div></article>`;
    }).join(''):'<p class="browse-empty">No locations found. Try another search or category.</p>';
  }
  renderPopup(state){
    const popup=this.controls.placePopup,p=this.find(state.selectedId);
    if(!p||p.floor!==state.floor){popup.hidden=true;return;}
    popup.innerHTML=`<div class="popup-top"><div><h3>${escape(p.name)}</h3><div class="popup-location">${FLOOR_NAMES[p.floor]} · ${escape(p.category)}</div></div><button type="button" data-action="closePopup" aria-label="Close place details">×</button></div><p class="popup-description">${escape(p.description)}</p><div class="popup-buttons"><button type="button" data-action="start" data-id="${p.id}">Start here</button><button type="button" data-action="destination" data-id="${p.id}">Go here →</button></div>`;
    popup.hidden=false;
  }
  render(state){
    const isDirections=state.tab==='directions';
    document.getElementById('directionsPanel').hidden=!isDirections;
    document.getElementById('browsePanel').hidden=isDirections;
    ['Directions','Browse'].forEach((name,i)=>{
      const active=i===0?isDirections:!isDirections;
      const tab=document.getElementById('tab'+name);tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));
    });
    ['from','to'].forEach(which=>{
      const input=this.controls[which+'Input'],place=this.find(state[which+'Id']);
      if(document.activeElement!==input||place)input.value=place?place.name:'';
    });
    this.controls.floorButtons.querySelectorAll('button').forEach(el=>{
      const active=el.dataset.floor===state.floor;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));
    });
    this.renderRoute(state);
    this.renderPlaces(state);
    this.renderPopup(state);
  }
}
