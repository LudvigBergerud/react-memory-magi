import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import Omslagbild from "../assets/Animals_example_omslag.png";
import video from "../assets/blue_background.mp4";
import Dropdown from "react-bootstrap/Dropdown";
import useFetch from "../hooks/useFetch";

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedGames, setSelectedGames] = useState({});
  const [filters, setFilter] = useState("public");
  const [error, setError] = useState("");
  const fetchHandler = useFetch();

  //Get categories upon render
  useEffect(() => {
    fetchHandler.handleData(
      "https://localhost:7259/api/Category/GetCategoriesWithIncludedData",
      "GET"
    );
  }, []);

  //Set data when fetching is complete and data is available
  useEffect(() => {
    if (fetchHandler.data) {
      setCategories(fetchHandler.data.$values);
    }
  }, [fetchHandler.data]);

  //Show error with fetching categories if there is any.
  useEffect(() => {
    if (fetchHandler.error) {
      setError(
        "Anslutning till servern verkar ej vara möjlig. Försök igen senare."
      );
    }
  }, [fetchHandler.error]);

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
        <h1>Välkommen till Memory Magi</h1>
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
                height: "auto",
              }}
            >
              <div className="card-body text-center">
                <h2 className="card-title">{category.Name}</h2>
                <img
                  src={category.Image}
                  alt=""
                  style={{ width: "100%", height: "60%", borderRadius: "50px" }}
                />

                <Dropdown className="mb-2 mt-2">
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

                {selectedGames[index] && (
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
                )}
              </div>
            </div>
          ))}
        </div>
      ) : fetchHandler.loading ? (
        <div className="text-center mb-4 mt-5">
          <h5>Laddar spelen...</h5>
          <div class="spinner-grow text-primary" role="status"></div>
          <div class="spinner-grow text-secondary" role="status"></div>
          <div class="spinner-grow text-success" role="status"></div>
          <div class="spinner-grow text-danger" role="status"></div>
        </div>
      ) : error ? (
        <div className="text-center mb-4 mt-5">
          <h6>{error}</h6>
        </div>
      ) : categories.length <= 0 ? (
        <div className="text-center mb-4 mt-5">
          <h6>Inga spel finns tillgängliga idag. Försök igen senare!</h6>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Home;
