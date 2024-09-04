import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import Omslagbild from "../assets/Animals_example_omslag.png";
import video from "../assets/blue_background.mp4";
import Dropdown from "react-bootstrap/Dropdown";
import { AuthContext, useAuth } from "../contexts/AuthProvider";

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedGames, setSelectedGames] = useState({});
  const [filters, setFilter] = useState("public");
  const [error, setError] = useState("");
  const authHandler = useAuth();

  //check if user is valid
  useEffect(() => {
    console.log("checking");
    console.log(authHandler.isAuthenticated);
    if (authHandler.isAuthenticated === false) {
      console.log(authHandler.isAuthenticated);
      navigate("/landingpage");
    }
  });
  const filterChange = (filter) => {
    setFilter(filter);
  };

  const handleSelect = (game, index) => {
    console.log(game);
    setSelectedGames({});

    setSelectedGames((prevState) => ({
      ...prevState,
      [index]: {
        id: game.Id,
        difficulty: game.DifficultyLevel,
        name: game.Name,
        gameName: `${game.DifficultyLevel} - ${game.Name}`,
      },
    }));
  };

  useEffect(() => {
    const tokenObjectString = localStorage.getItem("accessToken");
    const tokenObject = tokenObjectString
      ? JSON.parse(tokenObjectString)
      : null;
    const accessToken = tokenObject?.accessToken;

    fetch(`https://localhost:7259/api/Category/GetCategoriesWithIncludedData`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) {
          return;
        } else {
          setError("");
          return res.json();
        }
      })
      .then((data) => {
        setCategories(data.$values);
        console.log(data.$values);
      })
      .catch((error) => {
        setError("Anslutning till servern verkar ej vara möjlig");
      });
  }, []);

  const startGame = (categoryObj, level, gameName) => {
    var gameData = {
      gameId: categoryObj,
      difficultyLevel: level,
      name: gameName,
    };
    navigate("/Game", { state: { gameData } });
  };
  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1>Welcome to Memory-Magi</h1>
        <button
          className={`btn me-3 ${
            filters === "public" ? "btn-success" : "btn-primary"
          }`}
          onClick={() => filterChange("public")}
        >
          Publika spel
        </button>
        <button
          className={`btn ${
            filters === "private" ? "btn-success" : "btn-primary"
          }`}
          onClick={() => filterChange("private")}
        >
          Privata spel
        </button>
      </div>
      {categories.length > 0 ? (
        <div className="row justify-content-center">
          {(filters.length === 0
            ? categories
            : categories.filter((category) => {
                if (filters.includes("public")) {
                  return category.HasPublicGames;
                } else if (filters.includes("private")) {
                  return category.HasPrivateGames;
                }
              })
          ).map((category, index) => (
            <div
              key={category.Id}
              className="card mb-2 mx-2 col-md-3"
              style={{
                borderRadius: "50px",
                position: "relative",
                overflow: "hidden",
                width: "350px",
                height: "425px",
              }}
            >
              <div className="card-body text-center">
                <h2 className="card-title">{category.Name}</h2>
                <img
                  src={Omslagbild}
                  alt=""
                  style={{ width: "100%", height: "60%", borderRadius: "50px" }}
                />
                <video
                  src={video}
                  autoPlay
                  muted
                  loop
                  style={{
                    overflow: "hidden",
                    zIndex: -1,
                    position: "absolute",
                    objectFit: "cover",
                    top: 0,
                    left: 0,
                  }}
                ></video>

                <Dropdown className="mb-2">
                  <Dropdown.Toggle variant="success">
                    {selectedGames[index]?.gameName || "Välj spel"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {category.AllGames.$values
                      .filter((game) => {
                        if (filters.includes("public")) {
                          return game.GameType.toLowerCase() === "public";
                        }
                        if (filters.includes("private")) {
                          return game.GameType.toLowerCase() === "private";
                        }
                      })
                      .map((game) => (
                        <Dropdown.Item
                          key={game.Id}
                          href="#"
                          onClick={() => handleSelect(game, index)}
                        >
                          {game.DifficultyLevel} - {game.Name}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>

                <a
                  onClick={() =>
                    startGame(
                      selectedGames[index].id,
                      selectedGames[index].difficulty,
                      selectedGames[index].name
                    )
                  }
                  className="btn btn-primary"
                >
                  Starta spel
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mb-4 mt-5">
          <h5>Laddar spelen...</h5>
          <div class="spinner-grow text-primary" role="status"></div>
          <div class="spinner-grow text-secondary" role="status"></div>
          <div class="spinner-grow text-success" role="status"></div>
          <div class="spinner-grow text-danger" role="status"></div>
          <h6>{error}</h6>
        </div>
      )}
    </div>
  );
}

export default Home;
