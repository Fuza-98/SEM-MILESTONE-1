// Run from the comparison folder: node tests/route-parity.mjs
import assert from 'node:assert/strict';
import {PLACES as placesA} from '../version-a/js/data.js';
import {findRoute} from '../version-a/js/routing.js';
import {PLACES as placesB} from '../version-b/js/catalog.js';
import {Building} from '../version-b/js/building.js';
import {RoutePlanner} from '../version-b/js/navigation.js';

assert.deepEqual(placesA,placesB,'Both versions must use the same directory.');
const navigatorB=new RoutePlanner(new Building(),placesB);
let checked=0;
for (const from of placesA) {
  for (const to of placesA) {
    const routeA=findRoute(from.id,to.id),routeB=navigatorB.calculate(from.id,to.id);
    if(from.id===to.id){assert.equal(routeA,null);assert.equal(routeB,null);continue;}
    assert.ok(routeA&&routeB,`${from.name} to ${to.name} must be navigable`);
    assert.equal(routeA.metres,routeB.metres,`${from.id} → ${to.id} distance`);
    assert.equal(routeA.minutes,routeB.minutes,`${from.id} → ${to.id} time`);
    assert.deepEqual(routeA.involvedFloors,routeB.involvedFloors,`${from.id} → ${to.id} floors`);
    assert.deepEqual(routeA.path.map(p=>p.id),routeB.path.map(p=>p.id),`${from.id} → ${to.id} nodes`);
    checked++;
  }
}
console.log(`PASS: Identical directory (${placesA.length} locations) and ${checked} point-to-point routes.`);
