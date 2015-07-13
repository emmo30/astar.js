/*
* Export Tile
*/

module.exports = Tile;

/*
*Constructor Tile
*@arg location/type
*location = {X:0,Y:0}
*type = enum
*/
function Tile(location,type){
	this.MapLocation = location;
	this.Type = (typeof type != 'undefined')?type:TileType.Passable;
	this.DistanceFromStart = 0;
};

/*
*Enumerations DisplayRegion
*/
module.exports.DisplayRegion = DisplayRegion ={
    Passable : 0,
    Start : 1,
    Finish : 2,
    NotPassable : 3,
    InPath : 4,
    Closed : 5
};

/*
*Enumerations TileType
*/
module.exports.TileType = TileType ={
    Passable : 0,
    NotPassable : 1
};
/*
* public Heuristic
* return int Heuristic
*/
Tile.prototype.Heuristic = function() {
	return (this.DistanceFromStart + this.DistanceToEnd);
};
/*
* public AddToAdjacencyList
* set Tile
*/
Tile.prototype.AddToAdjacencyList = function(t){
    if (typeof t == 'undefined') return;
    if (typeof this.AdjacencyList == 'undefined')
        this.AdjacencyList = [];
    this.AdjacencyList.push(t);
}