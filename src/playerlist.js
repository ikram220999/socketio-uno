import { Modal } from "flowbite-react";
import React, { useState } from "react";

const PlayerList = (props) => {
  const [show, setShow] = useState(false);
  const turn = props.turn;
  const listPlayer = JSON.parse(localStorage.getItem("listUser"));
  const direction = localStorage.getItem("turnDirection");
  const id = localStorage.getItem("id");

  const showModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setShow(false)
  }
  return (
    <>
    <Modal show={show}>
      <Modal.Body>
          <div>
            <p className="text-lg font-semibold">Help ?</p>
              <hr className="my-2"/>
            <div>
              <p className="text-sm mb-2" >Card Type</p>
              <table className="w-full" border={1}>
                <tr>
                  <th className="w-1/5 border text-sm">Card</th>
                  <th className="border text-sm">Role</th>
                </tr>
                <tr>
                <td className="w-1/5 p-1"><img src="./images/b0.png" width={40} className="m-auto"/></td>
                  <td className="border text-xs p-1"><p className="font-semibold">Number type card</p> <p>This card can be use to match previous drawed card either the card color or number</p></td>
                </tr>
                <tr>
                <td className="w-1/5 p-1"><img src="./images/gp2-0.png" width={40} className="m-auto"/></td>
                  <td className="border text-xs p-1"><p className="font-semibold">Plus two card</p>
                    <p>When this card drawed, The next player will be added 2 card into their deck.</p>
                  </td>
                </tr>
                <tr>
                <td className="w-1/5 p-1"><img src="./images/rS-0.png" width={40} className="m-auto"/></td>
                  <td className="border text-xs p-1"><p className="font-semibold">Skip card</p> 
                  <p>When this card drawed, The turn of next player will be skipped</p></td>
                </tr>
                <tr>
                <td className="w-1/5 p-1"><img src="./images/yR.png" width={40} className="m-auto"/></td>
                  <td className="border text-xs p-1"><p className="font-semibold">Reverse card</p>
                  <p>When this card drawed, The turn pattern will be reversed.</p></td>
                </tr>
                <tr>
                <td className="w-1/5 p-1"><img src="./images/wc.png" width={40} className="m-auto"/></td>
                  <td className="border text-xs p-1"><p className="font-semibold">Wild card</p>
                  <p>Player that drawed this card can choose to continue the game by choosing next card color</p></td>
                </tr>
              </table>
            </div>
          </div>
          <div className="m-auto w-fit mt-6">
            <p className="text-sm text-gray-400">More guide coming soon ...</p>
          </div>
          <div className="m-auto w-fit mt-6">
            <button className="bg-red-500 text-white text-sm px-3 py-2 font-semibold rounded-lg" onClick={closeModal}>close</button>
          </div>
      </Modal.Body>
    </Modal>
      <div className="fixed top-0 right-1 p-2 m-2 rounded-lg flex justify-center">
        <button className="py-2 px-3 bg-yellow-200 rounded-lg mr-4 font-semibold text-gray-700 hover:bg-yellow-300"
         onClick={showModal}
        >Help ?</button>
        {direction ? (
          <>
            {direction == "right" ? (
              <>
                <p className="text-xl font-bold bg-gray-200 p-2 align-middle rounded-md">
                  &#x2192;
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold bg-gray-200 p-2 align-middle rounded-md">
                  &#x2190;
                </p>
              </>
            )}
          </>
        ) : (
          ""
        )}
        {listPlayer
          ? listPlayer.map((data, idx) => {
              return (
                <>
                  {turn == idx ? <>
                  <div className="p-2 ml-2 bg-blue-400 border-4 border-blue-500 rounded-md text-white font-bold">
                    {idx + 1} 
                  </div>
                  </> : <><div className="p-2 ml-2 bg-blue-400 border-4 border-gray-100 rounded-md text-white font-bold">
                    {idx + 1}
                  </div></>} 
                </>
              );
            })
          : ""}
      </div>
    </>
  );
};

export default PlayerList;
