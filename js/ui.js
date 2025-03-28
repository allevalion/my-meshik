function updateSatietyDisplay(level) {
    document.getElementById('satietyGauge').style.width = level + '%';
}
function updateCatImage(state) {
    const catImage = document.getElementById('catImage');
    switch(state) {
        case 'happy':
            catImage.src = 'assets/images/meshik-happy.png';
            break;
        case 'sad':
            catImage.src = 'assets/images/meshik-sad.gif';
            break;
        case 'angry':
            catImage.src = 'assets/images/meshik-angry.png';
            break;
        default:
            catImage.src = 'assets/images/meshik-happy.png';
    }
}
function showAchievementCard(image, title, description, onFinish) {
    const container = document.getElementById('achievementCardContainer');
    const card = document.createElement('div');
    card.className = 'achievement-card';
    const img = document.createElement('img');
    img.src = image;
    const content = document.createElement('div');
    const h4 = document.createElement('h4');
    h4.textContent = title;
    const p = document.createElement('p');
    p.textContent = description;
    content.appendChild(h4);
    content.appendChild(p);
    card.appendChild(img);
    card.appendChild(content);
    container.appendChild(card);
    return card;
}
function addAchievementToMenu(image, title, description) {
    const list = document.getElementById('achievementsList');
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = image;
    const info = document.createElement('div');
    const h4 = document.createElement('h4');
    h4.textContent = title;
    const p = document.createElement('p');
    p.textContent = description;
    info.appendChild(h4);
    info.appendChild(p);
    li.appendChild(img);
    li.appendChild(info);
    list.appendChild(li);
}
