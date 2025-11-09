const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let isJumping = false;

const enemies = [
  { el: document.getElementById('enemy1'), type: 'good' },
  { el: document.getElementById('enemy2'), type: 'good' },
  { el: document.getElementById('enemy3'), type: 'good' },
  { el: document.getElementById('enemy4'), type: 'good' },
  { el: document.getElementById('enemy5'), type: 'bad' },
  { el: document.getElementById('enemy6'), type: 'bad' },
  { el: document.getElementById('enemy7'), type: 'bad' },
  { el: document.getElementById('enemy8'), type: 'bad' },
];

const screenWidth = window.innerWidth;
const startBase = -150;
const gap = 350;

// תנועה של כוכבים
enemies.forEach(({ el }, index) => {
  let pos = startBase - gap * index;
  const speed = Math.random() * 2 + 4;

  function move() {
    pos += speed;
    if (pos > screenWidth + el.offsetWidth) {
      pos = startBase - gap * index;
      el.scored = false;
    }
    el.style.right = pos + 'px';
    requestAnimationFrame(move);
  }

  move();
});

// קפיצה עם רווח
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    jump();
  }
});

function jump() {
  if (isJumping) return;
  isJumping = true;
  player.classList.add('jump');
  new Audio('jump1.wav').play();

  setTimeout(() => {
    player.classList.remove('jump');
    isJumping = false;
  }, 900);
}

// בדיקת חפיפה
function elementsOverlap(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();

  return !(
    r1.top > r2.bottom ||
    r1.bottom < r2.top ||
    r1.right < r2.left ||
    r1.left > r2.right
  );
}

// סיום המשחק
function showGameOver() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }

  document.getElementById("final-score").innerHTML = `
    Your final score is: ${score}<br>
    <strong>Your best score is:</strong> ${bestScore}
  `;
  document.getElementById("game-over-screen").style.display = "flex";
}

function restartGame() {
  location.reload();
}

// זיהוי התנגשות או ניקוד
setInterval(() => {
  enemies.forEach(({ el, type }) => {
    if (elementsOverlap(player, el)) {
      if (!el.scored) {
        el.scored = true;

        if (type === 'bad') {
          showGameOver();
        } else {
          score++;
          scoreElement.textContent = `Score: ${score}`;
        }
      }
    } else {
      el.scored = false;
    }
  });
}, 100);