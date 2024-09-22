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
  console.log(allResults);
  const updatedAchievements = [];

  // Check for each unachieved achievement
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
          // Check if the user has completed 5 games or more
          if (userResults.length >= 5) {
            unlocked = true;
          }
          break;

        case 3:
          // Check if the user has completed 20 games or more
          if (userResults.length >= 20) {
            unlocked = true;
          }
          break;

        case 4:
          // Check if the user has completed 100 games or more
          if (userResults.length >= 100) {
            unlocked = true;
          }
          break;

        case 5:
          userResults.forEach((result) => {
            // Convert the time string to seconds
            const timeParts = result.time.split(":");
            const totalSeconds =
              parseInt(timeParts[0], 10) * 3600 + // hours to seconds
              parseInt(timeParts[1], 10) * 60 + // minutes to seconds
              parseInt(timeParts[2], 10); // seconds

            // Check if the total time is less than 300 seconds (5 min)
            if (totalSeconds <= 300) {
              unlocked = true;
            }
          });
          break;

        case 6:
          userResults.forEach((result) => {
            // Convert the time string to seconds
            const timeParts = result.time.split(":");
            const totalSeconds =
              parseInt(timeParts[0], 10) * 3600 + // hours to seconds
              parseInt(timeParts[1], 10) * 60 + // minutes to seconds
              parseInt(timeParts[2], 10); // seconds

            // Check if the total time is less than 60 seconds
            if (totalSeconds <= 60) {
              unlocked = true;
            }
          });
          break;

        case 7:
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

        case 8:
          userResults.forEach((result) => {
            // Check if the user has completed a game of difficulty "Lätt"
            if (result.difficultyLevelName === "Lätt") {
              unlocked = true;
            }
          });
          break;

        case 9:
          userResults.forEach((result) => {
            // Check if the user has completed a game of difficulty "Medium"
            if (result.difficultyLevelName === "Medium") {
              unlocked = true;
            }
          });
          break;

        case 10:
          userResults.forEach((result) => {
            // Check if the user has completed a game of difficulty "Svår"
            if (result.difficultyLevelName === "Svår") {
              unlocked = true;
            }
          });
          break;

        // Add more cases here in the future with more achievements

        default:
          console.log(`No specific check for achievement: ${achievement.name}`);
      }
      if (unlocked) {
        updatedAchievements.push({
          achievementId: achievement.id,
          name: achievement.name,
          description: achievement.description,
          AchievementDate: new Date().toISOString().split("T")[0],
          imageUrl: achievement.imageUrl,
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
    `https://localhost:7259/api/Result/GetUserResultsForAllGames`,
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
