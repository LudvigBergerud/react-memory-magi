export const hasAchievement = (playerAchievements, achievement) => {
  return playerAchievements.includes(achievement);
};

export const checkResultAchievements = async (user, resultId) => {
  const allAchievements = await fetchAllAchievements();

  const userAchievementIds = user.achievements.map(
    (achievement) => achievement.id
  );

  const allResults = await fetchAllResults(resultId);
  const userResults = allResults.filter(
    (result) => result.userId === user.userId
  );

  const updatedAchievements = [];

  // Now check for each unachieved achievement manually
  allAchievements.forEach((achievement) => {
    if (!userAchievementIds.includes(achievement.id)) {
      let unlocked = false;

      switch (achievement.name) {
        case "Klarat första spelet!":
          // Check if the user has completed their first game
          if (userResults.length >= 1) {
            user.achievements.push(achievement);
          }
          break;

        case "Du har klarat andra spelet!":
          // Check if the user has completed their second game
          if (userResults.length >= 2) {
            user.achievements.push(achievement);
          }
          break;

        case "Fler än 10 spel klara!":
          // Check if the user has completed more than 10 games
          if (userResults.length > 10) {
            user.achievements.push(achievement);
          }
          break;

        case 'Du klarade den första "lätt" nivån!':
          // Check if the user has completed the first 'easy' level

          break;

        case "Första vinsten!":
          // Check if the user has won their first game

          break;

        case "Mästarens start!":
          // Check if the user has taken first steps toward mastery, e.g., reaching a certain skill level or winning a series of games

          break;

        case 'Du klarade den "medel" nivån!':
          // Check if the user has completed the 'medium' level

          break;

        case "Första perfekta poäng!":
          // Check if the user has achieved a perfect score in a game

          break;

        case "Snabbaste tiden!":
          // Check if the user has achieved a time lower than 30 seconds
          userResults.forEach((result) => {
            // Convert the time string to seconds
            const timeParts = result.time.split(":");
            const totalSeconds =
              parseInt(timeParts[0], 10) * 3600 + // hours to seconds
              parseInt(timeParts[1], 10) * 60 + // minutes to seconds
              parseInt(timeParts[2], 10); // seconds

            // Check if the total time is less than 30 seconds
            if (totalSeconds <= 30) {
              user.achievements.push(achievement);
            }
          });
          break;

        case "Avklarat hela spelet!":
          // Check if the user has completed the entire game

          break;

        // Add more cases here in the future with more achievements

        default:
          console.log(`No specific check for achievement: ${achievement.name}`);
      }
    }
  });

  // Return the updated user object with new achievements
  return user;
};

export const fetchAllAchievements = async () => {
  // Retrieve the stored token object from localStorage
  const tokenObjectString = localStorage.getItem("accessToken");
  const tokenObject = tokenObjectString ? JSON.parse(tokenObjectString) : null;

  // Access the actual string token from the object
  const accessToken = tokenObject?.accessToken;

  const response = await fetch(
    "https://localhost:7259/api/Achievement/GetAllAchievements",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.ok) {
    return await response.json();
  } else {
    console.error("Failed to fetch achievements");
    return [];
  }
};

export const fetchAllResults = async (gameId) => {
  // Retrieve the stored token object from localStorage
  const tokenObjectString = localStorage.getItem("accessToken");
  const tokenObject = tokenObjectString ? JSON.parse(tokenObjectString) : null;

  // Access the actual string token from the object
  const accessToken = tokenObject?.accessToken;

  const response = await fetch(
    `https://localhost:7259/api/Result/GetAllResultsWithIncludedData?currentResultId=${gameId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.ok) {
    return await response.json();
  } else {
    console.error("Failed to fetch results");
    return [];
  }
};

export const updateUserAchievements = async (currentUser, resultId) => {
  const updatedUser = await checkResultAchievements(currentUser, resultId);

  // Now you can update the user's achievements in your app's state or backend
  console.log("Updated user achievements:", updatedUser);
  return updatedUser;
};
