import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Modal } from "flowbite-react";

const socket = io();
// const ns1 = io.connect("http://localhost:3001/room");

function ModalLogin({ joinRoom }) {

  const [room, setRoom] = useState(0);
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleEnter = () => {
    // e.preventDefault();
    joinRoom(room, name)
    setIsOpen(false)
  }

  const reset = () => {
    localStorage.clear()
    window.location.reload();
  }

  return (
    <>
    <Modal
    show={isOpen}
    size="sm"
    onClose={""}
  >
    <Modal.Body>
    <div className="w-90 xs: flex flex-row justify-center items-center">
        <div className="flex flex-col justify-center items-center">
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
        </div>
      </div>
    </Modal.Body>
   
  </Modal>
      
    </>
  );
}

export default ModalLogin;
