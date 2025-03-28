const ACHIEVEMENTS_KEY = 'meshikAchievements';
function addAchievement(image, title, description) {
    let achievements = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY)) || [];
    if (!achievements.find(a => a.title === title)) {
        achievements.push({ image, title, description });
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
        const card = showAchievementCard(image, title, description);
        animateAchievementCard(card, function() {
            card.remove();
            addAchievementToMenu(image, title, description);
        });
    }
}
function loadAchievements() {
    let achievements = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY)) || [];
    achievements.forEach(achievement => {
        addAchievementToMenu(achievement.image, achievement.title, achievement.description);
    });
}