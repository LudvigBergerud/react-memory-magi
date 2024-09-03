import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import ItemPopupModal from "../components/ItemPopupModal";
import CategoryPopupModal from "../components/CategoryPopupModal";
import "../styles/Create.css";

function Create() {
  const [categories, setCategories] = useState([]);
  const [selectedDifficultyLevel, setSelectedDifficultyLevel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameType, setGameType] = useState("");
  const [gameName, setGameName] = useState("");
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
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

    fetch("https://localhost:7259/api/category/GetCategories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Categories API Response:", data);
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((error) =>
        handleShowError(`Fel vid hämtning av kategorier: ${error.message}`)
      );
  }, [navigate]);

  const handleShowError = (message) => {
    setError(message);
    setShowErrorModal(true);
  };

  const handleCloseError = () => {
    setShowErrorModal(false);
  };

  const handleSaveCard = (newCard) => {
    newCard.gameId = -1;
    setCards((prev) => [...prev, newCard]);
    setShowModal(false);
  };

  const handleSaveCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    setShowCategoryModal(false);
  };

  const handleRemoveCard = (indexToRemove) => {
    setCards((prevCards) =>
      prevCards.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmitGame = async (e) => {
    e.preventDefault();
    debugger;
    if (
      !gameName.trim() ||
      !gameType.trim() ||
      !selectedCategory ||
      !selectedDifficultyLevel ||
      cards.length === 0
    ) {
      handleShowError(
        "Alla fält är obligatoriska, och minst ett kort måste associeras med spelet."
      );
      return;
    }

    const gameData = {
      name: gameName,
      categoryId: selectedCategory,
      difficultyLevelId: parseInt(selectedDifficultyLevel, 10),
      gameType: gameType,
      items: cards,
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

      navigate("/games");
    } catch (error) {
      handleShowError(`Fel vid skapande av spel: ${error.message}`);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const openCategoryModal = () => setShowCategoryModal(true);
  const closeCategoryModal = () => setShowCategoryModal(false);

  return (
    <div className="container-create">
      <div className="button-group">
        <button onClick={openModal} className="btn btn-primary mb-3">
          Lägg till nytt kort
        </button>
        <button onClick={openCategoryModal} className="btn btn-secondary mb-3">
          Skapa ny kategori
        </button>
      </div>

      <form onSubmit={handleSubmitGame} className="form-section">
        <label>
          Spelnamn:
          <input
            placeholder="Skriv namn på spel här..."
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            required
          />
        </label>
        <label>
          Speltyp:
          <select
            value={gameType}
            onChange={(e) => setGameType(e.target.value)}
          >
            <option value="">Välj Speltyp</option>
            <option value="public">Offentligt</option>
            <option value="private">Privat</option>
          </select>
        </label>
        <label>
          Kategori:
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            required
          >
            <option value="">Välj Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Svårighetsgrad:
          <select
            value={selectedDifficultyLevel}
            onChange={(e) => setSelectedDifficultyLevel(e.target.value)}
            required
          >
            <option value="">Välj Svårighetsgrad</option>
            <option value="1">Lätt</option>
            <option value="2">Medium</option>
            <option value="3">Svår</option>
          </select>
        </label>
        <button type="submit" className="btn btn-success">
          Skapa spel
        </button>
      </form>

      <ItemPopupModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSaveCard}
      />

      <CategoryPopupModal
        show={showCategoryModal}
        handleClose={closeCategoryModal}
        handleSave={handleSaveCategory}
      />

      <Modal show={showErrorModal} onHide={handleCloseError}>
        <Modal.Header closeButton>
          <Modal.Title>Fel</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseError}>
            Stäng
          </button>
        </Modal.Footer>
      </Modal>

      {cards.length > 0 && (
        <div className="card-list-container">
          {cards.map((card, index) => (
            <div key={index} className="card-list-item">
              <img src={card.image} alt={card.name} />
              <div className="card-list-item-name">{card.name}</div>
              <button
                className="remove-card-button"
                onClick={() => handleRemoveCard(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Create;
