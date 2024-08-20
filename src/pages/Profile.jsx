import React from "react";
import "../styles/Profile.css";

//Seed data
const achievements = [
  { id: 1, name: "Stjärna", earned: true },
  { id: 2, name: "Mästare", earned: true },
  { id: 3, name: "Expert", earned: true },
  { id: 4, name: "Novis", earned: true },
  { id: 5, name: "Hjälte", earned: false },
  { id: 6, name: "Arcane Magiker", earned: true },
  { id: 7, name: "Guldletare", earned: false },
  { id: 8, name: "Förtrollad Upptäckare", earned: false },
  { id: 9, name: "Kunglig Blodlinje", earned: false },
  { id: 10, name: "Profet", earned: false },
  { id: 11, name: "Hjärnmagi", earned: true },
  { id: 12, name: "Eldens Väktare", earned: false },
  { id: 13, name: "Stridens General", earned: true },
  { id: 14, name: "Mystiskt Geni", earned: false },
  { id: 15, name: "Stormens Varelse", earned: false },
  { id: 16, name: "Kosmisk Väktare", earned: true },
  { id: 17, name: "Drakryttare", earned: false },
  { id: 18, name: "Nattens Väktare", earned: false },
  { id: 19, name: "Skuggornas Krigare", earned: false },
  { id: 20, name: "Ljusalv", earned: false },
];

function Profile() {
  const earnedAchievements = achievements.filter((ach) => ach.earned);
  const unearnedAchievements = achievements.filter((ach) => !ach.earned);

  return (
    <>
      <div className="profile-page">
        <div className="col-1"></div>
        {/* <div className="profile-menu col-2">
          <button className="btn-profile-overview btn btn-secondary">
            Profil överblick
          </button>
          <button className="btn-profile-settings btn btn-secondary">
            Profil inställningar
          </button>
          <button className="btn-achievements btn btn-secondary">
            Medaljer
          </button>
        </div> */}

        <div className="profile-content col-10">
          <div className="profile-content-left">
            <h1>Profil nivå</h1>
            <h2>Du är nivå: [3]</h2>
            <h3>Poäng till nästa nivå: [420]</h3>
            <div className="achievements-section">
              <h2>Medaljer</h2>
              <div className="achievements-earned">
                <h3>Dina medaljer</h3>
                <div className="achievements-grid">
                  {earnedAchievements.map((ach) => (
                    <div key={ach.id} className="achievement-item">
                      {ach.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="achievements-not-earned">
                <h3>Låsta Medaljer</h3>
                <div className="achievements-grid">
                  {unearnedAchievements.map((ach) => (
                    <div key={ach.id} className="achievement-item">
                      {ach.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-content-right">
            <h1>Profil detaljer</h1>

            <div className="input-field-box">
              <div className="justify-space-between">
                <label className="m-2 font-weight-bold">Användarnamn: </label>
                <input type="username"></input>
              </div>
              <button className="w-100 mt-2 btn btn-info font-weight-bold">
                Ändra användarnamn
              </button>
            </div>

            <div className="input-field-box">
              <div className="justify-space-between">
                <label className="m-2 font-weight-bold">E-post: </label>
                <input type="email"></input>
              </div>
              <button className="w-100 mt-2 btn btn-info font-weight-bold">
                Ändra E-post
              </button>
            </div>

            <div className="input-field-box">
              <div className="justify-space-between">
                <label className="m-2 font-weight-bold">Nytt lösenord: </label>
                <input type="password"></input>
              </div>

              <div className="justify-space-between mt-2">
                <label className="m-2 font-weight-bold">
                  Bekräfta lösenord:{" "}
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
