import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Login from "./ModalLogin";
import Room from "./page/Room";
import ModalLogin from "./ModalLogin";
import { Button } from "flowbite-react";

const socket = io.connect("http://localhost:3001");

function App() {
  let id = "";
  socket.on("connect", () => {
    console.log("id saya", socket.id);
    localStorage.setItem("id", socket.id);
  });

  const [isHost, setIsHost] = useState(false);
  const [user, setUser] = useState("");
  const [listUser, setListUser] = useState([]);
  const joinRoom = (room) => {
    socket.emit("join_room", room);
  };

  console.log("id saya", id);

  const newUser = () => {
    socket.on("user_join", (data) => {
      console.log("new user", data);
      setUser(data);
    });
  };

  const getlistUser = () => {
    socket.on("list_user", (data) => {
      console.log("list user", data);
      setListUser(data);
    });
  };

  const getIsHost = () => {
    if (listUser == 2) {
      console.log("cukuppppppp");
        if (listUser[0] == localStorage.getItem("id")) {
          setIsHost(true);
          console.log("pemain cukup");
        }
    }
  };

  useEffect(() => {
    // roomHosted()
    socket.on("hosted", (data) => {
      console.log("hosted", data);
      setIsHost(false);
    });

    newUser();
    getlistUser();
  }, []);

  useEffect(() => {
      // After 3 seconds set the show value to false
      const timeId = setTimeout(() => {
        // After 3 seconds set the show value to false
        getIsHost();
      }, 3000);
  
      return () => {
        clearTimeout(timeId);
      };
    
  }, [listUser]);

  return (
    <>
      <ModalLogin joinRoom={joinRoom} />
      <div>
        {listUser.map((data) => (
          <>
            {data}
            <br />
          </>
        ))}
      </div>

      {isHost ? (
        <>
          <Button>Start now!</Button>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default App;
