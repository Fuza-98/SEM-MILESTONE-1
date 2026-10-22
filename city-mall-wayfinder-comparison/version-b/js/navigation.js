import {FLOOR_NAMES} from './catalog.js';

export class RoutePlanner {
  constructor(building,places){
    this.building=building;
    this.places=places;
    this.nodes=new Map();
    this.constructNetwork();
  }
  addNode(key,floor,x,y){this.nodes.set(key,{id:key,floor,x,y,neighbors:[]});}
  connect(a,b,cost){
    this.nodes.get(a).neighbors.push({to:b,cost});
    this.nodes.get(b).neighbors.push({to:a,cost});
  }
  hall(floor,x){return `hall:${floor}:${x}`;}
  poi(id){return `place:${id}`;}
  constructNetwork(){
    const b=this.building;
    b.floors.forEach(f=>{
      b.corridorStops.forEach(x=>this.addNode(this.hall(f,x),f,x,b.corridorY));
      b.corridorStops.slice(1).forEach((x,i)=>{
        const prev=b.corridorStops[i];
        this.connect(this.hall(f,prev),this.hall(f,x),(x-prev)*b.metresPerUnit);
      });
    });
    this.places.forEach(place=>{
      const point=b.position(place),entry=b.corridorFor(point.x);
      this.addNode(this.poi(place.id),place.floor,point.x,point.y);
      const walk=(Math.abs(point.x-entry)+Math.abs(point.y-b.corridorY))*b.metresPerUnit;
      this.connect(this.poi(place.id),this.hall(place.floor,entry),walk);
    });
    b.floors.slice(1).forEach((f,i)=>this.connect(this.hall(b.floors[i],500),this.hall(f,500),b.liftDistance));
  }
  calculate(from,to){
    const first=this.poi(from),last=this.poi(to);
    if(first===last||!this.nodes.has(first)||!this.nodes.has(last))return null;
    const costs=new Map(),parent=new Map(),unvisited=new Set();
    for(const key of this.nodes.keys()){costs.set(key,Infinity);unvisited.add(key);}
    costs.set(first,0);
    while(unvisited.size>0){
      let active=null;
      unvisited.forEach(key=>{if(active===null||costs.get(key)<costs.get(active))active=key;});
      if(active===null||costs.get(active)===Infinity||active===last)break;
      unvisited.delete(active);
      this.nodes.get(active).neighbors.forEach(edge=>{
        const newCost=costs.get(active)+edge.cost;
        if(newCost<costs.get(edge.to)){costs.set(edge.to,newCost);parent.set(edge.to,active);}
      });
    }
    if(!Number.isFinite(costs.get(last)))return null;
    let cursor=last;
    const path=[];
    while(cursor){path.unshift(this.nodes.get(cursor));if(cursor===first)break;cursor=parent.get(cursor);}
    if(path[0]?.id!==first)return null;
    const startPlace=this.places.find(p=>p.id===from),endPlace=this.places.find(p=>p.id===to);
    const involvedFloors=Array.from(new Set(path.map(n=>n.floor)));
    const steps=[{title:`Start at ${startPlace.name}`,detail:`Head towards the central corridor on ${FLOOR_NAMES[startPlace.floor]}.`}];
    involvedFloors.slice(1).forEach(f=>steps.push({title:`Take the lift to ${FLOOR_NAMES[f]}`,detail:'Use the lift at the central atrium to change levels.'}));
    steps.push({title:`Arrive at ${endPlace.name}`,detail:`Follow the corridor signs on ${FLOOR_NAMES[endPlace.floor]}.`});
    const metres=Math.round(costs.get(last));
    return {path,metres,minutes:Math.max(1,Math.ceil(metres/75)),involvedFloors,steps};
  }
}
