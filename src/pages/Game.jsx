import React, {useState,useEffect} from 'react'
import cardback from '../assets/cardBack.png'
import cardFront from '../assets/cardFront.png'
import './Game.css'




function Game() {
  const [items, setItems] = useState([]);
  const [flippedcards, setNewflipState] = useState({});

  const handleFlip = (id) => {

    //kolla hur många kort som är flippade
    const flippedCardsCount = Object.keys(flippedcards).filter(
      (cardId) => flippedcards[cardId]
    );
    //om mer än 2 kort är vända så ska inte fler kort vändas
    if (flippedCardsCount.length === 2 )
      {
        return;
      }
      //lägg till nytt kort som ska flippas
    setNewflipState((prev) => ({
      ...prev,
      [id]: !prev[id]
  
    }));
  };
  
    //Hämta alla korten från api
    useEffect(() => {
      fetch("https://localhost:7259/api/Item")
        .then((res) => res.json())
        .then((data) => setItems(data));
    }, []);

    //Denna är aktiv hela tiden och kollar hur många kort som är klickade just nu.
    useEffect(() => {
      const flippedCardIds = Object.keys(flippedcards).filter(
        (cardId) => flippedcards[cardId]
      );
  
      if (flippedCardIds.length === 2 ) {
        const [firstCard, secondCard] = flippedCardIds;

        if (firstCard === secondCard) {
          console.log("Korten matchar");
        } else 
        {
          //resetta alla kort om det inte var en match
          setTimeout(() => {
            setNewflipState({});
          }, 2250);
        }
      }
    }, [flippedcards]); 


  return (
    <div className="container">
  <div className="row" >

  {items.map((item) => (
       <div className="col-sm-4"
       style={{  height: '30rem' }}
       key={item.id}
       onClick={() => handleFlip(item.id)}>
        <div className={`card ${flippedcards[item.id]? 'cardFlip' : ''}`}>
      <div className='back'>
                <img src={cardFront} alt="" style={{ width: '20rem', height: 'auto' }} />
              </div>
                <div
               className='front'>
                <img src={cardback} alt="" style={{ width: '20rem', height: 'auto' }} />
              </div>
              </div>
     </div>
        ))}

  </div>
  </div>

  );
}

export default Game;
