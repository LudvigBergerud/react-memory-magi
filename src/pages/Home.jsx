import React, {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import "../styles/Home.css";
import Omslagbild from '../assets/Animals_example_omslag.png'
import video from '../assets/blue_background.mp4';


function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const accessTokenString = localStorage.getItem("accessToken");
    const accessToken = accessTokenString ? JSON.parse(accessTokenString) : null;
  
    fetch(`https://localhost:7259/api/Category`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  const startGame= (categoryObj,level) =>{
    var gameData = {category:categoryObj, difficultyLevel:level
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
            
     <div className="card mb-2 mx-2"style={{ borderRadius: "50px", position:"relative", overflow:"hidden", width:"350px", height:"310px"}} >
  
     <div className="card-body text-center" >
     <img   src={Omslagbild} alt="" style={{ width: '100%', height: '60%', borderRadius: '50px' }} />
        <video src={video} autoPlay muted loop style={{ overflow:"hidden", zIndex:-1, position: "absolute", objectFit:"cover", top: 0,left:0}}></video>
        
     
       <h5 className="card-title">{category.name}</h5>
       <a onClick={() => startGame(category, "Hard")} className="btn btn-primary">Starta spel</a>
     </div>
   </div>
 
        ))}

</div>

    
 
  </div>

  );
}

export default Home;
