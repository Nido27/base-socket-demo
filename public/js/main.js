var app = angular.module("app", []);

//socket.io wrapper service
app.service("io", [function() {
  //setup base connection
  this.connect = function() {
    return io("/");
  };

  //send message to server
  this.emitOutgoing = function(socket, message) {
    var data = {
      message: message
    };
    socket.emit("incoming", data);
  };

  //recive incoming data and then use callback function
  this.receive = function(socket, callback) {
    socket.on("outgoing", function(data) {
      callback(data);
    });
  };
}]);

app.controller("mainController", ["$scope", "io", function($scope, io) {
  var socket = "";
  $scope.chats = [];
  $scope.message = "";

  //scroll update
  $scope.scrollDown = function() {
    var objDiv = document.getElementById("chat-box");
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  //update chats
  $scope.update = function(data) {
    $scope.chats.push(data);
    $scope.scrollDown();
    $scope.$apply();
  };

  //emit new chat
  $scope.sendChat = function() {
    io.emitOutgoing(socket, $scope.message);
    $scope.message = "";
  }

  $scope.initIO = function() {
    //store socket
    socket = io.connect();

    //prepare callback for update
    io.receive(socket, $scope.update);
  };
}]);
