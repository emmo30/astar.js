var Tile = require('./tile');
/// Class A* dit A etoile issue de l'algorithme AStar
/// Permetant de trouver un chemin le plus rapidement possible
/*
*Export Astart
*/
module.exports = Astar;
/*
*Constructor
*@arg [Tile]Start, [Tile]End, [Rectangle]limit
*/
function Astar(Start, End, Limit){
	this.Start = Start;
	this.End = End;
	this.Limit = Limit;
	this.Finded = false;
	this.Path = [];
	this.Road = [];
	this.find();
};
/*
*Cette fonction retourne une liste de Tile
*/
Astar.prototype.find = function() {
	this.Open = [] ;
    this.Closed = [];
	this.Open.push(this.Start);
	l = null;
	while (l != this.End && this.Open.length != 0 && this.End.Parent == null){
        l = FindBestNode(this.Open);
        if (l == this.End)
            continue;
        else{
        	this.Open.splice(this.Open.indexOf(l), 1);
            this.Closed.push(l);
            l.Region = Tile.DisplayRegion.Closed;
            try{
                for (var i = 0; i < l.AdjacencyList.length; i++) {
                	var adj = l.AdjacencyList[i];
                	if(adj != null){
    	            	if(adj.Type == Tile.TileType.NotPassable || this.Closed.indexOf(adj)> -1)
    	            		continue;
    	            	if(this.Open.indexOf(adj) == -1){
    	            		AddToOpenList(this.Open, adj, l, this.End);
    	            		adj.Parent = l;
    	            	}
    	            	else{
    	            		var newDistance = l.DistanceFromStart + DistanceSquared(l, adj);
    	            		if(newDistance < adj.DistanceFromStart){
    	            			adj.Parent = l;
    	            			adj.DistanceFromStart = newDistance;
    	            		}
    	            	}
    	            }
                };
            }
            catch(e){}
        }
    }
    if (this.End.Parent != null)
        this.GeneratePath(this.Start, this.End);

    this.Start.Region = Tile.DisplayRegion.Start;
};
/*
*Fonction qui va generer la route final
*@arg Start Tile/end Tile
*/
Astar.prototype.GeneratePath = function(start, end){
    this.Finded = true;
    this.Path = [];
    this.Road = [];
    var p = end.Parent;
    while (p != start){
        this.Path.push(p);
        p.Region = Tile.DisplayRegion.InPath;
        p = p.Parent;
    }
    for (var i = this.Path.length - 1 ; i >= 0; i--)
    	this.Road.push({X:this.Path[i].MapLocation.X, Y:this.Path[i].MapLocation.Y});
};

/*
*Fonction qui retourne le Delta
*@arg Tile a/ Tile b
*private
*/
function DistanceSquared(TileA, TileB){
	var deltaX = Math.abs(TileB.MapLocation.X - TileA.MapLocation.X);
    var deltay = Math.abs(TileB.MapLocation.Y - TileA.MapLocation.Y);
    return deltaX + deltay;
};

/*
*Fonction Qui retourne le meilleur Node
*@arg open Array[Tile]
*private
*/
function FindBestNode(open){
    var lowest = open[0];
    var n = null;

    for (var i = 1; i < open.length; i++)
    {
        n = open[i];
        if (n.Heuristic() < lowest.Heuristic())
            lowest = n;
        else if (n.Heuristic() == lowest.Heuristic())
        {
            if (lowest.DistanceToEnd > n.DistanceToEnd)
                lowest = n;
            else if (lowest.DistanceToEnd == n.DistanceToEnd && lowest.DistanceFromStart > n.DistanceFromStart)
                lowest = n;
        }
    }

    return lowest;
}
/*
*Fonction Qui ajoute le Tile dans la liste
*@arg Open Array[Tile]/adj Tile/l Tile/end Tile
*private
*/
function AddToOpenList(open, adj, l, end){
    adj.DistanceFromStart = l.DistanceFromStart + DistanceSquared(l, adj);
    adj.DistanceToEnd = DistanceSquared(adj, end);
    open.push(adj);
}
/*
*Fonction Qui genere les Tiles Adjacent
*@arg Tiles[tile]/Rectangle Limit
*private
*/
function GenerateAdjacencyList(tiles, Limit, HV){
    for (var j = 0; j < Limit.Height; j++)
        for (var i = 0; i < Limit.Width; i++){
            tiles[i][j].AddToAdjacencyList(GetTile(tiles,Limit, i - 1, j));
            tiles[i][j].AddToAdjacencyList(GetTile(tiles,Limit, i, j - 1));
            tiles[i][j].AddToAdjacencyList(GetTile(tiles,Limit, i, j + 1));
            tiles[i][j].AddToAdjacencyList(GetTile(tiles,Limit, i + 1, j));
            if(!HV){
                tiles[i][j].AddToAdjacencyList(GetTile(tiles,Limit, i - 1, j - 1));
                tiles[i][j].AddToAdjacencyList(GetTile(tiles,Limit, i - 1, j + 1));
                tiles[i][j].AddToAdjacencyList(GetTile(tiles,Limit, i + 1, j - 1));
                tiles[i][j].AddToAdjacencyList(GetTile(tiles,Limit, i + 1, j + 1));
            }
        }
    return tiles;
}
/*
*Fonction Retourne le Tile questionne
*@arg Tiles[Tile]/Rectangle Limit/int row/int column
*private
*/
function GetTile(tiles, Limit, row, column){
    if (row < 0 || row >= Limit.Width || column < 0 || column >= Limit.Height)
        return null;
    else
        return tiles[row][column];
}
/*
*Class Rectangle
*/
module.exports.Rectangle = function Rectangle(x,y,width,height){
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
};
/*
*Permet de generer un tableau 2D pour pouvoir calculer le deplacement des uniter
*@arg Vecteur2 start/Vecteur2 End/Rectangle Limit/[Rectangle] Collidable/Bolean HV
*/
module.exports.Tiles = Tiles;
function Tiles(Start, End, Limit, Collidable, HV){
	var t = [];
    var hv =(typeof HV != "undefined")?HV:false;
	t.length = Limit.Width;
	for (var i = 0; i < Limit.Width; i++) {
		t[i] = [];
		t[i].length = Limit.Height;
		for(var j = 0; j < Limit.Height; j++){
			t[i][j] = new Tile({X:i,Y:j});
			t[i][j].Region = Tile.DisplayRegion.Passable;
		}
	};
    t[Math.floor(Start.X)][Math.floor(Start.Y)].Region = Tile.DisplayRegion.Start;
    t[Math.floor(End.X)][Math.floor(End.Y)].Region = Tile.DisplayRegion.Finish;
    var Colist = Collidable || [];
	for (var i = 0; i < Colist.length; i++) {
        var col = Colist[i];
        t[col.X][col.Y].Type = Tile.TileType.NotPassable;
        t[col.X][col.Y].Region = Tile.DisplayRegion.NotPassable;
	};
    return GenerateAdjacencyList(t, Limit, hv);
}