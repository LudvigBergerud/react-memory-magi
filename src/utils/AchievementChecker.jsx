export const hasAchievement = (playerAchievements, achievement) => {
  return playerAchievements.includes(achievement);
};

export const checkResultAchievements = async (user, result) => {
  const allAchievements = await fetchAllAchievements();
  const userAchievementIds = user.achievements.map(
    (achievement) => achievement.achievementId
  );

  const allResults = await fetchAllResults(result);
  const userResults = allResults.filter(
    (result) => result.userId === user.userId
  );

  const updatedAchievements = [];

  // Now check for each unachieved achievement manually
  allAchievements.forEach((achievement) => {
    if (!userAchievementIds.includes(achievement.id)) {
      let unlocked = false;

      switch (achievement.id) {
        case 1:
          // Check if the user has completed their first game
          if (userResults.length >= 1) {
            unlocked = true;
          }
          break;

        case 2:
          // Check if the user has completed their second game
          if (userResults.length >= 2) {
            unlocked = true;
          }
          break;

        case 3:
          // Check if the user has completed more than 10 games
          if (userResults.length > 10) {
            unlocked = true;
          }
          break;

        case 4:
          // Check if the user has completed the first 'easy' level

          break;

        case 5:
          // Check if the user has won their first game

          break;

        case 6:
          // Check if the user has taken first steps toward mastery, e.g., reaching a certain skill level or winning a series of games

          break;

        case 7:
          // Check if the user has completed the 'medium' level

          break;

        case 8:
          // Check if the user has achieved a perfect score in a game

          break;

        case 9:
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
              unlocked = true;
            }
          });
          break;

        case 10:
          // Check if the user has completed the entire game

          break;

        // Add more cases here in the future with more achievements

        default:
          console.log(`No specific check for achievement: ${achievement.name}`);
      }
      if (unlocked) {
        updatedAchievements.push({
          achievementId: achievement.id,
          name: achievement.name,
          AchievementDate: new Date().toISOString().split("T")[0],
        });
      }
    }
  });

  if (updatedAchievements.length > 0) {
    try {
      // Call the API to update the user's achievements
      const tokenObjectString = localStorage.getItem("accessToken");
      const tokenObject = tokenObjectString
        ? JSON.parse(tokenObjectString)
        : null;

      // Access the actual string token from the object...
      const accessToken = tokenObject?.accessToken;

      const response = await fetch(
        "https://localhost:7259/api/Users/update-achievements",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedAchievements),
        }
      );

      if (response.ok) {
        console.log("Updated achievements correctly");
      } else {
        console.error("Failed to update achievements.");
      }
    } catch (error) {
      console.error("Error updating achievements:", error);
    }
  }
  return updatedAchievements;
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

export const fetchAllResults = async (result) => {
  // Retrieve the stored token object from localStorage
  const tokenObjectString = localStorage.getItem("accessToken");
  const tokenObject = tokenObjectString ? JSON.parse(tokenObjectString) : null;

  // Access the actual string token from the object
  const accessToken = tokenObject?.accessToken;

  const response = await fetch(
    `https://localhost:7259/api/Result/GetAllResults`,
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

export const updateUserAchievements = async (currentUser, result) => {
  const updatedAchievements = await checkResultAchievements(
    currentUser,
    result
  );
  return updatedAchievements;
};
