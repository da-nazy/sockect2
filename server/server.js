const express=require('express');
const Socket=require("socket.io");
const app=express();

const server=require("http").createServer(app);

const io=Socket(server,{
    cors:{
        origin:"*",
        method:["GET","POST"]
    }
});
  
let PORT=5000;
const users=[];
server.listen(PORT,()=>{
    console.log("listening on port",PORT);
})

io.on("connection",(socket)=>{
  console.log("connected to ",socket.id);
  // listen for a ping event
  // call back function executed
  // keep track of all users connected to the server
  
  socket.on("addUser",(username)=>{
    // socket is an object.
    // we are free to add properties to it as well
    // the user that sent the message has the above socket object
  
    socket.user=username;
    users.push(username);
    io.sockets.emit("users",users);
  });
  socket.on("message",(message)=>{
    io.sockets.emit("message_client",{
        message,
        user:socket.user
    })
  })

  socket.on("disconnect",()=>{
    //console.log("We are disconnecting",socket.user);
    if(socket.user){
        // if user is attached to socket object
        // removing only one item of socket.user index
        users.splice(users.indexOf(socket.user),1);
        io.sockets.emit("users",users);
        console.log("Remaining users",users);
    }
  })
})