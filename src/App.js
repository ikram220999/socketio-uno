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
  const [winner, setWinner] = useState(null);

  console.log("playerTurn", playerTurn);

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
    socket.emit("draw_first", {
      card: randCard,
      room: room,
      listUser: listUser,
    });
  };

  const drawCard = (index) => {
    let tempPDeck = playerDeck;
    let passCard = tempPDeck[index];

    tempPDeck = tempPDeck.filter((data, idx) => idx != index);
    setPlayerDeck(tempPDeck);
    setCurrentCard(playerDeck[index]);

    let turn = getPlayerTurn();

    if (tempPDeck.length == 0) {
      getWinner();
    }

    socket.emit("player_draw", {
      room: room,
      cardDrawed: passCard,
      turn: turn,
    });
  };

  const getWinner = () => {
    // if (playerDeck.length == 0) { 
      socket.emit("winner", { room: room, winnerId: socket.id });
      setShowGame(false);
    setWinner(socket.id);
   
    // }
  };

  const getPlayerTurn = () => {
    if (playerTurn < listUser.length - 1) {
      setPlayerTurn(playerTurn + 1);
      return playerTurn + 1;
    } else {
      setPlayerTurn(0);
      return 0;
    }
  };

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
      setCurrentCard(data.card);
      setListUser(data.listUser);
    });

    socket.on("player_draw_ws", (data) => {
      setCurrentCard(data.cardDrawed);
      setPlayerTurn(data.turn);
    });

    socket.on("display_winner", (data) => {
      setWinner(data);
      setShowGame(false);
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
                          <h3 className="font-semibold mb-3 text-green-400">
                            Its your turn, please draw a card
                          </h3>
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold mb-3 text-red-600">
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
            <>
              {winner != null ? (
                <>
                  <div className="w-full h-screen flex flex-col justify-center items-center">
                    <h2 className="font-bold text-4xl mb-3">Game ended !</h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-40 h-40 text-orange-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                      />
                    </svg>
                      <h3 className="text-lg font-bold mr-3 mt-4">winner</h3>
                    <h3 className="font-bold text-green-600 py-2 px-4 shadow-md rounded-md">
                      {winner}
                    </h3>

                    <div className="flex flex-row justify-center items-center">
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
