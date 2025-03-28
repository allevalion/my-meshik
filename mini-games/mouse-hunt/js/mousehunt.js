let score = 0;
let timeLeft = 60;
let gameActive = false;
let gameInterval, spawnInterval;
let comboCount = 0;
let lastCatchTime = 0;

const startMenu = document.getElementById('start-menu');
const endMenu = document.getElementById('end-menu');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const gameArea = document.getElementById('game-area');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const finalScoreElement = document.getElementById('final-score');
const endMessageElement = document.getElementById('end-message');

const COINS_KEY = 'meshikCoins';

function addCoins(amount) {
  let coins = localStorage.getItem(COINS_KEY);
  coins = coins ? parseInt(coins) : 0;
  coins = Math.min(coins + amount, 2000); // Ограничение на максимальное кол-во монет
  localStorage.setItem(COINS_KEY, coins);
  return coins;
}

const mouseTypes = [
    {
        type: 'normal',
        value: 5,
        speed: 4000,
        className: 'normal'
    },
    {
        type: 'fast',
        value: 10,
        speed: 2500,
        className: 'fast'
    },
    {
        type: 'cunning',
        value: 15,
        speed: 4500,
        className: 'cunning'
    },
    {
        type: 'golden',
        value: 50,
        speed: 2000,
        className: 'golden',
        rare: true
    },
    {
        type: 'bandit',
        value: -10,
        speed: 3000,
        className: 'bandit'
    }
];

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
    endMenu.classList.add('hidden');
    startGame();
});

function startGame() {
    startMenu.classList.add('hidden');
    score = 0;
    timeLeft = 60;
    comboCount = 0;
    gameActive = true;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    gameArea.innerHTML = '';

    gameInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
        if (score < 0) {
            endGame();
        }
    }, 1000);

    spawnInterval = setInterval(spawnMouse, 800);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    gameActive = false;
    document.querySelectorAll('.mouse').forEach(el => el.remove());
    
    const coinsEarned = Math.max(0, score);
    addCoins(coinsEarned);
    
    finalScoreElement.textContent = "Ваш счёт: " + score;
    
    // Установка сообщения в зависимости от счета
    if (score < 0) {
        endMessageElement.textContent = "Вы проиграли!";
    } else if (score < 50) {
        endMessageElement.textContent = "Неплохо, но можно лучше!";
    } else {
        endMessageElement.textContent = "Отличная игра!";
    }
    
    // Удаление старого сообщения о монетах, если оно есть
    const oldCoinsMessage = document.querySelector('#coins-message');
    if (oldCoinsMessage) oldCoinsMessage.remove();
    
    // Добавление информации о заработанных монетах
    const coinsMessage = document.createElement('p');
    coinsMessage.id = 'coins-message';
    coinsMessage.textContent = `Заработано монет: ${coinsEarned}`;
    coinsMessage.style.color = 'gold';
    coinsMessage.style.fontWeight = 'bold';
    coinsMessage.style.marginTop = '10px';
    endMessageElement.insertAdjacentElement('afterend', coinsMessage);
    
    endMenu.classList.remove('hidden');
}

function spawnMouse() {
    let availableTypes = mouseTypes.filter(type => !type.rare || Math.random() < 0.1);
    if (availableTypes.length === 0) {
        availableTypes = mouseTypes.filter(type => !type.rare);
    }
    const mouseType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    const mouseEl = document.createElement('div');
    mouseEl.classList.add('mouse', mouseType.className);

    const gameAreaHeight = gameArea.clientHeight;
    const maxTop = gameAreaHeight - 50;
    const topPosition = Math.random() * maxTop;
    mouseEl.style.top = topPosition + 'px';
    mouseEl.style.left = '-60px';

    const rotation = Math.floor(Math.random() * 31 - 15);
    mouseEl.style.setProperty('--rotation', rotation + 'deg');

    if (mouseType.type === 'cunning') {
        mouseEl.style.animationName = 'runCunning';
    } else {
        mouseEl.style.animationName = 'run';
    }
    mouseEl.style.animationDuration = mouseType.speed + 'ms';

    mouseEl.addEventListener('animationend', () => {
        if (gameArea.contains(mouseEl)) {
            mouseEl.remove();
        }
    });

    mouseEl.addEventListener('click', function catchMouse(e) {
        e.stopPropagation();
        const now = Date.now();
        if (now - lastCatchTime < 1000) {
            comboCount++;
        } else {
            comboCount = 0;
        }
        lastCatchTime = now;
        const bonus = comboCount > 0 ? comboCount * 2 : 0;
        score += mouseType.value + bonus;
        scoreElement.textContent = score;
        mouseEl.style.transition = 'transform 0.2s ease';
        mouseEl.style.transform = 'scale(0)';
        setTimeout(() => {
            mouseEl.remove();
        }, 200);
    });

    gameArea.appendChild(mouseEl);
}