import React, {useState,useEffect} from 'react'
import cardback from '../assets/cardBack.png'
import cardFront from '../assets/cardFront.png'
import './Game.css'




function Game() {
  const [items, setItems] = useState([]);
  const [flippedcards, setNewflipState] = useState({});
  const [listOfFlippedCards, setList] = useState([]);

  let categoryId=3; //Denna behöver routas in beroende på vilket spel användare väljer
  let difficulty ='Easy'; // Samma som ovan, routas in från quiz home page sidan, tillfällig variabel.

const DifficultyEnum =
{
  Easy:2,
  Medium:3,
  Hard:4
}
console.log("svårighet " + DifficultyEnum[difficulty]);
  const handleFlip = (id,index) => {
console.log("kortid-:"+id)

    setList([...listOfFlippedCards, id]);
 

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
      [index]: !prev[index]
  
    }));
    

  };
  
    //Hämta korten från en specifik kategori
    useEffect(() => {
      fetch("https://localhost:7259/api/Item")
        .then((res) => res.json())
        .then(data =>{
          //filtrera ut rätt kategori och kolla vilken svårighetgrad = antal kort
            const filtereditems = data.filter(item => item.categoryId === categoryId).slice(0, DifficultyEnum[difficulty]);
            //Duplicera listan då vi behöver ha 2 kort av varje för memory
            const deepCopiedItems = filtereditems.map(item => JSON.parse(JSON.stringify(item)));
            const doubledItems = [...filtereditems, ...deepCopiedItems];
            //Shuffla listan
            for (var i = doubledItems.length - 1; i > 0; i--) {
              var j = Math.floor(Math.random() * (i + 1));
              var temp = doubledItems[i];
              doubledItems[i] = doubledItems[j];
              doubledItems[j] = temp;
            }
            setItems(doubledItems);
          })
        
    }, []);

    //Denna är aktiv hela tiden och kollar hur många kort som är klickade just nu.
    useEffect(() => {
      console.log(listOfFlippedCards);
   


      if (listOfFlippedCards.length === 2 ) {
        const [firstCard, secondCard] = listOfFlippedCards
      console.log("första:"+firstCard);  // 10
console.log("andra"+secondCard);

        if (firstCard === secondCard) {
          console.log("Korten matchar");
        } else 
        {
          //resetta alla kort om det inte var en match
          setTimeout(() => {
            setNewflipState({});
            setList([]);
          }, 2250);
        }
      }
    }, [flippedcards]); 


  return (
    <div className="container">
      <div className='justify-content center'>
        <h1>klocka</h1>
      </div>
  <div className="row" >

  {items.map((item, index) => (
       <div className="col-sm-4"
       style={{  height: '30rem' }}
       key={index}
       onClick={() => handleFlip(item.id, index)}>
        <div className={`card ${flippedcards[index]? 'cardFlip' : ''}`}>
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
