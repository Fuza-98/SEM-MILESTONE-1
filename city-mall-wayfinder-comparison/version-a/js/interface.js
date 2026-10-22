import {PLACES, FLOORS, FLOOR_NAMES, CATEGORIES} from './data.js';

const $=id=>document.getElementById(id);
const getPlace=id=>PLACES.find(p=>p.id===id);
const html=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let actions;

function filteredOptions(term) {
  const q=term.trim().toLowerCase();
  return PLACES.filter(p=>(p.name+' '+p.category+' '+FLOOR_NAMES[p.floor]).toLowerCase().includes(q)).slice(0,9);
}
function closeDropdowns() {for(const kind of ['from','to'])$(kind+'Suggestions').hidden=true;}
function showDropdown(kind) {
  const input=$(kind+'Input'),list=$(kind+'Suggestions');
  const options=filteredOptions(input.value);
  list.replaceChildren();
  if(!options.length)list.innerHTML='<div class="no-suggestions">No matching locations</div>';
  for (const place of options) {
    const button=document.createElement('button');button.type='button';button.className='suggestion';button.setAttribute('role','option');
    button.innerHTML=`<span class="suggestion-icon">⌖</span><span><strong>${html(place.name)}</strong><small>${FLOOR_NAMES[place.floor]} · ${place.category}</small></span>`;
    button.addEventListener('mousedown',e=>e.preventDefault());
    button.addEventListener('click',()=>{closeDropdowns();actions.setPoint(kind,place.id);});
    list.append(button);
  }
  list.hidden=false;
}
function routeMarkup(state) {
  if(state.error)return `<div class="route-error">${html(state.error)}</div>`;
  if(!state.route)return `<div class="empty-route"><span class="empty-route-icon">↗</span><strong>Ready when you are</strong><p>Choose your starting point and destination to see an indoor walking route.</p></div>`;
  const r=state.route;
  return `<div class="route-heading"><strong>Your walking route</strong><button type="button" data-action="resetRoute">Clear route ×</button></div>
    <div class="route-metrics"><div class="metric"><strong>${r.metres} m</strong><small>Approx. distance</small></div><div class="metric"><strong>${r.minutes} min</strong><small>Estimated walk</small></div></div>
    <div class="route-steps">${r.steps.map((s,i)=>`<div class="step"><span class="step-index">${i+1}</span><div><strong>${html(s.title)}</strong><small>${html(s.detail)}</small></div></div>`).join('')}</div>
    <div class="route-floor-buttons">${r.involvedFloors.map(f=>`<button type="button" data-floor="${f}">Show ${html(FLOOR_NAMES[f])} →</button>`).join('')}</div>
    <p class="route-note">Illustrative walking distance. Follow on-site signage when visiting a real mall.</p>`;
}
function renderBrowse(state){
  const q=state.browseQuery.toLowerCase().trim();
  const matches=PLACES.filter(p=>(state.category==='All'||p.category===state.category)&&(p.name+' '+p.description+' '+FLOOR_NAMES[p.floor]).toLowerCase().includes(q));
  $('resultCount').textContent=`${matches.length} PLACES`;
  $('filterChips').querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category===state.category));
  $('placeList').innerHTML=matches.length?matches.map(p=>`<article class="place-card">
    <button type="button" class="place-card-main" data-action="pick" data-id="${p.id}"><span class="place-card-icon">${p.category==='Food'?'☕':p.category==='Shopping'?'▣':p.category==='Entertainment'?'✦':'⌖'}</span><span class="place-card-name"><strong>${html(p.name)}</strong><small>${FLOOR_NAMES[p.floor]} · ${p.category}</small></span><span class="place-card-chevron">›</span></button>
    <div class="place-card-actions"><button data-action="start" data-id="${p.id}" type="button">Set as start</button><button data-action="destination" data-id="${p.id}" type="button">Set as destination</button></div></article>`).join(''):'<p class="browse-empty">No locations found. Try another search or category.</p>';
}
function renderPopup(state){
  const popup=$('placePopup'),p=getPlace(state.selectedId);
  if(!p||p.floor!==state.floor){popup.hidden=true;return;}
  popup.innerHTML=`<div class="popup-top"><div><h3>${html(p.name)}</h3><div class="popup-location">${FLOOR_NAMES[p.floor]} · ${html(p.category)}</div></div><button type="button" data-action="closePopup" aria-label="Close place details">×</button></div><p class="popup-description">${html(p.description)}</p><div class="popup-buttons"><button type="button" data-action="start" data-id="${p.id}">Start here</button><button type="button" data-action="destination" data-id="${p.id}">Go here →</button></div>`;
  popup.hidden=false;
}
export function renderInterface(state){
  $('directionsPanel').hidden=state.tab!=='directions';$('browsePanel').hidden=state.tab!=='browse';
  $('tabDirections').classList.toggle('active',state.tab==='directions');$('tabBrowse').classList.toggle('active',state.tab==='browse');
  $('tabDirections').setAttribute('aria-selected',String(state.tab==='directions'));
  $('tabBrowse').setAttribute('aria-selected',String(state.tab==='browse'));
  for(const kind of ['from','to']) {
    const input=$(kind+'Input'),p=getPlace(state[kind+'Id']);
    if(document.activeElement!==input||p)input.value=p?p.name:'';
  }
  $('routeResult').innerHTML=routeMarkup(state);
  for(const button of $('floorButtons').children){button.classList.toggle('active',button.dataset.floor===state.floor);button.setAttribute('aria-pressed',String(button.dataset.floor===state.floor));}
  renderBrowse(state);
  renderPopup(state);
}
export function bindInterface(handlers){
  actions=handlers;
  $('floorButtons').innerHTML=FLOORS.map(f=>`<button type="button" class="floor-button" data-floor="${f}" aria-label="${FLOOR_NAMES[f]}">${f==='G'?'Ground':f.replace('L','L')}</button>`).join('');
  $('filterChips').innerHTML=CATEGORIES.map(c=>`<button type="button" class="filter-chip" data-category="${c}">${c}</button>`).join('');
  $('tabDirections').addEventListener('click',()=>actions.setTab('directions'));
  $('tabBrowse').addEventListener('click',()=>actions.setTab('browse'));
  for (const kind of ['from','to']) {
    const input=$(kind+'Input');
    input.addEventListener('focus',()=>showDropdown(kind));
    input.addEventListener('input',()=>{actions.onFieldEdited(kind);showDropdown(kind);});
    input.addEventListener('keydown',e=>{
      if(e.key==='Escape'){closeDropdowns();input.blur();}
      if(e.key==='Enter'){const option=$(kind+'Suggestions').querySelector('.suggestion');if(option){e.preventDefault();option.click();}}
    });
    $(kind+'Suggestions').addEventListener('pointerdown',e=>e.stopPropagation());
    $('clear'+(kind==='from'?'From':'To')).addEventListener('click',()=>{actions.setPoint(kind,null);input.focus();});
  }
  document.addEventListener('pointerdown',e=>{if(!e.target.closest('.field-wrap'))closeDropdowns();});
  $('swapButton').addEventListener('click',()=>{closeDropdowns();actions.swap();});
  $('routeButton').addEventListener('click',()=>{closeDropdowns();actions.find();});
  $('browseSearch').addEventListener('input',e=>actions.setQuery(e.target.value));
  $('filterChips').addEventListener('click',e=>{const el=e.target.closest('[data-category]');if(el)actions.setCategory(el.dataset.category);});
  $('floorButtons').addEventListener('click',e=>{const el=e.target.closest('[data-floor]');if(el)actions.setFloor(el.dataset.floor);});
  $('placeList').addEventListener('click',e=>dispatch(e));
  $('routeResult').addEventListener('click',e=>dispatch(e));
  $('placePopup').addEventListener('click',e=>dispatch(e));
  $('helpButton').addEventListener('click',()=>$('helpDialog').showModal());
  $('closeHelp').addEventListener('click',()=>$('helpDialog').close());
  $('helpDialog').addEventListener('click',e=>{if(e.target===$('helpDialog'))$('helpDialog').close();});
}
function dispatch(event){
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.floor){actions.setFloor(button.dataset.floor);return;}
  const id=button.dataset.id;
  switch(button.dataset.action){
    case 'start':actions.setPoint('from',id);break;
    case 'destination':actions.setPoint('to',id);break;
    case 'pick':actions.pick(id);break;
    case 'resetRoute':actions.clearRoute();break;
    case 'closePopup':actions.dismissPopup();break;
  }
}
