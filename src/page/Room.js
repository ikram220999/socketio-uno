import React, { useEffect } from "react";
import io from "socket.io-client";

const socket = io();

const Room = () => {
    
  
//   var socketIO = io("/room");

  useEffect(() => {

    socket.emit("test", "kambing");

    socket.on("user_join", (data) => {
        console.log("adad",data);
          })
          console.log("kambing");
  }, []);

  return <>kambing</>;
};

export default Room;
