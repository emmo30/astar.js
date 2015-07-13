var app = require('express')();
var server = require('http').Server(app); 
var fs = require('fs');
var Astar = require('find2d');

var rec = new Astar.Rectangle(0,0,8,6);
var Echelle = 100;
var a,b, canvas;
var Collidable = [];

app.get('/', function (req, res) {
	var clientSource = fs.readFileSync(require.resolve('./index.html'), 'utf-8');
	res.setHeader('Content-Type', 'text/html');
	res.writeHead(200);
	res.end(clientSource);
})
.get('/script.js',function(req,res){
	var clientSource = fs.readFileSync(require.resolve('./script'), 'utf-8');
	res.setHeader('Content-Type', 'application/javascript');
	res.writeHead(200);
	res.end(clientSource);
})
.get('/style.css',function(req,res){
	var clientSource = fs.readFileSync(require.resolve('./style.css'), 'utf-8');
	res.setHeader('Content-Type', 'text/css');
	res.writeHead(200);
	res.end(clientSource);
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
	socket.on("update", function(data){
		canvas = data.canvas;
		Echelle = data.E;
		a = {X:data.A.X/Echelle, Y:data.A.Y/Echelle};
		b = {X:data.B.X/Echelle, Y:data.B.Y/Echelle};;
		rec.Width = canvas.width/Echelle;
		rec.Height = canvas.height/Echelle;
	});
	
	socket.on("point", function(data){
		Collidable = [];
		for(var i = 0 ; i < data.l.length ; i++)
			Collidable.push(new Astar.Rectangle(data.l[i].X/Echelle,data.l[i].Y/Echelle,1,1));
		var t = Astar.Tiles(a, b, rec, Collidable, true);
		var AS = new Astar(t[a.X][a.Y], t[b.X][b.Y],rec);
		if(AS.Finded)
			socket.emit("road", AS.Road);
		else
			socket.emit("road", []);
	});
});

server.listen(8080);
