import {PLACES} from './catalog.js';
import {Building} from './building.js';
import {RoutePlanner} from './navigation.js';
import {FloorMap} from './floorMap.js';
import {Sidebar} from './sidebar.js';

class WayfinderApp {
  constructor(){
    this.state={floor:'G',tab:'directions',fromId:'g-facility-1',toId:null,selectedId:null,
      route:null,error:'',category:'All',browseQuery:''};
    this.building=new Building();
    this.planner=new RoutePlanner(this.building,PLACES);
    this.sidebar=new Sidebar(this.dispatch.bind(this));
    this.map=new FloorMap(this.building,id=>this.dispatch('pick',id));
    this.render();
  }
  place(id){return PLACES.find(p=>p.id===id);}
  dispatch(type,arg,additional){
    const s=this.state;
    switch(type){
      case 'tab':s.tab=arg;break;
      case 'floor':s.floor=arg;s.selectedId=null;break;
      case 'pick':{
        const place=this.place(arg);
        if(place){s.selectedId=arg;s.floor=place.floor;}
        break;
      }
      case 'dismiss':s.selectedId=null;break;
      case 'point':{
        s[arg+'Id']=additional;
        if(additional){s.selectedId=additional;s.floor=this.place(additional).floor;}
        s.route=null;s.error='';s.tab='directions';break;
      }
      case 'edit':{
        s[arg+'Id']=null;s.route=null;s.error='';s.selectedId=null;
        // Preserve the in-progress text in the focused input while refreshing its result panel.
        this.render();
        return;
      }
      case 'swap':{
        const old=s.fromId;s.fromId=s.toId;s.toId=old;s.route=null;s.error='';break;
      }
      case 'route':{
        if(!s.fromId||!s.toId){s.error='Select both a starting point and a destination to calculate the route.';s.route=null;break;}
        if(s.fromId===s.toId){s.error='Choose two different locations to calculate a route.';s.route=null;break;}
        s.route=this.planner.calculate(s.fromId,s.toId);
        s.error=s.route?'':'No route was found between these places.';
        s.floor=this.place(s.fromId).floor;s.selectedId=null;s.tab='directions';break;
      }
      case 'clearRoute':s.route=null;s.error='';break;
      case 'query':s.browseQuery=arg;break;
      case 'category':s.category=arg;break;
      default:return;
    }
    this.render();
  }
  render(){this.sidebar.render(this.state);this.map.render(this.state);}
}
new WayfinderApp();
