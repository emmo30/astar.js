/*
*For Testing Launch server.js on prompt with:
*>node server.js
*and in your favorite web browther go on:
>localhost:8080/
*Have a fun
*/
//Test Astar Script
function care(x,y,size,color){
	this.X = x;
	this.Y = y;
	this.size = size;
	this.color = color || "red";
};
care.prototype.Draw = function(canvas){
	var ctx=canvas.getContext("2d");
	ctx.fillStyle = this.color;
	ctx.fillRect(this.X,this.Y,this.size,this.size);
};
function Rectangle(x,y,width,height){
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
};
function IsRecExist(list, Care){
	for(var i = 0; i < list.length ; i++)
		if(list[i].X == Care.X && list[i].Y == Care.Y)
			return true;
	return false;
};
function DelRec(list, Care){
	for(var i = 0; i < list.length ; i++)
		if(list[i].X == Care.X && list[i].Y == Care.Y){
			list.splice(i,1);
		}
};
window.onload = function(){
	function Anim(){
		canvas.width = canvas.width;
		A.Draw(canvas);
		B.Draw(canvas);
		for(var i = 0; i < road.length ; i++){
			road[i].Draw(canvas);
		}
		for(var i = 0; i < list.length ; i++){
			list[i].Draw(canvas);
		}
	}
	var canvas = document.getElementById('mon_canvas');
	var btn = document.getElementById('calculate');
	canvas.width = 800;
	canvas.height = 500;
	var context = canvas.getContext('2d');
	var E = 50;
	var A = new care(0, 0, E, "blue");
	var B = new care(((canvas.width/E)*E)-E, ((canvas.height/E)*E)-E, E);
	var list=[],road =[];
	canvas.addEventListener('click', function(evt) {
		var rect = canvas.getBoundingClientRect();
		var C = new care(Math.floor((evt.clientX - rect.left)/(E))*E, Math.floor((evt.clientY - rect.top)/(E))*E, E, "yellow");
		if(IsRecExist(list, C))
			DelRec(list, C);
		else
			list.push(C);
		socket.emit("point", {l:list,c:C});
	}, false);
	var socket = io('http://localhost:8080');
  	socket.emit("update", {
  		canvas:{
  			width:canvas.width,
  			height:canvas.height
  		},
  		E: E,
  		A: A,
  		B: B
  	});
	socket.on("road",function(data){
		road = [];
		document.getElementById("Legend").innerHTML = "Road Length: " + data.length;
		for(var i = 0; i < data.length ; i++){
			road.push(new care((data[i].X*E), (data[i].Y*E), E, "green"));
		}
	});
	setInterval(Anim,200);
};
