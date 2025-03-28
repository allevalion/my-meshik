let satietyLevel = loadSatietyLevel();
if (typeof loadAchievements === 'function') {
  loadAchievements();
}
updateSatietyDisplay(satietyLevel);
updateCatImage('happy');

let version = "1.0.0-beta"
console.log(`Текущая версия игры: ${version}`)
const feedBtn = document.getElementById('feedBtn');
const resetBtn = document.getElementById('resetBtn');
const shareBtn = document.getElementById('shareBtn');


const betaBtn = document.getElementById('betaBtn');
const betaNotice = document.querySelector('.beta-notice');
const betaBadge = document.querySelector('.beta-badge');
if ('ontouchstart' in window) {
  betaBadge.style.cursor = 'pointer';
  betaBadge.removeAttribute('title');

  betaBadge.addEventListener('click', function () {
    this.classList.toggle('active');
  });

  document.addEventListener('click', function (e) {
    if (!betaBadge.contains(e.target)) {
      betaBadge.classList.remove('active');
    }
  });
} else {
  betaBadge.setAttribute('title', 'Это бета-версия игры. Могут встречаться баги.');
}




let achievementUnlocked = { full: false };
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeHelpBtn = document.getElementById('closeHelpBtn');

helpBtn.addEventListener('click', () => {
  gsap.to(helpModal, {
    opacity: 1, duration: 0.3, onStart: () => {
      helpModal.classList.add('active');
    }
  });
});

closeHelpBtn.addEventListener('click', () => {
  gsap.to(helpModal, {
    opacity: 0, duration: 0.3, onComplete: () => {
      helpModal.classList.remove('active');
    }
  });
});

document.addEventListener('click', (e) => {
  if (helpModal.classList.contains('active')) {
    const isClickInside = helpModal.contains(e.target) || helpBtn.contains(e.target);
    if (!isClickInside) {
      gsap.to(helpModal, {
        opacity: 0, duration: 0.3, onComplete: () => {
          helpModal.classList.remove('active');
        }
      });
    }
  }
});

resetBtn.addEventListener('click', () => {
  satietyLevel = 100;
  updateSatietyDisplay(satietyLevel);
  resetSatietyLevel();
  updateCatImage('happy');
  localStorage.clear();
  location.reload();
});
shareBtn.addEventListener('click', async () => {
  const shareData = {
    title: 'Мой Мэшик - виртуальный питомец',
    text: 'Покорми кота Мэшика! Уровень сытости: ' + satietyLevel + '%',
    url: 'https://allevalion.github.io/my-meshik/'
  };
  
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      const shareLink = `https://allevalion.github.io/my-meshik/`;
      const input = document.createElement('input');
      input.value = shareLink;
      document.body.appendChild(input);
      input.select();
      
      try {
        const copied = document.execCommand('copy');
        document.body.removeChild(input);
        
        if (copied) {
          showToast('Ссылка скопирована в буфер обмена!');
        } else {
          prompt('Скопируйте ссылку:', shareLink);
        }
      } catch (err) {
        prompt('Скопируйте ссылку:', shareLink);
      }
    }
  } catch (err) {
    console.log('Ошибка при попытке поделиться:', err);
  }
});

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  gsap.to(toast, {
    y: -20,
    opacity: 1,
    duration: 0.3,
    delay: 0.1
  });
  
  setTimeout(() => {
    gsap.to(toast, {
      y: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => toast.remove()
    });
  }, 3000);
}
document.addEventListener('DOMContentLoaded', () => {

  updateCoinDisplay();

  const huntBtn = document.getElementById('huntGameBtn');
  const sortBtn = document.getElementById('sortGameBtn');

  huntBtn.addEventListener('click', () => {
    window.open('mini-games/mouse-hunt/index.html', '_blank');
  });

  sortBtn.addEventListener('click', () => {
    window.open('mini-games/fish-sorting/index.html', '_blank');
  });
});
const hamburgerIcon = document.getElementById('burger');
const achievementsMenu = document.getElementById('achievementsMenu');
let menuActive = false;

hamburgerIcon.addEventListener('click', () => {
  if (!menuActive) {
    achievementsMenu.classList.add('active');
    gsap.to(achievementsMenu, { x: '0%', opacity: 1, duration: 0.5, ease: "power2.out" });
  } else {
    gsap.to(achievementsMenu, {
      x: '-100%', opacity: 0, duration: 0.5, ease: "power2.in", onComplete: () => {
        achievementsMenu.classList.remove('active');
      }
    });
  }
  menuActive = !menuActive;
});


setInterval(() => {
  if (satietyLevel > 0) {
    satietyLevel -= 1;
    updateSatietyDisplay(satietyLevel);
    saveSatietyLevel(satietyLevel);
    if (satietyLevel < 30) {
      updateCatImage('sad');
      playSadAnimation();
    } else {
      updateCatImage('happy');
    }
  }
}, 5000);


// function checkForAchievements() {
//     if (satietyLevel === 100 && !achievementUnlocked.full) {
//         achievementUnlocked.full = true;
//         addAchievement('../assets/images/achievements/full-cat.gif', 'Полный Мэш!', 'Уровень сытости достиг 100%');
//     }
// }