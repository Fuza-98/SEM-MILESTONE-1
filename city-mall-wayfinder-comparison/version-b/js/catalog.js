// Illustrative demo locations. These do not represent the official IOI City Mall directory.
export const FLOOR_NAMES = {G: "Ground Floor", L1: "Level 1", L2: "Level 2"};
export const FLOORS = ["G", "L1", "L2"];
export const CATEGORIES = ["All", "Shopping", "Food", "Entertainment", "Facilities"];
export const PLACES = [
  {
    "id": "g-1",
    "name": "The Market",
    "floor": "G",
    "category": "Shopping",
    "description": "Fresh finds and everyday essentials.",
    "slot": 0
  },
  {
    "id": "g-2",
    "name": "Mode & Co.",
    "floor": "G",
    "category": "Shopping",
    "description": "Fashion and personal style.",
    "slot": 1
  },
  {
    "id": "g-3",
    "name": "Bean Street",
    "floor": "G",
    "category": "Food",
    "description": "Coffee, pastries and quick breaks.",
    "slot": 2
  },
  {
    "id": "g-4",
    "name": "Urban Athletics",
    "floor": "G",
    "category": "Shopping",
    "description": "Sports gear and activewear.",
    "slot": 3
  },
  {
    "id": "g-5",
    "name": "Noodle House",
    "floor": "G",
    "category": "Food",
    "description": "Warm bowls and casual dining.",
    "slot": 4
  },
  {
    "id": "g-6",
    "name": "Bloom Beauty",
    "floor": "G",
    "category": "Shopping",
    "description": "Beauty and skincare.",
    "slot": 5
  },
  {
    "id": "g-7",
    "name": "Family Mart",
    "floor": "G",
    "category": "Shopping",
    "description": "Convenience and snacks.",
    "slot": 6
  },
  {
    "id": "g-8",
    "name": "The Patio",
    "floor": "G",
    "category": "Food",
    "description": "Relaxed dining spot.",
    "slot": 7
  },
  {
    "id": "g-facility-1",
    "name": "West Entrance",
    "floor": "G",
    "category": "Facilities",
    "description": "West-side entry to the mall.",
    "slot": null,
    "x": 130,
    "y": 335
  },
  {
    "id": "g-facility-2",
    "name": "Lift Lobby",
    "floor": "G",
    "category": "Facilities",
    "description": "Lift connection between floors.",
    "slot": null,
    "x": 500,
    "y": 335
  },
  {
    "id": "g-facility-3",
    "name": "Restrooms",
    "floor": "G",
    "category": "Facilities",
    "description": "Restroom facilities.",
    "slot": null,
    "x": 870,
    "y": 335
  },
  {
    "id": "l1-1",
    "name": "The Book Loft",
    "floor": "L1",
    "category": "Shopping",
    "description": "Books and stationery.",
    "slot": 0
  },
  {
    "id": "l1-2",
    "name": "Pixel & Play",
    "floor": "L1",
    "category": "Shopping",
    "description": "Gadgets and accessories.",
    "slot": 1
  },
  {
    "id": "l1-3",
    "name": "Canvas Fashion",
    "floor": "L1",
    "category": "Shopping",
    "description": "Contemporary clothing.",
    "slot": 2
  },
  {
    "id": "l1-4",
    "name": "Kicks Corner",
    "floor": "L1",
    "category": "Shopping",
    "description": "Shoes and streetwear.",
    "slot": 3
  },
  {
    "id": "l1-5",
    "name": "Sweet Atelier",
    "floor": "L1",
    "category": "Food",
    "description": "Desserts and baked treats.",
    "slot": 4
  },
  {
    "id": "l1-6",
    "name": "Home Stories",
    "floor": "L1",
    "category": "Shopping",
    "description": "Home essentials and décor.",
    "slot": 5
  },
  {
    "id": "l1-7",
    "name": "Toy Galaxy",
    "floor": "L1",
    "category": "Entertainment",
    "description": "Toys, games and collectables.",
    "slot": 6
  },
  {
    "id": "l1-8",
    "name": "The Coffee Club",
    "floor": "L1",
    "category": "Food",
    "description": "Drinks and light meals.",
    "slot": 7
  },
  {
    "id": "l1-facility-1",
    "name": "West Escalator",
    "floor": "L1",
    "category": "Facilities",
    "description": "Escalator access near the west wing.",
    "slot": null,
    "x": 130,
    "y": 335
  },
  {
    "id": "l1-facility-2",
    "name": "Lift Lobby",
    "floor": "L1",
    "category": "Facilities",
    "description": "Lift connection between floors.",
    "slot": null,
    "x": 500,
    "y": 335
  },
  {
    "id": "l1-facility-3",
    "name": "Restrooms",
    "floor": "L1",
    "category": "Facilities",
    "description": "Restroom facilities.",
    "slot": null,
    "x": 870,
    "y": 335
  },
  {
    "id": "l2-1",
    "name": "Cinema Hall",
    "floor": "L2",
    "category": "Entertainment",
    "description": "Big-screen movie experiences.",
    "slot": 0
  },
  {
    "id": "l2-2",
    "name": "Food Junction",
    "floor": "L2",
    "category": "Food",
    "description": "A mix of tasty meals.",
    "slot": 1
  },
  {
    "id": "l2-3",
    "name": "Adventure Park",
    "floor": "L2",
    "category": "Entertainment",
    "description": "Indoor adventure activities.",
    "slot": 2
  },
  {
    "id": "l2-4",
    "name": "Game Arcade",
    "floor": "L2",
    "category": "Entertainment",
    "description": "Arcade games and challenges.",
    "slot": 3
  },
  {
    "id": "l2-5",
    "name": "Garden Kitchen",
    "floor": "L2",
    "category": "Food",
    "description": "Casual food and refreshments.",
    "slot": 4
  },
  {
    "id": "l2-6",
    "name": "Wellness Hub",
    "floor": "L2",
    "category": "Shopping",
    "description": "Wellness and personal care.",
    "slot": 5
  },
  {
    "id": "l2-7",
    "name": "Kids Studio",
    "floor": "L2",
    "category": "Entertainment",
    "description": "Creative fun for younger visitors.",
    "slot": 6
  },
  {
    "id": "l2-8",
    "name": "Dessert Bar",
    "floor": "L2",
    "category": "Food",
    "description": "Sweet treats to go.",
    "slot": 7
  },
  {
    "id": "l2-facility-1",
    "name": "Prayer Room",
    "floor": "L2",
    "category": "Facilities",
    "description": "Quiet facility area.",
    "slot": null,
    "x": 130,
    "y": 335
  },
  {
    "id": "l2-facility-2",
    "name": "Lift Lobby",
    "floor": "L2",
    "category": "Facilities",
    "description": "Lift connection between floors.",
    "slot": null,
    "x": 500,
    "y": 335
  },
  {
    "id": "l2-facility-3",
    "name": "Restrooms",
    "floor": "L2",
    "category": "Facilities",
    "description": "Restroom facilities.",
    "slot": null,
    "x": 870,
    "y": 335
  }
];
