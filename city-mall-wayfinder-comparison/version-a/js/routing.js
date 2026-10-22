import {PLACES, FLOORS, FLOOR_NAMES} from './data.js';
import {CORRIDOR_X, CORRIDOR_Y, METRES_PER_UNIT, LIFT_TRAVEL_METRES, positionOf, nearestCorridorX} from './geometry.js';

const graph = new Map();
function addNode(id, floor, x, y) { graph.set(id, {id,floor,x,y,edges:[]}); }
function connect(a,b,distance) { graph.get(a).edges.push({id:b,distance}); graph.get(b).edges.push({id:a,distance}); }
function corridorId(floor,x) {return `hall:${floor}:${x}`;}
function placeId(id) {return `place:${id}`;}

for (const floor of FLOORS) {
  CORRIDOR_X.forEach(x=>addNode(corridorId(floor,x),floor,x,CORRIDOR_Y));
  for (let i=1;i<CORRIDOR_X.length;i++) {
    connect(corridorId(floor,CORRIDOR_X[i-1]),corridorId(floor,CORRIDOR_X[i]),(CORRIDOR_X[i]-CORRIDOR_X[i-1])*METRES_PER_UNIT);
  }
}
for (const place of PLACES) {
  const {x,y}=positionOf(place), hallway=nearestCorridorX(x);
  addNode(placeId(place.id),place.floor,x,y);
  connect(placeId(place.id),corridorId(place.floor,hallway),(Math.abs(x-hallway)+Math.abs(y-CORRIDOR_Y))*METRES_PER_UNIT);
}
for (let i=1;i<FLOORS.length;i++) connect(corridorId(FLOORS[i-1],500),corridorId(FLOORS[i],500),LIFT_TRAVEL_METRES);

/** An unoptimised but easy-to-read Dijkstra implementation for this small map. */
export function findRoute(startId,endId) {
  const start=placeId(startId), end=placeId(endId);
  if (!graph.has(start)||!graph.has(end)||start===end) return null;
  const distance=new Map([...graph.keys()].map(key=>[key,Infinity]));
  const previous=new Map();
  const unseen=new Set(graph.keys());
  distance.set(start,0);
  while (unseen.size) {
    let current=null;
    for (const id of unseen) if (current===null||distance.get(id)<distance.get(current)) current=id;
    if (current===null||distance.get(current)===Infinity||current===end) break;
    unseen.delete(current);
    for (const edge of graph.get(current).edges) {
      const next=distance.get(current)+edge.distance;
      if (next<distance.get(edge.id)) {distance.set(edge.id,next);previous.set(edge.id,current);}
    }
  }
  if (!Number.isFinite(distance.get(end))) return null;
  const path=[];
  for (let id=end;id;id=previous.get(id)) {path.unshift(graph.get(id));if(id===start)break;}
  if (path[0].id!==start) return null;
  const metres=Math.round(distance.get(end));
  const from=PLACES.find(p=>p.id===startId), to=PLACES.find(p=>p.id===endId);
  const involvedFloors=[...new Set(path.map(n=>n.floor))];
  const steps=[{title:`Start at ${from.name}`,detail:`Head towards the central corridor on ${FLOOR_NAMES[from.floor]}.`}];
  for (const floor of involvedFloors.slice(1)) steps.push({title:`Take the lift to ${FLOOR_NAMES[floor]}`,detail:'Use the lift at the central atrium to change levels.'});
  steps.push({title:`Arrive at ${to.name}`,detail:`Follow the corridor signs on ${FLOOR_NAMES[to.floor]}.`});
  return {path,metres,minutes:Math.max(1,Math.ceil(metres/75)),involvedFloors,steps};
}
