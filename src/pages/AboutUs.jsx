import React from "react";
import "../styles/AboutUs.css";

function AboutUs() {
  return (
    <div id="about-us-container">
      <div id="logo-wrapper">
        <img src="../memorymagi-logo.png" />
      </div>
      <div id="info-wrapper">
        <div id="header-wrapper">
          <h3>MemoryMagi - förbättrar barns minne sedan 2024</h3>
        </div>
        <div id="team-info-wrapper">
          <h6>Om oss</h6>
          <p>
            Vi är ett passionerat team av utvecklare, pedagoger och konstnärer
            som delar en gemensam vision: att skapa produkter som är lika
            lärorika som de är underhållande. Med erfarenhet inom både
            utbildning och spelutveckling har vi kombinerat våra kunskaper för
            att skapa MemoryMagi, ett spel som uppmuntrar lärande genom lek. Vår
            målsättning är att alla våra produkter ska bidra till barns
            kognitiva utveckling på ett kreativt och engagerande sätt.{" "}
          </p>
        </div>
        <div id="game-info-wrapper">
          <h6>Om spelet</h6>
          <p>
            MemoryMagi är ett magiskt minnesspel skapat för att inte bara
            underhålla, utan även utbilda. Genom att vända och matcha kort, får
            barnen möjlighet att utveckla och förbättra sin koncentration och
            minneskapacitet. Varje kort är designat med färgglada illustrationer
            och spännande figurer som fångar barns fantasi och gör lärandet
            roligt. Vårt spel är utformat för att passa alla åldrar och skapa
            glädje för både barn och föräldrar när de spelar tillsammans.
          </p>
        </div>
        <div id="vision-info-wrapper">
          <h6>Vårt mål</h6>
          <p>
            Vårt mål är att inspirera och utbilda barn genom innovativa och
            roliga spel. Vi tror att lärande ska vara en upplevelse fylld med
            glädje och nyfikenhet. Med MemoryMagi strävar vi efter att skapa en
            plattform där minnesträning blir till en spännande resa i en värld
            av magi och äventyr. Vi vill ge barnen de verktyg de behöver för att
            utvecklas, samtidigt som vi sprider glädje och uppmuntrar till
            gemensamt spelande i familjen.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
