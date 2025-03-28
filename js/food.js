const foodEffects = {
    fish: 15,
    milk: 10,
    treat: 20
};
const foodPrices = {
    fish: 50,
    milk: 30,
    treat: 70
};


// satietyLevel при загрузке
document.addEventListener('DOMContentLoaded', () => {
    satietyLevel = loadSatietyLevel();
    
    // Инициализация цен на еду
    document.querySelector('[data-food="fish"]').innerHTML = `
        <img src="assets/images/food-fish.png" alt="Рыба">
        <span class="food-price">${foodPrices.fish}<span class="coin-icon"></span></span>
    `;
    document.querySelector('[data-food="milk"]').innerHTML = `
        <img src="assets/images/food-milk.png" alt="Молоко">
        <span class="food-price">${foodPrices.milk}<span class="coin-icon"></span></span>
    `;
    document.querySelector('[data-food="treat"]').innerHTML = `
        <img src="assets/images/food-treat.png" alt="Лакомство">
        <span class="food-price">${foodPrices.treat}<span class="coin-icon"></span></span>
    `;
    
    // отображение монет
    updateCoinDisplay();
});

const foodButtons = document.querySelectorAll('.food-btn');
foodButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const foodType = this.getAttribute('data-food');
        const price = foodPrices[foodType];
        const coins = getCoins();
        
        if (coins >= price) {
            setCoins(coins - price);
            const boost = foodEffects[foodType] || 10;
            feedCatWithFood(boost);
        } else {
            alert('Недостаточно монет для покупки этой еды!');
        }
    });
});

function feedCatWithFood(boost) {
    satietyLevel = Math.min(satietyLevel + boost, 100);
    updateSatietyDisplay(satietyLevel);
    saveSatietyLevel(satietyLevel);
    updateCatImage('happy');
    playFeedAnimation();
}

function getCoins() {
    let coins = localStorage.getItem('meshikCoins');
    return coins ? parseInt(coins) : 2000;
}

function setCoins(value) {
    localStorage.setItem('meshikCoins', value);
    updateCoinDisplay();
}

function updateCoinDisplay() {
    const coinDisplay = document.getElementById('coinCount');
    const headerCoinDisplay = document.getElementById('headerCoinCount');
    const coins = getCoins();
    
    if (coinDisplay) coinDisplay.textContent = coins;
    if (headerCoinDisplay) headerCoinDisplay.textContent = coins;
}