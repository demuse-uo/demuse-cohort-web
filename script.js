/* =======================================================
   KONFIGURASI — ganti bagian ini sesuai kebutuhanmu
   ======================================================= */
const MEMORIES = [
  { src: 'assets/1.jpg', caption: '💕' },
  { src: 'assets/2.jpg', caption: '💕' },
  { src: 'assets/3.jpg', caption: '💕' },
];

const LETTER_TEXT =
  `Happy Birthday Ester! ✨\n\n` +
  `Dari savana keemasan hingga laut sebiru langit Nusa Tenggara Timur, ` +
  `semoga umur baru ini membawa warna yang sama hangat dan segarnya untukmu.`;

const CONFETTI_COLORS = ['#E2703A', '#CDA23E', '#1B8A82', '#0B4F52', '#F7F0DD'];

/* ======================================================= */

const screens = document.querySelectorAll('.screen');
function goTo(id) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  stopMemoriesAutoplay();
  stopFinalConfetti();
  if (id === 'memories') startMemoriesAutoplay();
  if (id === 'final') startFinalConfetti();
}

/* ---------- 1. LOADING ---------- */
(function loadingScreen() {
  const percentEl = document.getElementById('loaderPercent');
  let value = 0;
  const timer = setInterval(() => {
    value += Math.floor(Math.random() * 12) + 6;
    if (value >= 100) {
      value = 100;
      clearInterval(timer);
      setTimeout(() => goTo('wish'), 400);
    }
    percentEl.textContent = value;
  }, 160);
})();

/* ---------- 2. BUAT PERMOHONAN ---------- */
const cakeButton = document.getElementById('cakeButton');
const wishHeadline = document.getElementById('wishHeadline');
const wishHint = document.getElementById('wishHint');
const btnAfterWish = document.getElementById('btnAfterWish');

cakeButton.addEventListener('click', () => {
  if (cakeButton.classList.contains('is-blown')) return;
  cakeButton.classList.add('is-blown');
  wishHeadline.innerHTML = 'Horeee, <span class="nama">Ester</span>! 🎉';
  wishHint.textContent = 'Permohonanmu sudah terkirim ke langit ke-7 😁';
  burstConfetti(cakeButton);
  setTimeout(() => btnAfterWish.classList.remove('is-hidden'), 600);
});

btnAfterWish.addEventListener('click', () => goTo('memories'));

/* ---------- 3. KENANGAN MANIS ---------- */
const memoryImg = document.getElementById('memoryImg');
const memoryCaption = document.getElementById('memoryCaption');
const memoryDots = document.getElementById('memoryDots').children;
const polaroid = document.getElementById('polaroid');
let memoryIndex = 0;
let memoryTimer = null;

function renderMemory() {
  const item = MEMORIES[memoryIndex];
  memoryImg.src = item.src;
  memoryCaption.textContent = item.caption;
  Array.from(memoryDots).forEach((dot, i) =>
    dot.classList.toggle('is-active', i === memoryIndex)
  );
}

function nextMemory() {
  memoryIndex = (memoryIndex + 1) % MEMORIES.length;
  renderMemory();
}

function startMemoriesAutoplay() {
  renderMemory();
  memoryTimer = setInterval(nextMemory, 3000);
}
function stopMemoriesAutoplay() {
  clearInterval(memoryTimer);
}

polaroid.addEventListener('click', () => {
  stopMemoriesAutoplay();
  nextMemory();
  startMemoriesAutoplay();
});

document.getElementById('btnToLetter').addEventListener('click', () => {
  goTo('letter');
  startTypewriter();
});

/* ---------- 4. SURAT ---------- */
const letterBody = document.getElementById('letterBody');
const btnToFinal = document.getElementById('btnToFinal');
let typeTimer = null;

function startTypewriter() {
  letterBody.textContent = '';
  btnToFinal.classList.add('is-hidden');
  clearInterval(typeTimer);

  let i = 0;
  typeTimer = setInterval(() => {
    letterBody.textContent = LETTER_TEXT.slice(0, i);
    i++;
    if (i > LETTER_TEXT.length) {
      clearInterval(typeTimer);
      btnToFinal.classList.remove('is-hidden');
    }
  }, 22);
}

document.getElementById('skipTyping').addEventListener('click', () => {
  clearInterval(typeTimer);
  letterBody.textContent = LETTER_TEXT;
  btnToFinal.classList.remove('is-hidden');
});

btnToFinal.addEventListener('click', () => goTo('final'));

/* ---------- 5. PENUTUP — confetti ambient ---------- */
const confettiFinalField = document.getElementById('confettiFinal');
let finalConfettiTimer = null;

function startFinalConfetti() {
  finalConfettiTimer = setInterval(() => spawnFloatingConfetti(confettiFinalField), 450);
}
function stopFinalConfetti() {
  clearInterval(finalConfettiTimer);
}

/* ---------- CONFETTI HELPERS ---------- */
function burstConfetti(originEl) {
  const container = document.getElementById('confettiBurst');
  const rect = originEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < 26; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece burst';
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 140;
    piece.style.left = originX + 'px';
    piece.style.top = originY + 'px';
    piece.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
    piece.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
    piece.style.setProperty('--rot', Math.floor(Math.random() * 360) + 'deg');
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

function spawnFloatingConfetti(container) {
  const piece = document.createElement('span');
  piece.className = 'confetti-piece float';
  piece.style.left = Math.random() * 100 + '%';
  piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
  piece.style.animationDuration = 3 + Math.random() * 2 + 's';
  container.appendChild(piece);
  piece.addEventListener('animationend', () => piece.remove());
}

/* ---------- MUSIK ---------- */
const bgm = document.getElementById('bgm');
const soundToggle = document.getElementById('soundToggle');
let isPlaying = false;

soundToggle.addEventListener('click', () => {
  if (isPlaying) {
    bgm.pause();
    soundToggle.textContent = '🔇';
  } else {
    bgm.play().catch(() => {});
    soundToggle.textContent = '🔈';
  }
  isPlaying = !isPlaying;
});
