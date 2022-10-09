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

  // let gameDeck = deck;
  const [currentCard, setCurrentCard] = useState({});
  // console.log("gameDeck", gameDeck);
  const [isHost, setIsHost] = useState(false);
  const [gameDeck, setGameDeck] = useState(deck);
  console.log("gameDeck lepas loop", gameDeck);
  const [user, setUser] = useState("");
  const [listUser, setListUser] = useState([]);
  const [room, setRoom] = useState(null);
  const [gameCanvas, setGameCanvas] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(0);

  const [playerDeck, setPlayerDeck] = useState([]);
  const [startGame, setStartGame] = useState(false);
  const [isPlayer, setIsPlayer] = useState(false);
  const [showGame, setShowGame] = useState(false);

  console.log("isHost", isHost);

  console.log("cur_card", currentCard);

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
    let tempId = localStorage.getItem("id");
    console.log("host start the game");
    let obj = {};
    let deckTemp = gameDeck;

    for (let i = 0; i < listUser.length; i++) {
      let arr = [];
      for (let p = 0; p < 5; p++) {
        let randomIndex = Math.floor(Math.random() * deckTemp.length);
        // console.log("randomIndex", randomIndex);
        arr.push(deckTemp[randomIndex]);

        deckTemp = deckTemp.filter((gd, idx) => idx != randomIndex);
      }
      obj[listUser[i]] = arr;
    }

    setGameDeck(deckTemp);

    console.log("gameDeck lepas agih", deckTemp);
    console.log("senarai kad bagi setiap user", obj);

    socket.emit("start_game", { room: room, started: true, cardPlayer: obj });

    for (let key in obj) {
      console.log("key", key);
      if (tempId == key) {
        setPlayerDeck(obj[key]);
        setGameCanvas(false);
        setShowGame(true);
      }
    }
  };

  const startDraw = () => {
    let randCard = gameDeck[Math.floor(Math.random() * gameDeck.length)];
    setIsStart(true);
    setCurrentCard(randCard);
    socket.emit("draw_first", { card: randCard, room: room });
  };

  const drawCard = (index) => {
    let tempPDeck = playerDeck;

    tempPDeck = tempPDeck.filter((data, idx) => idx != index)
    setPlayerDeck(tempPDeck);
    setCurrentCard(playerDeck[index]);
  };

  const getPlayerTurn = () => {};


  useEffect(() => {
    socket.on("test", (data) => {
      console.log("testdata", data);
    });

    newUser();
    getlistUser();

    socket.on("start", (data) => {
      let tempId = localStorage.getItem("id");
      console.log("tempId", tempId);
      console.log("started game", data);
      // console.log("id parse json", tempId);
      console.log("data obj dari server", data);
      for (let key in data) {
        console.log("key", key);
        if (tempId == key) {
          setPlayerDeck(data[key]);
          setGameCanvas(false);
          setShowGame(true);
        }
      }
    });

    socket.on("my_message", (data) => {
      console.log("my message", data);
    });

    socket.on("cur_card", (data) => {
      setIsStart(true);
      setCurrentCard(data);
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
                      {isHost ? (
                        <>
                          {isStart ? (
                            <>
                              <div className="p-2 m-2 shadow-md rounded-lg w-32 flex justify-center mb-20">
                                <img src={currentCard.img} width="100"></img>
                              </div>
                            </>
                          ) : (
                            <>
                              <button
                                className="bg-red-500 py-3 px-5 font-bold rounded-md text-white hover:opacity-90"
                                onClick={() => startDraw()}
                              >
                                Start game!
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {isStart ? (
                            <>
                              <div className="p-2 m-2 shadow-md rounded-lg w-32 flex justify-center mb-20">
                                <img src={currentCard.img} width="100"></img>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                      {playerTurn === listUser.indexOf(socket.id) ? (
                        <>
                          <h3 className="font-semibold mb-3">
                            Its your turn, please draw a card
                          </h3>
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold mb-3">
                            Its not your turn, please wait
                          </h3>
                        </>
                      )}
                      <div className="flex flex-row flex-wrap justify-center">
                        <br></br>
                        {playerDeck.map((data, idx) => {
                          return (
                            <>
                              {playerTurn === listUser.indexOf(socket.id) ? (
                                <>
                                  <div
                                    onClick={() => drawCard(idx)}
                                    className="p-2 m-2 shadow-md rounded-lg hover:shadow-red-400 hover:cursor-pointer hover:-mt-2 duration-100"
                                  >
                                    <img src={data.img} width="50"></img>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="p-2 m-2 shadow-md rounded-lg cursor-not-allowed">
                                    <img src={data.img} width="50"></img>
                                  </div>
                                </>
                              )}
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
