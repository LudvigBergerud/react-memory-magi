import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemPopupModal from "../components/ItemPopupModal";
import CategoryPopupModal from "../components/CategoryPopupModal";
import "../styles/Create.css";

function Create() {
  const [categories, setCategories] = useState([]);
  const [selectedDifficultyLevel, setSelectedDifficultyLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameType, setGameType] = useState('');
  const [cards, setCards] = useState([]);  
  const [error, setError] = useState('');
  const [user, setUser] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const accessTokenString = localStorage.getItem('accessToken');
    const accessTokenData = accessTokenString ? JSON.parse(accessTokenString) : null;
    const accessToken = accessTokenData ? accessTokenData.accessToken : null;

    if (!accessToken) {
      setError('Ingen giltig access token hittades. Vänligen logga in igen.');
      navigate('/login');
      return;
    }

    fetch('https://localhost:7259/api/category/GetCategories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }).then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => setError(`Fel vid hämtning av kategorier: ${error.message}`));

    fetch('https://localhost:7259/api/Users/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }).then(response => response.json())
      .then(data => {
        if (data && data.id && data.userName) {
          setUser(data);
        } else {
          setError('Användardata är ofullständig eller saknas. Vänligen logga in igen.');
        }
      }).catch(error => {
        setError(`Fel vid hämtning av användare: ${error.message}`);
      });
  }, [navigate]);

  const handleSaveCard = (newCard) => {
    newCard.gameId = -1; 
    setCards(prev => [...prev, newCard]); 
    setShowModal(false);
  };

  const handleSaveCategory = (newCategory) => {
    setCategories(prev => [...prev, newCategory]);
    setShowCategoryModal(false);
  };

  const handleRemoveCard = (indexToRemove) => {
    setCards(prevCards => prevCards.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitGame = async (e) => {
    e.preventDefault();

    if (!gameType.trim() || !selectedCategory || !selectedDifficultyLevel || !user || cards.length === 0) {
        setError('Alla fält är obligatoriska, och minst ett kort måste associeras med spelet.');
        return;
    }

    const gameData = {
        categoryId: selectedCategory,
        difficultyLevelId: parseInt(selectedDifficultyLevel, 10),
        gameType: gameType,
        createdBy: user.id,
    };

    const accessTokenString = localStorage.getItem('accessToken');
    const accessTokenData = accessTokenString ? JSON.parse(accessTokenString) : null;
    const accessToken = accessTokenData ? accessTokenData.accessToken : null;

    if (!accessToken) {
        setError('Ingen giltig access token hittades. Vänligen logga in igen.');
        navigate('/login');
        return;
    }

    try {
        const response = await fetch('https://localhost:7259/api/game/PostGameWithId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(gameData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            setError(`Fel vid skapande av spel: ${errorText}`);
            return;
        }

        const responseData = await response.json();
        const createdGameId = responseData.id || responseData.Id;

        if (!createdGameId) {
            setError('Misslyckades med att hämta spel-ID. Vänligen försök igen.');
            return;
        }

        const updatedCards = cards.map(card => ({ ...card, gameId: createdGameId }));

        for (const card of updatedCards) {
            const itemResponse = await fetch('https://localhost:7259/api/Item/AddItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(card),
            });

            if (!itemResponse.ok) {
                const itemErrorText = await itemResponse.text();
                setError(`Fel vid postning av kort: ${itemErrorText}`);
                return;
            }
        }

        navigate('/games');

    } catch (error) {
        setError(`Fel vid skapande av spel: ${error.message}`);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const openCategoryModal = () => setShowCategoryModal(true);
  const closeCategoryModal = () => setShowCategoryModal(false);

  return (
    <div className="container">
      <div className="button-group">
        <button onClick={openModal} className="btn btn-primary mb-3">Lägg till nytt kort</button>
        <button onClick={openCategoryModal} className="btn btn-secondary mb-3">Skapa ny kategori</button>
      </div>

      <form onSubmit={handleSubmitGame} className="form-section">
        <label>
          Speltyp:
          <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
            <option value="">Välj Speltyp</option>
            <option value="public">Offentligt</option>
            <option value="private">Privat</option>
          </select>
        </label>
        <label>
          Kategori:
          <select
            value={selectedCategory || ''}
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
        <button type="submit" className="btn btn-success">Skapa spel</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
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

      {cards.length > 0 && (
        <div className="card-list-container">
          {cards.map((card, index) => (
            <div key={index} className="card-list-item">
              <img src={card.image} alt={card.name} />
              <div className="card-list-item-name">{card.name}</div>
              <button className="remove-card-button" onClick={() => handleRemoveCard(index)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Create;
