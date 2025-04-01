import express from "express";
import http from "http";
import {Server} from "socket.io";

const app=express();
const server=http.createServer(app);

//to store the online users {userId:socketId};
const userSocketMap={};
const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
});


//helper fucntion to get the receiver socket id 
export function getReceiverSocketId(userId){
    return userSocketMap[userId];
};


io.on("connection",(socket)=>{
    console.log("A user is connected: ",socket.id);
    //getting the user Id from the front end
    const userId=socket.handshake.query.userId;
    //if we got a userId its time to put that into socket database(userSocketMap)
    if(userId)
    {
        userSocketMap[userId]=socket.id;
    }

    //io.emit() is used to send events to all the clients(broadcast)
    //everyone will get to know the online users
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on('disconnect',()=>{
        console.log("A user disconnected: ",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
})




export {io,app,server};