import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import ItemPopupModal from "../components/ItemPopupModal";
import CategoryPopupModal from "../components/CategoryPopupModal";
import InviteUsersModal from "../components/InviteUsersModal";
import "../styles/Create.css";

function Create() {
  const [categories, setCategories] = useState([]);
  const [games, setGames] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [selectedDifficultyLevel, setSelectedDifficultyLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameType, setGameType] = useState(""); 
  const [gameName, setGameName] = useState("");
  const [cards, setCards] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]); 
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false); 
  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate();

  const handleShowError = (message) => {
    setError(message);
    setShowErrorModal(true);
  };

  const handleShowMessage = (message) => {
    setMessage(message);
    setShowErrorModal(true);
  };

  const handleCloseError = () => {
    setShowErrorModal(false);
    setError("");
    setMessage("");
  };

  const fetchCategoriesAndGames = useCallback(async () => {
    const accessTokenString = localStorage.getItem("accessToken");
    const accessTokenData = accessTokenString
      ? JSON.parse(accessTokenString)
      : null;
    const accessToken = accessTokenData ? accessTokenData.accessToken : null;

    if (!accessToken) {
      setError("Ingen giltig access token hittades. Vänligen logga in igen.");
      navigate("/landingpage");
      return;
    }

    try {
      const categoriesResponse = await fetch(
        "https://localhost:7259/api/category/GetCategories",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!categoriesResponse.ok)
        throw new Error("Failed to fetch categories.");

      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData || []);

      const gamesResponse = await fetch(
        "https://localhost:7259/api/game/GetAllGames",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!gamesResponse.ok) throw new Error("Failed to fetch games.");
      const gamesData = await gamesResponse.json();
      setGames(gamesData);
    } catch (error) {
      handleShowError(`Fel vid hämtning av data: ${error.message}`);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCategoriesAndGames();

    const accessTokenString = localStorage.getItem("accessToken");
    const accessTokenData = accessTokenString
      ? JSON.parse(accessTokenString)
      : null;
    const accessToken = accessTokenData ? accessTokenData.accessToken : null;

    fetch("https://localhost:7259/api/difficultylevel/GetAllDifficultyLevels", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDifficultyLevels(data || []);
      })
      .catch((error) =>
        handleShowError(
          `Fel vid hämtning av svårighetsgrader: ${error.message}`
        )
      );
  }, [fetchCategoriesAndGames]);

  const isDuplicateCard = (newCard) => {
    return cards.some(
      (card) =>
        card.name.toLowerCase() === newCard.name.toLowerCase() ||
        card.image === newCard.image
    );
  };

  const handleSaveCard = (newCard) => {
    if (isDuplicateCard(newCard)) {
      handleShowError("Kortet med samma namn eller bild URL finns redan.");
      return;
    }
    newCard.gameId = -1;
    setCards((prev) => [...prev, newCard]);
    setShowModal(false);
  };

  const handleSaveCategory = (newCategory) => {
    if (!newCategory.name.trim()) {
      handleShowError("Kategorinamn måste anges.");
      return;
    }

    fetchCategoriesAndGames();
    setShowCategoryModal(false);
  };

  const handleSaveInvites = (users) => {
    setInvitedUsers(users);
  };

  const handleRemoveCard = (indexToRemove) => {
    setCards((prevCards) =>
      prevCards.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleGameTypeChange = (e) => {
    const selectedGameType = e.target.value;
    setGameType(selectedGameType);

    if (selectedGameType === "public") {
      setInvitedUsers([]);
    }
  };

  const handleSubmitGame = async (e) => {
    e.preventDefault();

    if (!categories || !categories.length) {
      handleShowError("Inga kategorier tillgängliga.");
      return;
    }

    if (!difficultyLevels || !difficultyLevels.length) {
      handleShowError("Inga svårighetsgrader tillgängliga.");
      return;
    }

    if (!selectedDifficultyLevel) {
      handleShowError("Du måste välja en svårighetsgrad.");
      return;
    }

    const selectedDifficulty = difficultyLevels.find(
      (d) => d.id === selectedDifficultyLevel
    );

    if (
      !selectedDifficulty ||
      typeof selectedDifficulty.nrOfCards === "undefined"
    ) {
      handleShowError(
        "Ett fel uppstod vid hämtning av svårighetsgradens information."
      );
      return;
    }

    if (!gameName.trim() || !gameType.trim() || !selectedCategory) {
      handleShowError("Alla fält är obligatoriska.");
      return;
    }

    const isDuplicateGame = games.some(
      (game) => game.name.toLowerCase() === gameName.toLowerCase()
    );

    if (isDuplicateGame) {
      handleShowError("Ett spel med samma namn finns redan.");
      return;
    }

    if (cards.length !== selectedDifficulty.nrOfCards) {
      handleShowError(
        `Du måste lägga till exakt ${selectedDifficulty.nrOfCards} kort för svårighetsgraden ${selectedDifficulty.name}.`
      );
      return;
    }

    const gameData = {
      name: gameName,
      categoryId: selectedCategory,
      difficultyLevelId: selectedDifficultyLevel,
      gameType: gameType,
      items: cards,
      allowedUsers:
        gameType === "private"
          ? invitedUsers.map((user) => ({ userId: user.userId }))
          : [], 
    };

    const accessTokenString = localStorage.getItem("accessToken");
    const accessTokenData = accessTokenString
      ? JSON.parse(accessTokenString)
      : null;
    const accessToken = accessTokenData ? accessTokenData.accessToken : null;

    if (!accessToken) {
      handleShowError(
        "Ingen giltig access token hittades. Vänligen logga in igen."
      );
      navigate("/landingpage");
      return;
    }

    try {
      const response = await fetch("https://localhost:7259/api/game/PostGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        handleShowError(`Fel vid skapande av spel: ${errorText}`);
        return;
      }

      handleShowMessage("Spelet skapades!");

      setTimeout(() => {
        navigate("/Home");
      }, 3000);
    } catch (error) {
      handleShowError(`Fel vid skapande av spel: ${error.message}`);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const openCategoryModal = () => setShowCategoryModal(true);
  const closeCategoryModal = () => setShowCategoryModal(false);

  const openInviteModal = () => setShowInviteModal(true);
  const closeInviteModal = () => setShowInviteModal(false);

  return (
    <div className="create-container">
      <div className="create-button-group">
        <button onClick={openModal} className="create-primary-button">
          Lägg till nytt kort
        </button>
        {gameType === "private" && (
          <button onClick={openInviteModal} className="create-secondary-button">
            Bjud in användare
          </button>
        )}
        <button
          onClick={openCategoryModal}
          className="create-secondary-button"
        >
          Skapa ny kategori
        </button>
      </div>

      <form onSubmit={handleSubmitGame} className="create-form-section">
        <div className="create-form-group">
          <label>Spelnamn:</label>
          <input
            placeholder="Skriv namnet på spelet här..."
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            required
          />
        </div>

        <div className="create-form-group">
          <label>Speltyp:</label>
          <select
            value={gameType}
            onChange={handleGameTypeChange}
            required
          >
            <option value="">Välj Speltyp</option>
            <option value="public">Offentligt</option>
            <option value="private">Privat</option>
          </select>
        </div>

        <div className="create-form-group">
          <label>Kategori:</label>
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            required
          >
            <option value="">Välj Kategori</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name || "Unnamed Category"}
                </option>
              ))
            ) : (
              <option value="">Inga kategorier tillgängliga</option>
            )}
          </select>
        </div>

        <div className="create-form-group">
          <label>Svårighetsgrad:</label>
          <select
            value={selectedDifficultyLevel || ""}
            onChange={(e) => setSelectedDifficultyLevel(Number(e.target.value))}
            required
          >
            <option value="">Välj Svårighetsgrad</option>
            {difficultyLevels.length > 0 ? (
              difficultyLevels.map((difficulty) => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.name}
                </option>
              ))
            ) : (
              <option value="">Inga svårighetsgrader tillgängliga</option>
            )}
          </select>
        </div>

        {gameType === "private" && invitedUsers.length > 0 && (
          <div className="create-form-group">
            <p>Antal inbjudna användare: {invitedUsers.length}</p>
          </div>
        )}

        <button type="submit" className="create-submit-button">
          Skapa spel
        </button>

        <div className="create-card-count">
          {selectedDifficultyLevel && (
            <p>
              {cards.length}/
              {difficultyLevels.find((d) => d.id === selectedDifficultyLevel)
                ?.nrOfCards || 0}{" "}
              Kort
            </p>
          )}
        </div>
      </form>

      <div className="create-card-list-wrapper">
        {cards.length > 0 && (
          <div className="create-card-list-container">
            {cards.map((card, index) => (
              <div key={index} className="create-card-list-item">
                <img src={card.image} alt={card.name} />
                <div className="create-card-list-item-name">{card.name}</div>
                <button
                  className="create-remove-card-button"
                  onClick={() => handleRemoveCard(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ItemPopupModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSaveCard}
      />

      <CategoryPopupModal
        show={showCategoryModal}
        handleClose={closeCategoryModal}
        handleSave={handleSaveCategory}
        showMessage={handleShowMessage}
        categories={categories}
      />

      <InviteUsersModal
        show={showInviteModal}
        handleClose={closeInviteModal}
        handleSaveInvites={handleSaveInvites}
        currentInvitedUsers={invitedUsers}
        showMessage={handleShowError}
      />

      <Modal show={showErrorModal} onHide={handleCloseError} centered>
        <Modal.Header closeButton>
          <Modal.Title>{error ? "Fel" : "Meddelande"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error || message}</Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

export default Create;
