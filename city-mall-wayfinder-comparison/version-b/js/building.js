// The geometry is deliberately simple. Each tenant opens onto one central hallway.
export class Building {
  constructor(){
    this.floors=['G','L1','L2'];
    this.corridorY=335;
    this.corridorStops=[130,196,389,500,611,804,870];
    this.metresPerUnit=.32;
    this.liftDistance=40;
    this.rooms=[
      [109,146,174,140],[302,146,174,140],[524,146,174,140],[717,146,174,140],
      [109,386,174,140],[302,386,174,140],[524,386,174,140],[717,386,174,140]
    ];
  }
  position(place){
    if(place.slot===null)return {x:place.x,y:place.y};
    const [x,y,w,h]=this.rooms[place.slot];
    return {x:x+w/2,y:y+h/2};
  }
  corridorFor(x){
    let winner=this.corridorStops[0];
    this.corridorStops.forEach(stop=>{if(Math.abs(x-stop)<Math.abs(x-winner))winner=stop;});
    return winner;
  }
  floorIndex(floor){return this.floors.indexOf(floor);}
}
