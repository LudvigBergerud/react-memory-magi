import React, {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import "../styles/Home.css";
import Omslagbild from '../assets/Animals_example_omslag.png'
import video from '../assets/blue_background.mp4';
import Dropdown from 'react-bootstrap/Dropdown'

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedGames, setSelectedGames] = useState({});
  const [filters, setFilters] = useState([]);
  
  const handleSelect = (game, index) => {
    console.log(game);
    // Update the selected game for the specific card
    setSelectedGames(prevState => ({
      ...prevState,
      [index]: {
        id: game.Id,
        difficulty: game.DifficultyLevel,
        gameName: `${game.DifficultyLevel} - ${game.Id}`
        
        
      }
      
    }
  )
);
  };


  useEffect(() => {
    const accessTokenString = localStorage.getItem("accessToken");
    const accessToken = accessTokenString ? JSON.parse(accessTokenString) : null;
  
    fetch(`https://localhost:7259/api/Category/GetCategoriesWithIncludedData`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.$values);
       console.log(data.$values);
      });
  }, []);

  const startGame= (categoryObj,level) =>{
    var gameData = {gameId:categoryObj, difficultyLevel:level
    }
    navigate("/Game", { state: {gameData}});


  }
  return (
 
    <div className="container">

        <div className="text-center mb-4">
        <h1>Welcome to Memory-Magi</h1>
          <button className="btn btn-primary me-3">Publika spel</button>
          <button className="btn btn-primary">Privata spel</button>
        </div>
       
        <div className="row justify-content-center" >
      
           {categories.map((category, index) => (
            
     <div key={category.Id} className="card mb-2 mx-2"style={{ borderRadius: "50px", position:"relative", overflow:"hidden", width:"350px", height:"425px"}} >
  
     <div className="card-body text-center" >
     <h2 className="card-title">{category.Name}</h2>
     <img   src={Omslagbild} alt="" style={{ width: '100%', height: '60%', borderRadius: '50px' }} />
        <video src={video} autoPlay muted loop style={{ overflow:"hidden", zIndex:-1, position: "absolute", objectFit:"cover", top: 0,left:0}}></video>
        
        <Dropdown className='mb-2'>
        <Dropdown.Toggle variant="success">
        {selectedGames[index]?.gameName  || "Välj spel"} 
        </Dropdown.Toggle>
        <Dropdown.Menu>
        {category.AllGames.$values.map((game) =>(
            <Dropdown.Item   key={game.Id}  href="#" onClick={() => handleSelect(game,index)}>
              {game.DifficultyLevel} - {game.Id}
            
      
          </Dropdown.Item>

        ))}
         </Dropdown.Menu>
     
      </Dropdown>
       
       <a onClick={
       
        () => startGame(selectedGames[index].id, selectedGames[index].difficulty)} className="btn btn-primary">Starta spel</a>
     </div>
   </div>
 
        ))}

</div>

    
 
  </div>

  );
}

export default Home;
