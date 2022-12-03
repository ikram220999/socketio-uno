import { Modal } from "flowbite-react";
import React, { useState } from "react";

const ModalRule = ({ closeRule }) => {
  //   const [ruleOpen, setRuleOpen] = useState(rule);

  const closeRulee = () => {
    closeRule(false);
  };

  return (
    <>
      <div className="h-full flex items-center">
        <div>
          <h2 className="font-semibold text-xl text-center mt-4">
            How to play
          </h2>

          <h3></h3>
          <div className="mt-4 flex flex-col gap-4">
            <p>
              There are 4 different colour of card in a deck consist blue, red,
              yellow and green color with number from 0-9 on it.
            </p>
            <p>There also including wild cards comes with black color.</p>
            <p>Each Player will get 7 random card when game started.</p>
            <p>
              There will be a selected card that will be displayed at the center
              of the game
            </p>
            <p>
              Player who owns the turn need to draw a card according to the
              current displayed card number or color.
            </p>

            <p> Player only can draw a card for each turn.</p>

            <p>Game start after player 1 draw a card</p>
          </div>

          <button
            className="border-2-rounded bg-blue-400 py-2 px-4 rounded-md text-white font-bold mt-4 w-full mt-10 hover:opacity-90 "
            onClick={() => closeRulee()}
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalRule;
