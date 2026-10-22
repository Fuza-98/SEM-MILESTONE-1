// Coordinates use a 1000×700 SVG viewBox. The building diagram is intentionally illustrative.
export const ROOM_SLOTS = [
  {x:109,y:146,w:174,h:140}, {x:302,y:146,w:174,h:140},
  {x:524,y:146,w:174,h:140}, {x:717,y:146,w:174,h:140},
  {x:109,y:386,w:174,h:140}, {x:302,y:386,w:174,h:140},
  {x:524,y:386,w:174,h:140}, {x:717,y:386,w:174,h:140}
];
export const CORRIDOR_Y = 335;
export const CORRIDOR_X = [130,196,389,500,611,804,870];
export const METRES_PER_UNIT = 0.32;
export const LIFT_TRAVEL_METRES = 40;

export function positionOf(place) {
  if (place.slot === null) return {x:place.x,y:place.y};
  const box = ROOM_SLOTS[place.slot];
  return {x:box.x + box.w/2,y:box.y + box.h/2};
}
export function nearestCorridorX(x) {
  return CORRIDOR_X.reduce((best,next) => Math.abs(next-x)<Math.abs(best-x)?next:best, CORRIDOR_X[0]);
}
