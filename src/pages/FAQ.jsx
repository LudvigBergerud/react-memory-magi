import React from "react";
import "../styles/FAQ.css";

function FAQ() {
  const questions = [
    {
      question: "Hur loggar jag in?",
      answer: `Gå till <a href="http://localhost:3000/login">denna sida</a> och fyll i din e-post och ditt lösenord.`,
    },
    {
      question: "Hur kan jag få support?",
      answer:
        "Skicka ett mejl till <a href='mailto:support@MemoryMagic.com'>support@MemoryMagic.com</a>",
    },
    {
      question: "Måste jag skapa ett konto för att spela?",
      answer: "Ja, alla måste skapa ett konto för att spela",
    },
    {
      question: "Hur startar jag spelet?",
      answer:
        "Efter att du loggat in, kommer du till en sida där du väljer vilken kategori och svårighetsgrad du vill spela på. Därefter startar spelet.",
    },
    {
      question: "Hur spelar jag?",
      answer:
        "När spelet startat visas kort på skärmen - lägg korten och dess placering på minnet. Efter några sekunder vänds dem upp och ner och nu gäller det för dig att komma ihåg vilka kort som låg var. Du klickar på valfritt kort och får se framsidan på det. Nästa steg är att hitta det andra kortet som ser likadant ut och klicka på det.",
    },
  ];
  return (
    <div id="faq-container">
      <div id="logo-wrapper">
        <img src="../memorymagi-logo.png" />
      </div>
      <div id="questions-wrapper">
        <div id="header-wrapper">
          <h3>Vanligt ställda frågor </h3>
        </div>
        <div id="asked-questions-wrapper">
          {questions.map((q) => (
            <div key={q.question}>
              <strong>{q.question}</strong>
              <p dangerouslySetInnerHTML={{ __html: q.answer }}></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;
