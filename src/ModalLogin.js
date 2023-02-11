import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Modal } from "flowbite-react";
import ModalRule from "./ModalRule";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeDown, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

const socket = io();
// const ns1 = io.connect("http://localhost:3001/room");

function ModalLogin({ joinRoom, audioHandler }) {
  const [room, setRoom] = useState(0);
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [rule, setRule] = useState(false);

  const handleEnter = () => {
    // e.preventDefault();
    joinRoom(room, name);
    setIsOpen(false);
  };

  const reset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const openRule = () => {
    console.log("kambing");
    setRule((prev) => !prev);
    // setIsOpen(false);
  };

  const playAudio = () => {
    audioHandler(1)
  }

  const pauseAudio = () => {
    audioHandler(2)
  }

  const closeRule = () => {
    setRule(false);
  };

  return (
    <>
      <Modal show={isOpen} size="sm" onClose={""}>
        <Modal.Body>
          <div className="w-90 xs: flex flex-row justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              {rule ? (
                <>
                  <ModalRule closeRule={closeRule} />
                </>
              ) : (
                <>
                  <h1 className="font-bold text-2xl mb-6 text-gray-600">UNO</h1>

                  <input
                    type="text"
                    className="bg-gray-100 rounded-md border-gray-300 py-2 px-4 text-lg w-60 mb-4"
                    placeholder="Player Name"
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    type="number"
                    className="bg-gray-100 rounded-md border-gray-300 py-2 px-4 text-lg w-60"
                    placeholder="Room No"
                    onChange={(e) => setRoom(e.target.value)}
                  />
                  <button
                    className="border-2-rounded bg-red-400 py-2 px-4 rounded-md text-white font-bold mt-12 w-60 hover:opacity-90"
                    onClick={() => handleEnter()}
                  >
                    Enter Room
                  </button>

                  <button
                    className="border-2-rounded bg-gray-400 py-2 px-4 rounded-md text-white font-bold mt-4 w-60 hover:opacity-90"
                    onClick={() => reset()}
                  >
                    Reset
                  </button>
                  <hr className="my-2 h-px bg-gray-200 border-0 dark:bg-gray-700" />
                  <button
                    className="border-2-rounded bg-blue-400 py-2 px-4 rounded-md text-white font-bold mt-4 w-60 hover:opacity-90"
                    onClick={() => openRule()}
                  >
                    Rule
                  </button>
                  <div className="flex flex-row mt-6 gap-5">
                      <button className="bg-gray-100 py-2 px-4" onClick={() => playAudio(1)}>
                    <FontAwesomeIcon icon={faVolumeDown} />
                      </button>
                    <button className="bg-gray-100 py-2 px-3" onClick={() => pauseAudio(2)} >
                      <FontAwesomeIcon icon={faVolumeHigh} />
                      </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalLogin;
