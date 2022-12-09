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

          <hr class="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700" />
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
            <hr className="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700" />

            <h2 className="font-semibold text-xl text-center ">Start game</h2>

            <div className="mt-2 flex flex-col gap-4">
              <p>Enter the player name and room number then press enter</p>
              <p>Share the room number with other member </p>
              <p>
                The game host will see a list of player id that already entered
                the room
              </p>
              <p>Wait till all player already in the list</p>
              <p>Start the game</p>
              <p>All palyer will be given 7 card each</p>
              <p>Host can start the game</p>
              <p>have fun !</p>
            </div>

            <div className="bg-red-100 border-2 border-gray-300 ">
              <b>Important !</b>
              <p>
                After complete a game. Please refresh and click reset to avoid
                any caching problem
              </p>
            </div>

            <button
              className="border-2-rounded bg-blue-400 py-2 px-4 rounded-md text-white font-bold mt-4 w-full mt-10 hover:opacity-90 "
              onClick={() => closeRulee()}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalRule;
