import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import useFetch from "../hooks/useFetch";
import achievementImages from "../utils/AchievementImages";

function Profile() {
  const [earnedAchievements, setEarnedAchievements] = useState(null);
  const [unearnedAchievements, setUnearnedAchievements] = useState(null);

  const [visibleTooltip, setVisibleTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({});

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchUserHandler = useFetch();
  const fetchAchievementHandler = useFetch();
  const updateUserInfoHandler = useFetch();
  const updatePasswordHandler = useFetch();

  //Get user on render
  useEffect(() => {
    const fetchUser = async () => {
      await fetchUserHandler.handleData(
        "https://localhost:7259/api/Users/user",
        "GET"
      );
    };
    fetchUser();
  }, []);

  //Get achievements on render
  useEffect(() => {
    const fetchAchievements = async () => {
      await fetchAchievementHandler.handleData(
        "https://localhost:7259/api/Achievement/GetAllAchievements",
        "GET"
      );
    };
    fetchAchievements();
  }, []);

  //Evaluate response from update username/email request
  useEffect(() => {
    if (updateUserInfoHandler.response.status === 200) {
      alert("Användarnamn/e-post har blivit uppdaterat.");
    }
  }, [updateUserInfoHandler.response]);

  //Evaluate response from update password request
  useEffect(() => {
    if (updatePasswordHandler.response.status === 200) {
      alert("Lösenordet har blivit uppdaterat.");
    }
  }, [updatePasswordHandler.response]);

  //Set userinformation after succesful fetch
  useEffect(() => {
    if (fetchUserHandler.data) {
      setUser(fetchUserHandler.data);
      setEmail(fetchUserHandler.data.email);
      setUserName(fetchUserHandler.data.userName);
    }
  }, [fetchUserHandler.data]);

  //Handle error that occurred during user fetch
  useEffect(() => {
    if (fetchUserHandler.error) {
      console.log("Error fetching user: ", fetchUserHandler.error);
    }
  }, [fetchUserHandler.error]);

  //Handle error that occurred during achievements fetch
  useEffect(() => {
    if (fetchAchievementHandler.error) {
      console.log(
        "Error fetching achievements: ",
        fetchAchievementHandler.error
      );
    }
  }, [fetchAchievementHandler.error]);

  //Handle error that occured during update password
  useEffect(() => {
    if (updatePasswordHandler.error) {
      console.error("Update password  failed:", updatePasswordHandler.error);
    }
  }, [updatePasswordHandler.error]);

  //Handle error that occured during username/email update
  useEffect(() => {
    if (updateUserInfoHandler.error) {
      console.error("Update username failed:", updateUserInfoHandler.error);
    }
  }, [updateUserInfoHandler.error]);

  useEffect(() => {
    if (user) {
      if (fetchAchievementHandler.data) {
        const userAchievementIds = user.achievements.map(
          (achievement) => achievement.achievementId
        );

        setUnearnedAchievements(
          fetchAchievementHandler.data.filter(
            (achievement) => !userAchievementIds.includes(achievement.id)
          )
        );
        console.log("Unearned: ", unearnedAchievements);
        setEarnedAchievements(
          fetchAchievementHandler.data.filter((achievement) =>
            userAchievementIds.includes(achievement.id)
          )
        );
      } else {
        console.log(
          "Error fetching achievements: ",
          fetchAchievementHandler.error
        );
        setUser(null);
      }
    }
  }, [fetchAchievementHandler.data, user]);

  const handleSubmitUpdateUser = async (e) => {
    e.preventDefault();
    if (user) {
      updateUserInfoHandler.handleData(
        "https://localhost:7259/api/Users/update-user",
        "PUT",
        { userId: user.userId, userName: userName, email: email }
      );
    } else {
      console.error("No user found when updating information");
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    const updatePasswordModel = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    updatePasswordHandler.handleData(
      "https://localhost:7259/api/Users/update-password",
      "PUT",
      updatePasswordModel
    );
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

  return (
    <>
      <div className="profile-page">
        <div className="col-1"></div>
        <div className="profile-content col-10">
          <div className="profile-content-left">
            <h1 className="mb-5">Profil utmärkelser</h1>
            <div className="achievements-section mt-5">
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
                  {earnedAchievements && unearnedAchievements
                    ? `Du har [${earnedAchievements.length}/${
                        earnedAchievements.length + unearnedAchievements.length
                      }] medaljer`
                    : "No achievements data available"}
                </span>
              </h2>

              <div className="achievements-box">
                <div className="achievements-earned">
                  <h3>Dina medaljer</h3>
                  <div className="achievements-grid">
                    {earnedAchievements
                      ? earnedAchievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="achievement-item"
                            onMouseEnter={(e) =>
                              handleMouseEnter(achievement.id, e)
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            <img
                              src={achievementImages[achievement.imageUrl]}
                              alt={achievement.name}
                              className="profile-achievement-image"
                            />
                            {visibleTooltip === achievement.id && (
                              <div
                                className="custom-tooltip"
                                style={{
                                  position: "fixed",
                                  top: tooltipPosition.top + 50,
                                  left: tooltipPosition.left + 25,
                                }}
                              >
                                {achievement.name}
                                <br />
                                {achievement.description}
                              </div>
                            )}
                          </div>
                        ))
                      : ""}
                  </div>
                </div>

                <div className="achievements-not-earned mt-4 mb-4">
                  <h3>Låsta Medaljer</h3>
                  <div className="achievements-grid">
                    {unearnedAchievements
                      ? unearnedAchievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="achievement-item"
                            onMouseEnter={(e) =>
                              handleMouseEnter(achievement.id, e)
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            <img
                              src={achievementImages[achievement.imageUrl]}
                              alt={achievement.name}
                              className="profile-achievement-image"
                            />
                            {visibleTooltip === achievement.id && (
                              <div
                                className="custom-tooltip"
                                style={{
                                  position: "fixed",
                                  top: tooltipPosition.top + 50,
                                  left: tooltipPosition.left + 25,
                                }}
                              >
                                {achievement.name}
                                <br />
                                {achievement.description}
                              </div>
                            )}
                          </div>
                        ))
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-content-right">
            <h1 className="mb-5">Profil detaljer</h1>

            <form onSubmit={handleSubmitUpdateUser}>
              <div className="justify-space-between">
                <label className="m-2 font-weight-bold">Användarnamn: </label>
                <input
                  type="username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Användarnamn"
                  required
                />
              </div>
              <div className="justify-space-between mt-2">
                <label className="m-2 font-weight-bold">E-post: </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-post"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-100 mt-2 btn btn-info font-weight-bold"
              >
                Ändra profil detaljer
              </button>
            </form>

            <form className="input-field-box"></form>

            <form onSubmit={handleSubmitNewPassword}>
              <div className="justify-space-between">
                <label className="m-2 font-weight-bold">
                  Nuvarande lösenord:{" "}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="justify-space-between mt-2">
                <label className="m-2 font-weight-bold">Nytt lösenord: </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="justify-space-between mt-2">
                <label className="m-2 font-weight-bold">
                  Bekräfta lösenord:{" "}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-100 mt-2 btn btn-info font-weight-bold"
              >
                Ändra lösenord
              </button>
            </form>
          </div>
        </div>
        <div className="col-1"></div>
      </div>
    </>
  );
}

export default Profile;
