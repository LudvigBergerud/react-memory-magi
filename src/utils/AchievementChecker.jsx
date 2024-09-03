export const hasAchievement = (playerAchievements, achievement) => {
  return playerAchievements.includes(achievement);
};

export const checkResultAchievements = async (user) => {
  // Fetch all achievements
  const allAchievements = await fetchAllAchievements();

  // Get the names of the user's achievements
  const userAchievementNames = user.userAchievements.map(
    (achievement) => achievement.name
  );

  // Filter out achievements the user doesn't have
  const unachievedAchievements = allAchievements.filter(
    (achievement) => !userAchievementNames.includes(achievement.name)
  );

  // Now check for each unachieved achievement manually
  unachievedAchievements.forEach((achievement) => {
    switch (achievement.name) {
      case "First Win":
        // Example check: if the user has at least one win
        if (user.stats.wins >= 1) {
          user.userAchievements.push(achievement);
          //SET ALERT
        }
        break;

      case "Speed Runner":
        // Example check: if the user has completed a game under 5 minutes
        if (user.stats.fastestTime <= 300) {
          // 300 seconds = 5 minutes
          user.userAchievements.push(achievement);
          //SET ALERT
        }
        break;

      // Add more cases here for other achievements
      default:
        console.log(`No specific check for achievement: ${achievement.name}`);
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

const updateUserAchievements = async () => {
  const updatedUser = await checkResultAchievements(currentUser);

  // Now you can update the user's achievements in your app's state or backend
  console.log("Updated user achievements:", updatedUser);
};
