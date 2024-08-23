import React, {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import "../styles/Home.css";
import cardFront from '../assets/Animals_example_omslagI.jpg'


function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`https://localhost:7259/api/Category`)
      .then((res) => res.json())
      .then(data =>{
        setCategories(data);
          }) 
  }, []);

  const startGame= (categoryObj,level) =>{
    var gameData = {category:categoryObj, difficultyLevel:level
    }
    navigate("/Game", { state: {gameData}});


  }
  return (
 
    <div className="container">
    <div className="mt-5 mb-5 d-flex justify-content-center">
      <div>
        <h1>Welcome to Memory-Magi</h1>
        <div className="text-center">
          <button className="btn btn-primary me-3">Publika spel</button>
          <button className="btn btn-primary">Privata spel</button>
        </div>
       
        <div className="row" >
          
           {categories.map((category, index) => (
     <div className="card mb-2 ml-2 mr-2" >
      <img  src={cardFront} alt="" style={{ width: 'auto', height: 'auto' }} />
     <div className="card-body text-center">
       <h5 className="card-title">{category.name}</h5>
       <a onClick={() => startGame(category, "Easy")} className="btn btn-primary">Starta spel</a>
     </div>
   </div>
 
        ))}


</div>

      </div>
    </div>
  </div>

  );
}

export default Home;
