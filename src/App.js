import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Login from "./ModalLogin";
import Room from "./page/Room";
import ModalLogin from "./ModalLogin";
import { Button, Card, Spinner } from "flowbite-react";
import { deck } from "./Deck";

const socket = io.connect("http://localhost:3001");

function App() {
  let id = "";

  console.log("deck", deck);
  socket.on("connect", () => {
    console.log("id saya", socket.id);
    localStorage.setItem("id", socket.id);
  });

  const [isHost, setIsHost] = useState(false);
  const [gameDeck, setGameDeck] = useState(deck);
  const [user, setUser] = useState("");
  const [listUser, setListUser] = useState([]);
  const [room, setRoom] = useState(null);
  const [gameCanvas, setGameCanvas] = useState(false);

  const [startGame, setStartGame] = useState(false);
  const [isPlayer, setIsPlayer] = useState(false);
  const [showGame, setShowGame] = useState(false);

  console.log("isHost", isHost);

  const joinRoom = (room) => {
    setRoom(room);
    setGameCanvas(true);
    setIsPlayer(true);

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
    if (listUser.length > 1) {
      console.log("cukuppppppp");
      if (listUser[0] == localStorage.getItem("id")) {
        setIsHost(true);
        console.log("pemain cukup");
      }
    }
  };

  const gameStart = () => {
    console.log("host start the game");
    socket.emit("start_game", { room: room, started: true });
    setGameCanvas(false);
    setShowGame(true);
  };

  useEffect(() => {
    socket.on("test", (data) => {
      console.log("testdata", data);
    });

    newUser();
    getlistUser();

    socket.on("start", (data) => {
      console.log("started game");
      setGameCanvas(false);
      setShowGame(true);
    });
  }, []);

  useEffect(() => {
    getIsHost();
  }, [listUser]);

  useEffect(() => {}, [startGame]);

  return (
    <>
      <ModalLogin joinRoom={joinRoom} />
      {gameCanvas ? (
        <>
          <div className="w-screen h-screen flex flex-col justify-center items-center">
            <div className="w-1/2 justify-center items-center">
              <Card>
                <div className="flex flex-col justify-center items-center">
                  {isHost ? (
                    <>
                      <h3 className="text-lg font-bold">List User</h3>
                      {listUser.map((data) => (
                        <>
                          {data}
                          <br />
                        </>
                      ))}
                      <br></br>
                      <button
                        onClick={() => gameStart()}
                        className="bg-red-500 py-3 px-5 font-bold rounded-md text-white hover:opacity-90"
                      >
                        START NOW !
                      </button>
                    </>
                  ) : (
                    <>
                      {isPlayer ? (
                        <>
                          <Spinner color={"failure"}></Spinner>
                          <h3 className="font-semibold mt-2">
                            Waiting the host to start game
                          </h3>{" "}
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          {showGame ? (
            <>
              <div className="w-full h-full my-10 flex flex-col justify-center items-center">
                <div className="w-3/4 justify-center items-center">
                  <Card>
                    <div className="flex flex-col justify-center items-center">
                      <div className="p-2 m-2 shadow-md rounded-lg w-32 flex justify-center mb-20">
                        <img src={gameDeck[0].img} width="100"></img>
                      </div>
                      <div className="flex flex-row flex-wrap justify-center">
                        <br></br>
                        {gameDeck.map((data) => {
                          return (
                            <>
                              <div className="p-2 m-2 shadow-md rounded-lg hover:shadow-red-400 hover:cursor-pointer hover:-mt-2 duration-100">
                                <img src={data.img} width="50"></img>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </>
      )}
    </>
  );
}

export default App;
