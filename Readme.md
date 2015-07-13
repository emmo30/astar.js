
# Find2d (Astar)

- [Install](#install)
- [How to use](#how-to-use)
- [With Collidable Object Rectangle](#with-collidable-object-rectangle)

## Install

```sh
$ npm install find2d
```

## How to use

```js
var astar = require('find2d');
//Game Area Rectangle
var Rectangle = new Astar.Rectangle(0,0,20,20);
//PointA = Start point;
var PointA = {X:0,Y:0},
//PointB = End point; 
    PointB = {X:19,Y:19};
//Generate Tiles
var t = Astar.Tiles(PointA, PointB, Rectangle);

var AS = new Astar(t[PointA.X][PointA.Y], t[PointB.X][PointB.Y], Rectangle);

console.log(AS.Road);
```

## With Collidable Object Rectangle


```js
var astar = require('find2d');
//Game Area Rectangle
var Rectangle = new Astar.Rectangle(0,0,20,20);
//PointA = Start point;
var PointA = {X:0,Y:0},
//PointB = End point; 
	PointB = {X:19,Y:19};

var Collidable = [];
Collidable.push(new Astar.Rectangle(2,2,1,1));
Collidable.push(new Astar.Rectangle(2,3,1,1));
Collidable.push(new Astar.Rectangle(2,4,1,1));

//Generate Tiles
var t = Astar.Tiles(PointA, PointB, Rectangle, Collidable);

var AS = new Astar(t[PointA.X][PointA.Y], t[PointB.X][PointB.Y], Rectangle);

console.log(AS.Road);
```

By default search method is Horizontal and Vertical
for define diagonal search you can change this value and initialise the Tiles

```js
#default value H/V
var t = Astar.Tiles(PointA, PointB, Rectangle, false);
#Diagonal search road
var t = Astar.Tiles(PointA, PointB, Rectangle, true);
```
