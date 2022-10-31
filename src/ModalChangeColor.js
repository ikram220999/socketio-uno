import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Modal } from "flowbite-react";
import { defaultCard } from "./Deck";

const socket = io();
// const ns1 = io.connect("http://localhost:3001/room");

function ModalLogin({ changeColor }) {

  const [isOpen, setIsOpen] = useState(false);

  const handleEnter = () => {
    // e.preventDefault();
    joinRoom(room)
    setIsOpen(false)
  }
  return (
    <>
    <Modal
    show={isOpen}
    size="md"
    onClose={""}
  >
    <Modal.Body>
    <div className="w-90 flex flex-row justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-2xl mb-6 text-gray-600">Choose color</h1>
          {defaultCard.map((card) => {  
            return (
                <img src={card.img} width="50"></img>
            )
          })}
        </div>
      </div>
    </Modal.Body>
   
  </Modal>
      
    </>
  );
}

export default ModalLogin;
