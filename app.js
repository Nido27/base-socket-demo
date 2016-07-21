"use strict";
var express = require("express");
var path = require("path");

//server setup
var app = express();
var server = app.listen(9080);
var io = require("socket.io")(server);

//setup public facing files
app.use(express.static(path.join(__dirname + "/public")));
app.set("views", __dirname + "/public/views");

//setup view engine
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");


//main endpoint
app.get("/", function(req, res) {
  res.render("index.html");
});

//basic connection
io.on("connection", function(socket) {
  console.log("A user has connected");

  //io event can be any string
  socket.on("incoming", function(data) {
    if(! data.message) {
      io.sockets.connected[socket.id].emit("outgoing", {"message": "Failed message must be provided"});
    } else {
      io.emit("outgoing", {"message": data.message});
    }
  });

  //user disconnects
  socket.on('disconnect', function () {
    console.log("A user has disconnected");
  });
});
