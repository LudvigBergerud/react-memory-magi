import React, { useEffect, useState } from "react";
import "../styles/Profile.css";

//Seed data
const achievements = [
  {
    id: 1,
    name: "Stjärna",
    earned: true,
    description: "Klarat alla nivåer i spelet med perfekt resultat.",
    points: 100,
  },
  {
    id: 2,
    name: "Mästare",
    earned: true,
    description: "Avslutat spelet utan att göra några fel.",
    points: 90,
  },
  {
    id: 3,
    name: "Expert",
    earned: true,
    description: "Slutfört spelet på svåraste svårighetsgraden.",
    points: 80,
  },
  {
    id: 4,
    name: "Novis",
    earned: true,
    description: "Avklarat din första nivå i spelet.",
    points: 20,
  },
  {
    id: 5,
    name: "Hjälte",
    earned: false,
    description: "Räddat en medspelare genom att lösa ett svårt pussel.",
    points: 50,
  },
  {
    id: 6,
    name: "Arcane Magiker",
    earned: true,
    description:
      "Använt specialförmågor för att lösa de svåraste utmaningarna.",
    points: 70,
  },
  {
    id: 7,
    name: "Guldletare",
    earned: false,
    description: "Hittat alla gömda skatter i spelet.",
    points: 60,
  },
  {
    id: 8,
    name: "Förtrollad Upptäckare",
    earned: false,
    description: "Upptäckt alla hemliga platser i spelet.",
    points: 40,
  },
  {
    id: 9,
    name: "Kunglig Blodlinje",
    earned: false,
    description: "Slutfört en uppgift som endast de ädlaste kan hantera.",
    points: 100,
  },
  {
    id: 10,
    name: "Profet",
    earned: false,
    description: "Förutsett och undvikit alla faror i spelet.",
    points: 60,
  },
  {
    id: 11,
    name: "Hjärnmagi",
    earned: true,
    description: "Löst alla pussel genom att använda minne och logik.",
    points: 85,
  },
  {
    id: 12,
    name: "Eldens Väktare",
    earned: false,
    description: "Skyddat de sista eldsflammorna från att slockna.",
    points: 70,
  },
  {
    id: 13,
    name: "Stridens General",
    earned: true,
    description: "Vunnit alla strider i spelet utan att förlora en enda gång.",
    points: 95,
  },
  {
    id: 14,
    name: "Mystiskt Geni",
    earned: false,
    description: "Löst de mest komplexa gåtorna utan hjälp.",
    points: 100,
  },
  {
    id: 15,
    name: "Stormens Varelse",
    earned: false,
    description: "Överlevt en storm av utmaningar utan att bli besegrad.",
    points: 80,
  },
  {
    id: 16,
    name: "Kosmisk Väktare",
    earned: false,
    description:
      "Försvarat universumets jämvikt genom att klara alla svåra nivåer.",
    points: 90,
  },
  {
    id: 17,
    name: "Drakryttare",
    earned: false,
    description: "Bemästrat konsten att tämja och rida på drakar.",
    points: 85,
  },
  {
    id: 18,
    name: "Nattens Väktare",
    earned: false,
    description: "Vunnit en kamp mot nattens krafter.",
    points: 75,
  },
  {
    id: 19,
    name: "Skuggornas Krigare",
    earned: false,
    description: "Besegrat fiender som gömmer sig i skuggorna.",
    points: 65,
  },
  {
    id: 20,
    name: "Ljusalv",
    earned: false,
    description: "Använt ljusets kraft för att övervinna mörkrets utmaningar.",
    points: 80,
  },
];

function Profile() {
  const earnedAchievements = achievements.filter((ach) => ach.earned);
  const unearnedAchievements = achievements.filter((ach) => !ach.earned);

  const [visibleTooltip, setVisibleTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({});

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitUsername = async (e) => {
    e.preventDefault();
    const accessTokenString = localStorage.getItem("accessToken");
    const accessToken = accessTokenString
      ? JSON.parse(accessTokenString)
      : null;

    const responseUser = await fetch("https://localhost:7259/api/Users/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    if (responseUser.ok) {
      const data =
        responseUser.headers.get("Content-Length") !== "0"
          ? await responseUser.json()
          : {};
      console.log(data);
      const responseUpdate = await fetch(
        "https://localhost:7259/api/Users/update-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: data.userId,
            userName: userName,
            email: email,
          }),
        }
      );
      if (responseUpdate.ok) {
        console.log("Update username successful");
      } else {
        const error =
          responseUpdate.headers.get("Content-Length") !== "0"
            ? await responseUpdate.json()
            : {};
        console.error("Update username failed:", JSON.stringify(error));
      }
    } else {
      const error =
        responseUser.headers.get("Content-Length") !== "0"
          ? await responseUser.json()
          : {};
      console.error("Failed getting user info: " + JSON.stringify(error));
    }
  };

  const handleMouseEnter = (id, e) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + window.scrollY + 20,
      left: rect.left + window.scrollX + 20,
    });
    setVisibleTooltip(id);
  };

  const handleMouseLeave = () => {
    setVisibleTooltip(null);
  };

  function getEarnedAchievementPoints() {
    let points = 0;
    earnedAchievements.map((ach) => (points += ach.points));
    return points;
  }

  function getAllAchievementPoints() {
    let points = 0;
    achievements.map((ach) => (points += ach.points));
    return points;
  }

  return (
    <>
      <div className="profile-page">
        <div className="col-1"></div>
        <div className="profile-content col-10">
          <div className="profile-content-left">
            <h1>Profil nivå</h1>
            <h2>Du är nivå: [3]</h2>
            <h3>Poäng till nästa nivå: [420]</h3>
            <div className="achievements-section">
              <h2>
                Medaljer
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="45"
                  height="45"
                  fill="currentColor"
                  className="bi bi-award"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z" />
                  <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z" />
                </svg>{" "}
                <span>
                  Du har [{getEarnedAchievementPoints()}/
                  {getAllAchievementPoints()}] poäng
                </span>
              </h2>

              <div className="achievements-box">
                <div className="achievements-earned">
                  <h3>Dina medaljer</h3>
                  <div className="achievements-grid">
                    {earnedAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="achievement-item"
                        onMouseEnter={(e) =>
                          handleMouseEnter(achievement.id, e)
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        {achievement.name}
                        {visibleTooltip === achievement.id && (
                          <div
                            className="custom-tooltip"
                            style={{
                              position: "fixed",
                              top: tooltipPosition.top + 50,
                              left: tooltipPosition.left,
                            }}
                          >
                            {achievement.description}
                            <br />
                            <p className="mb-0">
                              Värd {achievement.points} poäng
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="achievements-not-earned mt-4">
                  <h3>Låsta Medaljer</h3>
                  <div className="achievements-grid">
                    {unearnedAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="achievement-item"
                        onMouseEnter={(e) =>
                          handleMouseEnter(achievement.id, e)
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        {achievement.name}
                        {visibleTooltip === achievement.id && (
                          <div
                            className="custom-tooltip"
                            style={{
                              position: "fixed",
                              top: tooltipPosition.top + 50,
                              left: tooltipPosition.left,
                            }}
                          >
                            {achievement.description}
                            <br />
                            <p className="mb-0">
                              Värd {achievement.points} poäng
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-content-right">
            <h1 className="mb-5">Profil detaljer</h1>

            <form onSubmit={handleSubmitUsername} className="input-field-box">
              <div className="justify-space-between">
                <label className="m-2 font-weight-bold">Användarnamn: </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-100 mt-2 btn btn-info font-weight-bold"
              >
                Ändra användarnamn
              </button>
            </form>

            <form className="input-field-box">
              <div className="justify-space-between">
                <label className="m-2 font-weight-bold">E-post: </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <button className="w-100 mt-2 btn btn-info font-weight-bold">
                Ändra E-post
              </button>
            </form>

            <div className="input-field-box">
              <div className="justify-space-between">
                <label className="m-2 font-weight-bold">
                  Nuvarande lösenord:{" "}
                </label>
                <input type="password"></input>
              </div>

              <div className="justify-space-between mt-2">
                <label className="m-2 font-weight-bold">Nytt lösenord: </label>
                <input type="password"></input>
              </div>

              <div className="justify-space-between mt-2">
                <label className="m-2 font-weight-bold">
                  Bekräfta lösenord:
                </label>
                <input type="password"></input>
              </div>

              <button className="w-100 mt-2 btn btn-info font-weight-bold">
                Ändra lösenord
              </button>
            </div>
          </div>
        </div>
        <div className="col-1"></div>
      </div>
    </>
  );
}

export default Profile;
