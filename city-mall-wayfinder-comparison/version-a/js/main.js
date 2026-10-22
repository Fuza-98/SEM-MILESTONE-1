import {PLACES} from './data.js';
import {findRoute} from './routing.js';
import {bindMap,renderMap} from './map.js';
import {bindInterface,renderInterface} from './interface.js';

const state={
  floor:'G', tab:'directions', fromId:'g-facility-1',toId:null,selectedId:null,
  route:null,error:'',category:'All',browseQuery:''
};
const getPlace=id=>PLACES.find(p=>p.id===id);
function render(){renderInterface(state);renderMap(state);}
const actions={
  setTab(tab){state.tab=tab;render();},
  setFloor(floor){state.floor=floor;state.selectedId=null;render();},
  pick(id){const p=getPlace(id);if(!p)return;state.selectedId=id;state.floor=p.floor;render();},
  dismissPopup(){state.selectedId=null;render();},
  setPoint(kind,id){
    state[kind+'Id']=id;
    if(id){state.floor=getPlace(id).floor;state.selectedId=id;}
    state.error='';state.route=null;state.tab='directions';render();
  },
  onFieldEdited(kind){
    state[kind+'Id']=null;state.route=null;state.error='';state.selectedId=null;
    render();
  },
  swap(){[state.fromId,state.toId]=[state.toId,state.fromId];state.route=null;state.error='';render();},
  find(){
    if(!state.fromId||!state.toId){state.error='Select both a starting point and a destination to calculate the route.';state.route=null;render();return;}
    if(state.fromId===state.toId){state.error='Choose two different locations to calculate a route.';state.route=null;render();return;}
    state.route=findRoute(state.fromId,state.toId);
    state.error=state.route?'':'No route was found between these places.';
    state.floor=getPlace(state.fromId).floor;state.selectedId=null;state.tab='directions';render();
  },
  clearRoute(){state.route=null;state.error='';render();},
  setQuery(text){state.browseQuery=text;render();},
  setCategory(category){state.category=category;render();}
};
bindInterface(actions);
bindMap(actions.pick);
render();
