import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import cardback from "../assets/cardBack.png";
import cardFront from "../assets/cardFront.png";
import "./Game.css";

function Game() {
  const location = useLocation();
  const { gameData } = location.state || {};
  const [items, setItems] = useState([]);
  const [flippedcards, setNewflipState] = useState({});
  const [listOfFlippedCards, setList] = useState([]);
  const [time, setTime] = useState(0);
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(true);
  const [error, setError] = useState("");
  const [gameLoaded, setGameLoaded] = useState(false);

  let gameId = gameData?.gameId; //Denna behöver routas in beroende på vilket spel användare väljer

  const tokenObjectString = localStorage.getItem("accessToken");
  const tokenObject = tokenObjectString ? JSON.parse(tokenObjectString) : null;
  const accessToken = tokenObject?.accessToken;

  useEffect(() => {
    if (items.length === 0 && gameLoaded === true) {
      EndGame();
    }
  }, [items]);

  const handleFlip = (id, index) => {
    console.log("kortid-:" + id);
    
    if (listOfFlippedCards.some((card) => card.index === index)) {
      return;
    }

      setList([...listOfFlippedCards, { id, index }]);

    //kolla hur många kort som är flippade
    const flippedCardsCount = Object.keys(flippedcards).filter(
      (cardId) => flippedcards[cardId]
    );
    //om mer än 2 kort är vända så ska inte fler kort vändas
    if (flippedCardsCount.length === 2) {
      return;
    }
    //lägg till nytt kort som ska flippas
    setNewflipState((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  //Hämta korten från en specifik kategori
  useEffect(() => {
    const accessTokenString = localStorage.getItem("accessToken");
    const accessToken = accessTokenString
      ? JSON.parse(accessTokenString)
      : null;

    const fetchData = async () => {
      await fetch(
        `https://localhost:7259/api/Item/GettItemFromGameId?gameid=${gameId}`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            return;
          } else {
            setError("");
            return res.json();
          }
        })
        .then((data) => {
          console.log(data);
          //Duplicera listan då vi behöver ha 2 kort av varje för memory
          const deepCopiedItems = data.map((item) =>
            JSON.parse(JSON.stringify(item))
          );
          const doubledItems = [...data, ...deepCopiedItems];
          //Shuffla listan
          for (var i = doubledItems.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = doubledItems[i];
            doubledItems[i] = doubledItems[j];
            doubledItems[j] = temp;
          }
          setItems(doubledItems);
          console.log(doubledItems);
          setGameLoaded(true);
        })
        .catch((error) => {
          setError("Anslutning till servern verkar ej vara möjlig");
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isRunning) {
      let interval;

      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);

      return () => clearInterval(interval);
    } else {
      return;
    }
  });

  //Denna är aktiv hela tiden och kollar hur många kort som är klickade just nu.
  useEffect(() => {
    console.log(listOfFlippedCards);

    if (listOfFlippedCards.length === 2) {
      const [firstCard, secondCard] = listOfFlippedCards;
      console.log(firstCard); // 10
      console.log(secondCard);

      if (firstCard.id === secondCard.id) {
        console.log("Korten matchar");

        setTimeout(() => {
          setNewflipState({});
          setList([]);
        }, 2250);
        //väntar lite till då animation av flippningen sker
        setTimeout(() => {
          setItems((prevItems) =>
            prevItems.filter((item) => item.id !== firstCard.id)
          );
        }, 2900);
      } else {
        //resetta alla kort om det inte var en match
        setTimeout(() => {
          setNewflipState({});
          setList([]);
        }, 2250);
      }
    }
  }, [flippedcards]);

  const EndGame = () => {
    localStorage.setItem("PostedResult", false);
    setIsRunning(false);

    const hours = String(Math.floor((time / 3600000) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((time / 60000) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, "0");

    var timeResult = `${hours}:${minutes}:${seconds}`;

    var ResultData = { gameId: gameId, time: timeResult };

    navigate("/Result", { state: { ResultData } });
  };

  return (
    <div className="container">
      {items.length > 0 ? (
        <div>
          <div className="text-center"></div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 d-flex justify-content-center">
              <h1>
                {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
                {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
                {("0" + ((time / 10) % 100)).slice(-2)}
              </h1>
            </div>
            <div>
              <Link to="/home">
                <button className="btn btn-danger">Avbryt spel</button>
              </Link>
            </div>
          </div>
          <div className="row">
            {items.map((item, index) => (
              <div
                className="col-sm-4"
                style={{ height: "30rem" }}
                key={index}
                onClick={() => handleFlip(item.id, index)}
              >
                <div
                  className={`card-game ${
                    flippedcards[index] ? "cardFlip-game" : ""
                  }`}
                >
                  <div className="back-game">
                    <img
                      src={item.image}
                      alt=""
                      style={{ width: "20rem", height: "462px" }}
                    />
                  </div>
                  <div className="front-game">
                    <img
                      src={cardback}
                      alt=""
                      style={{ width: "20rem", height: "462" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center mb-4 mt-5">
          <h5>Spelet laddas...</h5>
          <div className="spinner-grow text-primary" role="status"></div>
          <div className="spinner-grow text-secondary" role="status"></div>
          <div className="spinner-grow text-success" role="status"></div>
          <div className="spinner-grow text-danger" role="status"></div>
          <h6>{error}</h6>
        </div>
      )}
    </div>
  );
}

export default Game;
