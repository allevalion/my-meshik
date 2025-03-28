// Постоянные переменные
document.addEventListener("DOMContentLoaded", () => {
  const startMenu = document.getElementById("start-menu");
  const endMenu = document.getElementById("end-menu");
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const timerDisplay = document.getElementById("timer");
  const scoreDisplay = document.getElementById("score");
  const finalScoreDisplay = document.getElementById("final-score");
  const endMessageDisplay = document.getElementById("end-message");
  const gameArea = document.getElementById("game-area");
  const bowlEdible = document.getElementById("bowl-edible");
  const bowlNonedible = document.getElementById("bowl-nonedible");

  let score = 0;
  let timeLeft = 60;
  let combo = 0;
  let gameActive = false;
  let fishCounter = 0;
  let fishTimeout;

  const COINS_KEY = 'meshikCoins';

  function addCoins(amount) {
    let coins = localStorage.getItem(COINS_KEY);
    coins = coins ? parseInt(coins) : 0;
    coins = Math.min(coins + amount, 2000); // Ограничение на максимальное кол-во монет
    localStorage.setItem(COINS_KEY, coins);
    return coins;
  }

  // Виды рыбок
  const fishTypes = [
    {
      type: 'edible',
      score: 5,
      img: 'assets/fish.png',
      correctBowl: 'edible'
    },
    {
      type: 'decorative',
      score: -5,
      img: 'assets/decorative.png',
      correctBowl: 'nonedible'
    },
    {
      type: 'big',
      score: -10,
      img: 'assets/fugu.png',
      correctBowl: 'nonedible'
    },
    {
      type: 'bonus',
      score: 30,
      img: 'assets/bonus.png',
      correctBowl: 'edible'
    },
    {
      type: 'trap',
      score: -15,
      img: 'assets/trap.png',
      correctBowl: 'nonedible',
      timePenalty: 5
    }
  ];

  // Обработчики для старта и рестарта игры
  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", restartGame);

  // Обработка кликов/тапов по мискам (контейнерам)
  bowlEdible.addEventListener("click", () => {
    if (!gameActive) return;
    const fishElem = document.querySelector(".fish");
    if (fishElem) {
      handleFishDrop(fishElem, "edible");
    }
  });
  bowlNonedible.addEventListener("click", () => {
    if (!gameActive) return;
    const fishElem = document.querySelector(".fish");
    if (fishElem) {
      handleFishDrop(fishElem, "nonedible");
    }
  });

  // Обработка клавиатурного управления: 1 для съедобной, 2 для несъедобной миски
  document.addEventListener("keydown", (e) => {
    if (!gameActive) return;
    const fishElem = document.querySelector(".fish");
    if (!fishElem) return;
    if (e.key === "1") {
      handleFishDrop(fishElem, "edible");
    } else if (e.key === "2") {
      handleFishDrop(fishElem, "nonedible");
    }
  });

  if ("ontouchstart" in window) {
    let touchStartX = null;
    let touchStartY = null;
    const swipeThreshold = 50;
    gameArea.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    });
    gameArea.addEventListener("touchend", (e) => {
      if (touchStartX === null || touchStartY === null) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      if (Math.abs(dx) > swipeThreshold) {
        const fishElem = document.querySelector(".fish");
        if (!fishElem) return;
        if (dx < 0) {
          handleFishDrop(fishElem, "edible");
        } else {
          handleFishDrop(fishElem, "nonedible");
        }
      }
      touchStartX = null;
      touchStartY = null;
    });
  }

  function showFeedback(isCorrect) {
    const overlay = document.createElement("div");
    overlay.classList.add("feedback-overlay");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "999";
    overlay.style.backgroundColor = isCorrect ? "rgba(0,255,0,0.3)" : "rgba(255,0,0,0.3)";
    gameArea.appendChild(overlay);
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }

  function startGame() {
    // Сброс состояния игры
    score = 0;
    timeLeft = 60;
    combo = 0;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    startMenu.classList.add("hidden");
    endMenu.classList.add("hidden");
    gameActive = true;

    // Запуск таймера
    const timerInterval = setInterval(() => {
      if (!gameActive) {
        clearInterval(timerInterval);
        return;
      }
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        gameActive = false;
        endGame();
      }
    }, 1000);

    // Появление первой рыбки
    spawnFish();
  }

  function endGame() {
    gameActive = false;
    document.querySelectorAll(".fish").forEach(fish => fish.remove());
    clearTimeout(fishTimeout);

    const coinsEarned = Math.max(0, score);
    addCoins(coinsEarned);

    finalScoreDisplay.textContent = "Ваш счёт: " + score;
    if (score < 0) {
      endMessageDisplay.textContent = "Вы проиграли!";
    } else if (score < 50) {
      endMessageDisplay.textContent = "Неплохо, но можно лучше!";
    } else {
      endMessageDisplay.textContent = "Отличная игра!";
    }

    // Удаление старого сообщения о монетах, если оно есть
    const oldCoinsMessage = document.querySelector('#coins-message');
    if (oldCoinsMessage) oldCoinsMessage.remove();

    // Информация о заработанных монетах
    const coinsMessage = document.createElement('p');
    coinsMessage.id = 'coins-message';
    coinsMessage.textContent = `Заработано монет: ${Math.max(0, score)}`;
    coinsMessage.style.color = 'gold';
    coinsMessage.style.fontWeight = 'bold';
    coinsMessage.style.marginTop = '10px';
    endMessageDisplay.insertAdjacentElement('afterend', coinsMessage);

    endMenu.classList.remove("hidden");
  }

  function restartGame() {
    endMenu.classList.add("hidden");
    startGame();
  }

  function spawnFish() {
    // Если игра не активна или уже есть рыбка – выход
    if (!gameActive || document.querySelector(".fish")) return;

    const fishData = fishTypes[Math.floor(Math.random() * fishTypes.length)];
    const fishElem = document.createElement("div");
    fishElem.classList.add("fish");
    fishElem.id = "fish-" + fishCounter++;
    fishElem.dataset.fishType = fishData.type;
    fishElem.dataset.correctBowl = fishData.correctBowl;
    fishElem.dataset.scoreValue = fishData.score;
    if (fishData.timePenalty) {
      fishElem.dataset.timePenalty = fishData.timePenalty;
    }
    fishElem.style.backgroundImage = `url(${fishData.img})`;

    const fishWidth = window.innerWidth < 600 ? 75 : 150;
    const fishHeight = window.innerWidth < 600 ? 75 : 150;

    const centerX = (gameArea.clientWidth - fishWidth) / 2;
    const centerY = (gameArea.clientHeight - fishHeight) / 2;
    fishElem.style.width = fishWidth + "px";
    fishElem.style.height = fishHeight + "px";
    fishElem.style.left = centerX + "px";
    fishElem.style.top = centerY + "px";

    gameArea.appendChild(fishElem);

    fishTimeout = setTimeout(() => {
      if (fishElem.parentElement) {
        fishElem.remove();
        combo = 0;
        if (gameActive) spawnFish();
      }
    }, 5000);
  }

  function handleFishDrop(fishElem, bowlType) {
    const fishType = fishElem.dataset.fishType;
    const correctBowl = fishElem.dataset.correctBowl;
    let fishScore = parseInt(fishElem.dataset.scoreValue, 10);

    if (fishType === 'trap') {
      if (bowlType === "edible") {
        score += fishScore;
        timeLeft = Math.max(0, timeLeft - parseInt(fishElem.dataset.timePenalty, 10));
        timerDisplay.textContent = timeLeft;
      }
    } else if (fishType === 'edible' || fishType === 'bonus') {
      if (bowlType === correctBowl) {
        combo++;
        let bonus = combo > 1 ? combo : 0;
        score += fishScore + bonus;
      } else {
        combo = 0;
      }
    } else if (fishType === 'decorative' || fishType === 'big') {
      if (bowlType === "edible") {
        combo = 0;
        score += fishScore;
      }
    }

    showFeedback(bowlType === correctBowl);

    scoreDisplay.textContent = score;
    clearTimeout(fishElem.timeoutId);
    fishElem.remove();
    if (score < 0) {
      endGame();
    } else if (gameActive) {
      spawnFish();
    }
  }
});