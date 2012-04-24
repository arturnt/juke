

//### 
// Simple music sync app
// Imports
var app = require('express').createServer();
var express = require("express");
var SongProvider = require("./booth-mongo.js").SongProvider;
var Room = new SongProvider("localhost", 27017);


//###
// Configure
app.configure(function() {
	app.use(express.cookieDecoder());
	app.use(express.bodyDecoder());
	app.use(express.session({ secret: "teeheheehe sessions!" }));	
});


//###
// Basic Routes


app.get('/', function(req, res){
  console.log(req.session);
  if(!req.session.user) {
		req.session.user = "foo"; 		
  }

  res.render("index.utml", {layout:false});

});

app.get("/create", function(req,res) {
	console.log(req.session.user);
	Room.save({members:[req.session.user.id]}, function(err,obj) {
		res.redirect("/r/" + obj._id);
	});

});

app.get("/r/:id", function(req,res) {
	
	Room.findById(req.params.id, function(err, room) {
		res.render("room.utml", {layout:false, room: room});
	});

});


//###
// Long Polling/Events
var io = require("socket.io").listen(app, {
    transports: ["websocket",'xhr-polling'],
    transportOptions: {
        'xhr-polling': {duration: 20000}
    }
});

io.sockets.on("connection", function(socket) {
	
	socket.on("join", function(req) {
		socket.join(req.room);
		socket.set("session", req, function() {
			io.sockets.in(req.room).emit("join", req);
		});
	});

	socket.on("play", function(req) {

	});


	socket.on("pause", function(req) {

	});

	socket.on("sync", function(req) {
		io.sockets.in(req.room).emit("sync", req);
	});

	socket.on("addsong", function(req) {
		io.sockets.in(req.room).emit("addsong", req);
	});


	socket.on("removesong", function(req) {
		io.sockets.in(req.room).emit("removesong", req);
	});


	socket.on("message", function(req) {
		io.sockets.in(req.room).emit("message", req);
	});


	socket.on("disconnect", function() {
		socket.get("session", function(err,req) {
			socket.broadcast.to(req.room).emit("disconnect", req);
		});
	});

});


//###
// Start Server
app.listen(3000);
