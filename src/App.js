import "./App.css";
import { io } from "socket.io-client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Login from "./ModalLogin";
import Room from "./page/Room";
import ModalLogin from "./ModalLogin";
import { Button, Card, Spinner, Modal } from "flowbite-react";
import { deck } from "./Deck";
import { defaultCard } from "./Deck";
import { data } from "autoprefixer";
import PlayerList from "./playerlist";

const socket = io("https://uno-socketio.herokuapp.com");
// const socket = io("http://localhost:3001");

let g = localStorage.getItem("gameDeck");
if (g) {
} else {
  localStorage.setItem("gameDeck", JSON.stringify(deck));
}

localStorage.setItem("playerDeck", null);
localStorage.setItem("usernameList", null);

function App() {
  let id = "";

  console.log("deck", deck);
  socket.on("connect", () => {
    console.log("id saya", socket.id);
    localStorage.setItem("id", socket.id);
  });

  const [currentCard, setCurrentCard] = useState({});
  // console.log("gameDeck", gameDeck);
  const [isHost, setIsHost] = useState(false);
  const [gameDeck, setGameDeck] = useState(
    JSON.parse(localStorage.getItem("gameDeck"))
  );
  const setGameDeckValue = useCallback((newValue) => {
    setGameDeck(newValue);
  }, []);
  console.log("gameDeck lepas loop", gameDeck);
  const [user, setUser] = useState("");
  const [listUser, setListUser] = useState([]);
  const [room, setRoom] = useState(localStorage.getItem("room"));
  const [gameCanvas, setGameCanvas] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [winner, setWinner] = useState(null);
  const [isDrawable, setIsDrawable] = useState();
  const [isSkipped, setIsSkipped] = useState(false);
  const [isPlusTwo, setIsPlusTwo] = useState(false);
  const [isOpenChangeColor, setToggleChangeColor] = useState(false);
  const [cardChangeColor, setCardChangeColor] = useState({
    idx: null,
    color: null,
    color_card: "",
    classname: "border-4 border-black rounded-md",
  });
  const [name, setName] = useState("");
  const [usernameList, setUsernameList] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [inputChat, setInputChat] = useState("");

  console.log("chat data", chatData);
  //test

  console.log("cardChangeColor", cardChangeColor);

  console.log("isDrawable", isDrawable);

  console.log("playerTurn", playerTurn);

  const [playerDeck, setPlayerDeck] = useState(
    JSON.parse(localStorage.getItem("playerDeck"))
  );

  console.log("playerDeck", playerDeck);
  const [startGame, setStartGame] = useState(false);
  const [isPlayer, setIsPlayer] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const inputRef = useRef(null)

  var username = localStorage.getItem("user");

  console.log("isHost", isHost);

  console.log("cur_card", currentCard);

  const joinRoom = (room, name) => {
    localStorage.setItem("room", room);
    localStorage.setItem("name", name);
    var list = null;
    var j = JSON.parse(localStorage.getItem("usernameList"));
    console.log("kambing");
    if (j != null) {
      j.push(name);
      localStorage.setItem("usernameList", JSON.stringify(j));
      list = j;
    } else {
      var jarr = [];
      jarr.push(name);
      localStorage.setItem("usernameList", JSON.stringify(jarr));
      list = jarr;
    }
    setName(name);
    setUsernameList(j);
    setRoom(room);
    setGameCanvas(true);
    setIsPlayer(true);

    socket.emit("join_room", { room: room, name: name });
  };

  console.log("id saya", id);

  const newUser = () => {
    socket.on("user_join", (data) => {
      console.log("new user", data.id);
      setUser(data.id);

      var list = null;
      var j = JSON.parse(localStorage.getItem("usernameList"));
      console.log("kambing");
      if (j != null) {
        j.push(data.name);
        localStorage.setItem("usernameList", JSON.stringify(j));
        list = j;
      } else {
        var jarr = [];
        jarr.push(data.name);
        localStorage.setItem("usernameList", JSON.stringify(jarr));
        list = jarr;
      }
    });
  };

  const getlistUser = () => {
    socket.on("list_user", (data) => {
      console.log("list user", data);
      setListUser(data.c);

      // setUsernameList(list);
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
    localStorage.setItem("listUser", JSON.stringify(listUser));
    console.log("host start the game");
    let obj = {};
    let deckTemp = gameDeck;

    for (let i = 0; i < listUser.length; i++) {
      let arr = [];
      for (let p = 0; p < 7; p++) {
        let randomIndex = Math.floor(Math.random() * deckTemp.length);
        // console.log("randomIndex", randomIndex);
        arr.push(deckTemp[randomIndex]);

        deckTemp = deckTemp.filter((gd, idx) => idx != randomIndex);
      }
      obj[listUser[i]] = arr;
    }
    let a = localStorage.setItem("gameDeck", JSON.stringify(deckTemp));
    // setGameDeck(deckTemp);

    localStorage.setItem("turnDirection", "right");
    var h = JSON.parse(localStorage.getItem("usernameList"));

    console.log("gameDeck lepas agih", deckTemp);
    console.log("senarai kad bagi setiap user", obj);

    socket.emit("start_game", {
      room: room,
      started: true,
      cardPlayer: obj,
      listUser: listUser,
      listUsername: h,
      gameDeck: deckTemp,
    });

    for (let key in obj) {
      console.log("key", key);
      if (tempId == key) {
        localStorage.setItem("playerDeck", JSON.stringify(obj[key]));
        setPlayerDeck(obj[key]);
        setGameCanvas(false);
        setShowGame(true);
      }
    }
  };

  const sendMessage = () => {
    var obj = {
      user: localStorage.getItem("name"),
      chat: inputChat,
    };
    socket.emit("send_chat", {
      user: localStorage.getItem("name"),
      chat: inputChat,
      room: room,
    });
    setInputChat("");
    setChatData((prev) => [...prev, { user: obj.user, chat: obj.chat }]);
  };

  const enter = (e) => {
    if(e.key === 'Enter'){
      var obj = {
        user: localStorage.getItem("name"),
        chat: inputChat,
      };
      socket.emit("send_chat", {
        user: localStorage.getItem("name"),
        chat: inputChat,
        room: room,
      });
      setInputChat("");
      setChatData((prev) => [...prev, { user: obj.user, chat: obj.chat }]);
      inputRef.current.focus()
    }
  }

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

  const drawCardChangeColor = (index) => {
    setCardChangeColor({
      ...cardChangeColor,
      idx: index,
    });
    setToggleChangeColor(true);
  };

  const submitColor = () => {
    let tempPDeck = playerDeck;
    let passCard = tempPDeck[cardChangeColor.idx];
    let tempGameDeck = JSON.parse(localStorage.getItem("gameDeck"));

    tempPDeck = tempPDeck.filter((data, idx) => idx != cardChangeColor.idx);
    setPlayerDeck(tempPDeck);
    localStorage.setItem("playerDeck", JSON.stringify(tempPDeck));
    tempGameDeck.push(playerDeck[cardChangeColor.idx]);

    localStorage.setItem("gameDeck", JSON.stringify(tempGameDeck));

    let a = {};
    a["code"] = "C";
    a["color"] = cardChangeColor.color_card;
    a["img"] = playerDeck[cardChangeColor.idx].img;
    setCurrentCard(a);
    setToggleChangeColor(false);

    let turn = getPlayerTurn();

    if (tempPDeck.length == 0) {
      getWinner();
    }

    // setCardChangeColor({
    //   ...cardChangeColor,
    //   idx
    // })

    socket.emit("player_draw_change_color", {
      room: room,
      cardDrawed: passCard,
      turn: turn,
      gameDeck: tempGameDeck,
      changeColor: cardChangeColor.color,
      cardColor: cardChangeColor.color_card,
    });
  };

  const smallCard = () => {
    return <React.Fragment></React.Fragment>;
  };

  const drawCard = (index) => {
    let tempPDeck = playerDeck;
    let passCard = tempPDeck[index];
    let tempGameDeck = JSON.parse(localStorage.getItem("gameDeck"));

    setCardChangeColor({
      idx: null,
      color: null,
      color_card: "",
      classname: "border-4 border-black rounded-md",
    });

    tempPDeck = tempPDeck.filter((data, idx) => idx != index);
    setPlayerDeck(tempPDeck);
    localStorage.setItem("playerDeck", JSON.stringify(tempPDeck));
    tempGameDeck.push(playerDeck[index]);

    localStorage.setItem("gameDeck", JSON.stringify(tempGameDeck));

    setCurrentCard(playerDeck[index]);

    let turn = getPlayerTurn();

    if (tempPDeck.length == 0) {
      getWinner();
    }

    if (passCard.code == "p2") {
      console.log("plus 2 card");
      console.log("room ataas", room);
      socket.emit("plus_two", {
        room: room,
        cardDrawed: passCard,
        turn: turn,
        gameDeck: tempGameDeck,
      });
    } else if (passCard.code == "S") {
      socket.emit("player_draw", {
        room: room,
        cardDrawed: passCard,
        turn: turn,
        gameDeck: tempGameDeck,
        skip: true,
      });
    } else if (passCard.code == "R") {
      var { r_turn, dir } = getReverseTurn();
      socket.emit("player_draw_reverse", {
        room: room,
        cardDrawed: passCard,
        turn: r_turn,
        direction: dir,
        gameDeck: tempGameDeck,
      });
    } else if (passCard.code == "C") {
      socket.emit("player_draw_change_color", {
        room: room,
        cardDrawed: passCard,
        turn: r_turn,
        direction: dir,
        gameDeck: tempGameDeck,
      });
    } else {
      socket.emit("player_draw", {
        room: room,
        cardDrawed: passCard,
        turn: turn,
        gameDeck: tempGameDeck,
      });
    }
  };

  const getReverseTurn = () => {
    // let turn = playerTurn;

    let direction = localStorage.getItem("turnDirection");

    if (direction == "right") {
      // localStorage.setItem("turnDirection", "left");
      var dir = "left";
      var r_turn = getPlayerTurn(undefined, "left");
    } else {
      // localStorage.setItem("turnDirection", "right");
      var dir = "right";
      var r_turn = getPlayerTurn(undefined, "right");
    }

    return { r_turn, dir };
  };

  const getWinner = () => {
    var a = localStorage.getItem("name");
    // if (playerDeck.length == 0) {
    socket.emit("winner", { room: room, winnerId: a });
    setShowGame(false);
    setWinner(a);

    // }
  };

  const takeCard = () => {
    var newGameDeck = JSON.parse(localStorage.getItem("gameDeck"));
    var newPlayerDeck = JSON.parse(localStorage.getItem("playerDeck"));

    var turn = getPlayerTurn();

    let randomIndex = Math.floor(Math.random() * newGameDeck.length);

    newPlayerDeck.push(newGameDeck[randomIndex]);
    newGameDeck = newGameDeck.filter((d, idx) => idx != randomIndex);

    localStorage.setItem("playerDeck", JSON.stringify(newPlayerDeck));
    localStorage.setItem("gameDeck", JSON.stringify(newGameDeck));

    setPlayerDeck(newPlayerDeck);
    setGameDeck(newGameDeck);
    setPlayerTurn(turn);

    socket.emit("take_card", { room: room, gameDeck: newGameDeck, turn: turn });
  };

  const resetGame = () => {
    localStorage.clear();
    window.location.reload();
  };

  const userList = () => {
    let obj = {};
    var a = JSON.parse(localStorage.getItem("listUser"));
    var b = localStorage.getItem("turnDirection");
    var c = playerTurn;
    // obj["turnDirection"] = b;
    return c;
  };

  const getPlayerTurn = (turn = null, direction = undefined) => {
    const l_user = JSON.parse(localStorage.getItem("listUser"));
    if (direction) {
      var dir = direction;
      localStorage.setItem("turnDirection", direction);
    } else {
      var dir = localStorage.getItem("turnDirection");
    }

    if (dir == "right") {
      if (turn == undefined) {
        if (playerTurn < l_user.length - 1) {
          setPlayerTurn(playerTurn + 1);
          return playerTurn + 1;
        } else {
          setPlayerTurn(0);
          return 0;
        }
      } else {
        if (turn < l_user.length - 1) {
          setPlayerTurn(turn + 1);
          return turn + 1;
        } else {
          setPlayerTurn(0);
          return 0;
        }
      }
    } else {
      if (turn == undefined) {
        if (playerTurn > 0) {
          setPlayerTurn(playerTurn - 1);
          return playerTurn - 1;
        } else {
          setPlayerTurn(l_user.length - 1);
          return l_user.length - 1;
        }
      } else {
        if (turn > 0) {
          setPlayerTurn(turn - 1);
          return turn - 1;
        } else {
          setPlayerTurn(l_user.length - 1);
          return l_user.length - 1;
        }
      }
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
      for (let key in data.cardPlayer) {
        console.log("key", key);
        if (tempId == key) {
          localStorage.setItem("gameDeck", JSON.stringify(data.gameDeck));
          localStorage.setItem("listUser", JSON.stringify(data.listUser));
          localStorage.setItem(
            "usernameList",
            JSON.stringify(data.usernameList)
          );
          localStorage.setItem("turnDirection", "right");

          setListUser(data.listUser);
          let a = localStorage.setItem(
            "playerDeck",
            JSON.stringify(data.cardPlayer[key])
          );
          setGameDeck(data.gameDeck);
          setPlayerDeck(data.cardPlayer[key]);
          setGameCanvas(false);
          setShowGame(true);
        }
      }
    });

    socket.on("send_chat_ws", (data) => {
      var obj = {
        user: data.user,
        chat: data.chat,
      };
      setChatData((prev) => [
        ...prev,
        {
          user: data.user,
          chat: data.chat,
        },
      ]);
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
      setCardChangeColor({
        idx: null,
        color: null,
        color_card: "",
        classname: "border-4 border-black rounded-md",
      });

      if (data.skip) {
        var listuser = JSON.parse(localStorage.getItem("listUser"));
        var room = localStorage.getItem("room");
        console.log("data turn", data.turn);
        if (data.turn == listuser.indexOf(socket.id)) {
          let t = getPlayerTurn(data.turn);

          console.log("turn sapa", t);

          setIsSkipped(true);
          setTimeout(() => {
            setIsSkipped(false);
          }, 3000);

          setGameDeck(data.gameDeck);
          setCurrentCard(data.cardDrawed);
          setPlayerTurn(t);

          socket.emit("player_draw", {
            room: room,
            cardDrawed: data.cardDrawed,
            turn: t,
            gameDeck: data.gameDeck,
          });
        }
      } else {
        var cd = data.cardDrawed;
        var p = false;
        localStorage.setItem("gameDeck", JSON.stringify(data.gameDeck));

        let playerDeck = JSON.parse(localStorage.getItem("playerDeck"));

        for (var i = 0; i < playerDeck.length; i++) {
          if (
            playerDeck[i].color == cd.color ||
            playerDeck[i].code == cd.code ||
            playerDeck[i].code == "C" ||
            playerDeck[i].color == "X"
          ) {
            p = true;
            break;
          }
        }

        setIsDrawable(p);

        setGameDeck(data.gameDeck);
        setCurrentCard(data.cardDrawed);
        setPlayerTurn(data.turn);
      }
    });

    socket.on("plus_two_ws", (data) => {
      setCardChangeColor({
        idx: null,
        color: null,
        color_card: "",
        classname: "border-4 border-black rounded-md",
      });
      // setPlayerTurn(data)
      localStorage.setItem("gameDeck", JSON.stringify(data.gameDeck));
      var room = localStorage.getItem("room");
      // setGameDeck(data.gameDeck);

      var cd = data.cardDrawed;
      var p = false;
      let playerDeck = JSON.parse(localStorage.getItem("playerDeck"));

      for (var i = 0; i < playerDeck.length; i++) {
        if (
          playerDeck[i].color == cd.color ||
          playerDeck[i].code == cd.code ||
          playerDeck[i].code == "C" ||
          playerDeck[i].color == "X"
        ) {
          p = true;
          break;
        }
      }

      setIsDrawable(p);

      let list_user = JSON.parse(localStorage.getItem("listUser"));
      console.log("cardDrawed plusto", data.cardDrawed);
      setCurrentCard(data.cardDrawed);
      setPlayerTurn(data.turn);
      if (data.turn == list_user.indexOf(socket.id)) {
        console.log("plus_two_ws", data);
        setIsPlusTwo(true);
        setTimeout(() => {
          setIsPlusTwo(false);
        }, 3000);

        console.log("check 1 player deck", playerDeck);

        let newPlayerDeck = JSON.parse(localStorage.getItem("playerDeck"));
        let newGameDeck = JSON.parse(localStorage.getItem("gameDeck"));
        let idxCard = [];

        console.log("newGameDeck", newGameDeck);
        for (let p = 0; p < 2; p++) {
          let randomIndex = Math.floor(Math.random() * newGameDeck.length);
          // console.log("randomIndex", randomIndex);
          idxCard.push(newGameDeck[randomIndex]);

          console.log("idxCard", idxCard);

          console.log("check newPlayerDeck", newPlayerDeck);

          newGameDeck = newGameDeck.filter((data, idx) => idx != randomIndex);
        }
        let latPlayerDeck = newPlayerDeck.concat(idxCard);

        console.log("concat", latPlayerDeck);

        console.log("room berapa", room);
        socket.emit("minus_two_after_player_add", {
          room: room,
          gameDeck: newGameDeck,
        });

        setGameDeck(newGameDeck);
        localStorage.setItem("gameDeck", JSON.stringify(newGameDeck));
        setPlayerDeck(latPlayerDeck);
        localStorage.setItem("playerDeck", JSON.stringify(latPlayerDeck));
      }
    });

    socket.on("minus_two_after_player_add_ws", (data) => {
      let newGameDeck = data;
      console.log("new game Deck", data);

      localStorage.setItem("gameDeck", JSON.stringify(newGameDeck));
      setGameDeck(newGameDeck);
    });

    socket.on("player_draw_reverse_ws", (data) => {
      setCardChangeColor({
        idx: null,
        color: null,
        color_card: "",
        classname: "border-4 border-black rounded-md",
      });

      localStorage.setItem("turnDirection", data.direction);
      var cd = data.cardDrawed;
      var p = false;
      localStorage.setItem("gameDeck", JSON.stringify(data.gameDeck));

      let playerDeck = JSON.parse(localStorage.getItem("playerDeck"));

      for (var i = 0; i < playerDeck.length; i++) {
        if (
          playerDeck[i].color == cd.color ||
          playerDeck[i].code == cd.code ||
          playerDeck[i].code == "C" ||
          playerDeck[i].color == "X"
        ) {
          p = true;
          break;
        }
      }

      setIsDrawable(p);

      setGameDeck(data.gameDeck);
      setCurrentCard(data.cardDrawed);
      setPlayerTurn(data.turn);
    });

    socket.on("player_draw_change_color_ws", (data) => {
      var cd = data.cardDrawed;
      var p = false;
      localStorage.setItem("gameDeck", JSON.stringify(data.gameDeck));

      let playerDeck = JSON.parse(localStorage.getItem("playerDeck"));

      for (var i = 0; i < playerDeck.length; i++) {
        if (
          playerDeck[i].color == cd.color ||
          playerDeck[i].code == cd.code ||
          playerDeck[i].code == "C" ||
          playerDeck[i].color == "X"
        ) {
          p = true;
          break;
        }
      }

      setIsDrawable(p);
      let tempObj = {};

      tempObj["color"] = data.cardColor;
      tempObj["code"] = data.cardDrawed.code;
      tempObj["img"] = data.cardDrawed.img;

      console.log("apa data cardDrawed", data.cardDrawed);

      setGameDeck(data.gameDeck);
      setCurrentCard(tempObj);
      setPlayerTurn(data.turn);
      setCardChangeColor({
        ...cardChangeColor,
        color: data.changeColor,
        color_card: data.cardColor,
      });
    });

    socket.on("take_card_ws", (data) => {
      localStorage.setItem("gameDeck", JSON.stringify(data.gameDeck));

      setGameDeck(data.gameDeck);
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

  useEffect(() => {
    var p = false;
    let playerDeck = JSON.parse(localStorage.getItem("playerDeck"));
    if (playerDeck) {
      for (var i = 0; i < playerDeck.length; i++) {
        if (
          playerDeck[i].color == currentCard.color ||
          playerDeck[i].code == currentCard.code ||
          playerDeck[i].code == "C" ||
          playerDeck[i].color == "X"
        ) {
          p = true;
          break;
        }
      }
    }

    setIsDrawable(p);
  }, [playerTurn]);

  useEffect(() => {}, [startGame]);

  return (
    <>
      {isStart ? (
        <>
          <button
            className=" xs:text-sm xs:py-2 xs:px-4 sm:text-sm sm:py-2 sm:px-4 fixed bottom-2 right-2 bg-gray-400 py-3 px-5 text-white rounded-md hover:bg-gray-600
    
    "
            onClick={() => resetGame()}
          >
            Reset
          </button>
        </>
      ) : (
        ""
      )}
      <ModalLogin joinRoom={joinRoom} />
      <Modal show={isOpenChangeColor} size="sm" onClose={""}>
        <Modal.Body>
          <div className="w-90 flex flex-row justify-center items-center">
            <div className="flex flex-col justify-center items-center ">
              <h1 className="font-bold text-2xl mb-6 text-gray-600">
                Choose color
              </h1>
              <div
                className={
                  `flex flex-row justify-center items-center gap-x-8 mb-4` +
                  cardChangeColor.classname
                }
              >
                {defaultCard.map((card, idx) => {
                  return (
                    <>
                      {card.color == cardChangeColor.color ? (
                        <>
                          <img
                            src={card.img}
                            width="50"
                            className={`` + cardChangeColor.classname}
                            onClick={() =>
                              setCardChangeColor({
                                ...cardChangeColor,
                                color: card.id,
                                color_card: card.color,
                              })
                            }
                          ></img>
                        </>
                      ) : (
                        <>
                          <img
                            src={card.img}
                            width="50"
                            className={""}
                            onClick={() =>
                              setCardChangeColor({
                                ...cardChangeColor,
                                color: card.id,
                                color_card: card.color,
                              })
                            }
                          ></img>
                        </>
                      )}
                    </>
                  );
                })}
              </div>

              <br></br>

              <Button
                color={"info"}
                className="mt-4"
                onClick={() => submitColor()}
              >
                Ok !
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>{" "}
      {gameCanvas ? (
        <>
          <div className="w-screen h-screen flex flex-col justify-center items-center">
            <div className="w-1/2 xs:w-3/4 sm:w-3/4 justify-center items-center">
              <Card>
                <div className="flex flex-col justify-center items-center">
                  {isHost ? (
                    <>
                      <h3 className="text-lg font-bold mb-4">List User</h3>
                      {listUser.map((data) => (
                        <>
                          {data}
                          <br />
                        </>
                      ))}
                      <br></br>
                      <button
                        onClick={() => gameStart()}
                        className="bg-red-500 py-3 px-5 font-bold rounded-md text-white xs:text-sm sm:text-sm hover:opacity-90"
                      >
                        START NOW !
                      </button>
                    </>
                  ) : (
                    <>
                      {isPlayer ? (
                        <>
                          <Spinner color={"failure"}></Spinner>
                          <h3 className="font-semibold mt-2 xs:text-sm sm:text-sm">
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
              <div className="flex justify-center items-center">
                <div className=" relative hidden xl:block w-full xl:w-1/2 h-screen my-10 xs:my-0 xs:h-screen sm:my-0 h-screen flex flex-col justify-center items-center border-2">
                  <div className=" rounded-sm lg:w-6/12 md:w-8/12 shadow-md m-auto h-screen sm:10/12">
                    <div className="container shadow-md w-full mb-3 bg-red-500 px-6 py-4 rounded-t-lg flex flex-row flex-wrap items-center justify-between">
                      <b className="text-white text-xl">Uno</b>
                      <div className="flex flex-row justify-center items-center">
                        <h3 className="text-black font-semibold">Room No : </h3>
                        <div className="w-auto py-2 px-4 mx-2 bg-red-800 rounded-xl text-white font-bold">
                          {/* <b>{temRoom}</b> */} {room}
                        </div>
                      </div>
                    </div>

                    <div className="relative h-3/4">
                      <div className="container shadow-sm h-full px-3 overflow-y-scroll">
                        {chatData.map((da) => {
                          let username = localStorage.getItem("name");
                          return(
                          <>
                            {da.user == username ? (
                              <div className="w-full flex flex-row mt-2 items-center">
                                <div className="py-1 px-6 bg-red-500 rounded-3xl text-white mr-3">
                                  {da.user}
                                </div>
                                <div className="py-1 px-6 bg-red-400 rounded-3xl text-white ">
                                  {da.chat}
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="w-full flex flex-row mt-2 items-center">
                                  <div className="py-1 px-6 bg-gray-500 rounded-3xl text-white mr-3">
                                    {da.user}
                                  </div>
                                  <div className="py-1 px-6 bg-gray-400 rounded-3xl text-white ">
                                    {da.chat}
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )})}
                        <div className="container mt-2 py-3 "></div>
                      </div>
                      {/* <div class="absolute bottom-3 rounded-3xl inset-x-1/4 px-3 py-2 bg-red-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex">
                        <span class="flex rounded-full bg-red-500 uppercase px-2 py-1 text-xs font-bold mr-3">
                          New
                        </span>
                        <span class="font-semibold mr-2 text-left flex-auto">
                           has send the chat
                        </span>
                      </div> */}
                    </div>
                    <div className="container m-2 bottom-0 absolute">
                      <input
                        className="border-2 border-gray-300 rounded-3xl py-2 px-4 m-3 w-9/12 text-gray-500 outline-red-100"
                        type="text"
                        placeholder="Message ..."
                        value={inputChat}
                        ref={inputRef}
                        onChange={(e) => {
                          setInputChat(e.target.value);
                        }}
                        onKeyDown={enter}
                      ></input>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 w-2/12 rounded-3xl"
                        onClick={sendMessage}
                      >
                        Send
                      </button>
                    </div>
                    {/* {vModal()} */}
                  </div>
                </div>
                <div className="w-full xl:w-1/2 h-full my-10 xs:my-0 xs:h-screen sm:my-0 sm:h-screen flex flex-col justify-center items-center">
                  <PlayerList turn={playerTurn} />
                  <div className="w-1/4 xs:w-full sm:w-full justify-center items-center">
                    <Card>
                      <div className="flex flex-col justify-center items-center">
                        {isHost ? (
                          <>
                            {isStart ? (
                              <>
                                <div className="flex flex-row justify-center items-center mb-12 gap-x-4">
                                  <div className="p-2 m-2 shadow-md rounded-lg w-32 flex justify-center ">
                                    <img
                                      src={currentCard.img}
                                      width="100"
                                    ></img>
                                  </div>
                                  {cardChangeColor.color != null ? (
                                    <>
                                      <div className="w-20 ">
                                        {/* card kecil */}
                                        <img
                                          src={
                                            defaultCard[cardChangeColor.color]
                                              .img
                                          }
                                          width="50"
                                        ></img>
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <button
                                  className="bg-red-500 py-3 px-5 font-bold xs:text-sm rounded-md text-white hover:opacity-90"
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
                                <div className="flex flex-row justify-center items-center mb-12 gap-x-4">
                                  <div className="p-2 m-2 shadow-md rounded-lg w-32 xs:w-24 sm:w-24 flex justify-center ">
                                    <img
                                      src={currentCard.img}
                                      width="100"
                                    ></img>
                                  </div>
                                  {cardChangeColor.color != null ? (
                                    <>
                                      <div className="w-20 ">
                                        {/* card kecil */}
                                        <img
                                          src={
                                            defaultCard[cardChangeColor.color]
                                              .img
                                          }
                                          width="50"
                                        ></img>
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                        {playerTurn === listUser.indexOf(socket.id) ? (
                          <>
                            <h3 className="font-semibold mb-3 text-green-400 xs:text-sm sm:text-sm">
                              Its your turn, please draw a card
                            </h3>
                          </>
                        ) : (
                          <>
                            <h3 className="font-semibold mb-3 text-red-600 xs:text-sm sm:text-sm">
                              Its not your turn, please wait
                            </h3>
                          </>
                        )}
                        <div className="flex flex-row flex-wrap justify-center">
                          <br></br>

                          {playerDeck ? (
                            <>
                              {playerDeck.map((data, idx) => {
                                return (
                                  <>
                                    {playerTurn ===
                                    listUser.indexOf(socket.id) ? (
                                      <>
                                        {currentCard.color == data.color ||
                                        currentCard.code == data.code ||
                                        data.code == "C" ||
                                        data.color == "X" ? (
                                          <>
                                            {data.code == "C" ? (
                                              <>
                                                <div
                                                  onClick={() =>
                                                    drawCardChangeColor(idx)
                                                  }
                                                  className="xs:w-14 sm:w-14 p-2 m-2 shadow-md rounded-lg hover:shadow-red-400 hover:cursor-pointer hover:-mt-2 duration-100"
                                                >
                                                  <img
                                                    src={data.img}
                                                    width="50"
                                                    className="xs:w-16 sm:w-16"
                                                  ></img>
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                <div
                                                  onClick={() => drawCard(idx)}
                                                  className="xs:w-14 sm:w-14 p-2 m-2 shadow-md rounded-lg hover:shadow-red-400 hover:cursor-pointer hover:-mt-2 duration-100"
                                                >
                                                  <img
                                                    src={data.img}
                                                    width="50"
                                                    className="xs:w-16 sm:w-16"
                                                  ></img>
                                                </div>
                                              </>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            <div className="xs:w-14 sm:w-14 p-2 m-2 shadow-md rounded-lg cursor-not-allowed">
                                              <img
                                                src={data.img}
                                                width="50"
                                                className="xs:w-16 sm:w-16"
                                              ></img>
                                            </div>
                                          </>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <div className="xs:w-14 sm:w-14 p-2 m-2 shadow-md rounded-lg cursor-not-allowed">
                                          <img
                                            src={data.img}
                                            width="50"
                                            className="xs:w-16 sm:w-16"
                                          ></img>
                                        </div>
                                      </>
                                    )}
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                        {playerTurn === listUser.indexOf(socket.id) ? (
                          <>
                            {/* {isDrawable == false ? ( */}
                            <>
                              <div className="mt-10">
                                <Button
                                  color={"warning"}
                                  onClick={() => takeCard()}
                                  className="m-4"
                                >
                                  Take one card !
                                </Button>
                              </div>
                            </>
                            {/* ) : ( */}
                            <></>
                            {/* )} */}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </Card>
                  </div>
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

                    <div className="flex flex-row justify-center items-center"></div>
                  </div>
                </>
              ) : (
                ""
              )}
            </>
          )}
        </>
      )}
      {isSkipped ? (
        <>
          <div className="h-16 fixed w-72 text-lg xs:h-auto xs:w-60 xs:text-sm sm:h-auto sm:w-60 sm:text-sm font-bold text-white mx-auto inset-x-0 bottom-4 py-3 bg-red-500 rounded-lg shadow-md text-center align-middle">
            Your turn have been skipped !
          </div>
        </>
      ) : (
        ""
      )}
      {isPlusTwo ? (
        <>
          <div className=" h-16 fixed w-72 text-lg xs:h-auto xs:w-60 xs:text-sm sm:h-auto sm:w-60 sm:text-sm font-bold text-white mx-auto inset-x-0 bottom-4 py-3 bg-yellow-400 rounded-lg shadow-md text-center align-middle">
            Your card deck + 2
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default App;
