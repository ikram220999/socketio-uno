import React from "react";

const PlayerList = (props) => {
  const turn = props.turn;
  const listPlayer = JSON.parse(localStorage.getItem("listUser"));
  const direction = localStorage.getItem("turnDirection");
  const id = localStorage.getItem("id");

  return (
    <>
      <div className="fixed top-0 right-1 p-2 m-2 rounded-lg flex justify-center">
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
