const inviteScreen = document.getElementById("inviteScreen");
const thanksScreen = document.getElementById("thanksScreen");
const acceptBtn = document.getElementById("acceptBtn");
const declineBtn = document.getElementById("declineBtn");
const declineModal = document.getElementById("declineModal");
const declineClose = document.getElementById("declineClose");
const song = document.getElementById("song");
const tick = document.getElementById("tick");
const petals = document.getElementById("petals");

const weddingDate = new Date("2026-09-10T11:30:00").getTime();

const SONG_START_SECOND = 0;
const SONG_PLAY_SECONDS = 20;

let isSongPlaying = false;
let hasStartedTick = false;

function updateCountdown() {
  const distance = weddingDate - Date.now();

  const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((distance / (1000 * 60 * 60)) % 24));
  const mins = Math.max(0, Math.floor((distance / (1000 * 60)) % 60));
  const secs = Math.max(0, Math.floor((distance / 1000) % 60));

  document.querySelectorAll("[data-countdown]").forEach((box) => {
    box.innerHTML = `
      <div class="time-box"><strong>${String(days).padStart(2, "0")}</strong><span>DAYS</span></div>
      <div class="time-box"><strong>${String(hours).padStart(2, "0")}</strong><span>HOURS</span></div>
      <div class="time-box"><strong>${String(mins).padStart(2, "0")}</strong><span>MINS</span></div>
      <div class="time-box"><strong>${String(secs).padStart(2, "0")}</strong><span>SECS</span></div>
    `;
  });
}

function startTick() {
  if (!tick || isSongPlaying) return;

  tick.volume = 0.45;
  tick.loop = true;

  tick.play().catch(() => {
    console.log("Tick not playing. Check assets/tick-tock.mp3");
  });
}

function stopTick() {
  if (!tick) return;

  tick.pause();
  tick.currentTime = 0;
}

function playSong() {
  if (!song) return;

  isSongPlaying = true;
  stopTick();

  song.pause();
  song.currentTime = SONG_START_SECOND;
  song.volume = 0.35;

  song.play().catch(() => {
    console.log("Song not playing. Check assets/song.mp3");
    isSongPlaying = false;
    startTick();
  });

  setTimeout(() => {
    song.pause();
    song.currentTime = SONG_START_SECOND;

    isSongPlaying = false;
    startTick();
  }, SONG_PLAY_SECONDS * 1000);
}

function createPetals() {
  const symbols = ["❀", "✿", "❁", "♡", "✦"];

  for (let i = 0; i < 90; i++) {
    const petal = document.createElement("div");

    petal.className = "petal";
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = 5 + Math.random() * 6 + "s";
    petal.style.animationDelay = Math.random() * 2.5 + "s";
    petal.style.opacity = 0.3 + Math.random() * 0.5;
    petal.style.color = ["#9b9aa5", "#b99aad", "#c9a96e", "#c07090", "#7c5fa0"][Math.floor(Math.random() * 5)];
    petal.style.fontSize = 14 + Math.random() * 18 + "px";

    petals.appendChild(petal);
    setTimeout(() => petal.remove(), 14000);
  }
}

function createSparkles(startX, startY) {
  const colors = ["#c9a96e", "#e8cc94", "#7c5fa0", "#c49abf", "#e8a0b0", "#6aab94"];
  const shapes = ["✦", "✧", "★", "☆", "♡", "❤", "✨"];

  for (let i = 0; i < 45; i++) {
    const particle = document.createElement("div");
    particle.className = "sparkle-particle";
    particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    particle.style.color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = startX + "px";
    particle.style.top = startY + "px";

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 220;

    particle.style.setProperty("--mx", Math.cos(angle) * distance + "px");
    particle.style.setProperty("--my", Math.sin(angle) * distance + "px");
    particle.style.setProperty("--ms", 0.5 + Math.random() * 1.5);
    particle.style.setProperty("--mrot", Math.random() * 720 - 360 + "deg");
    particle.style.animationDuration = 0.6 + Math.random() * 0.6 + "s";

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1200);
  }
}

// Only events browsers actually count as "user activation" can unlock
// audio playback. touchstart, pointerdown, scroll, and mousemove do NOT
// count on most mobile browsers — click, touchend, pointerup, and keydown do.
const GESTURE_EVENTS = ["click", "touchend", "pointerup", "keydown"];

function triggerFirstInteractionTick(e) {
  if (hasStartedTick) return;
  if (e.target && e.target.closest && e.target.closest("#acceptBtn")) return;

  hasStartedTick = true;
  startTick();

  GESTURE_EVENTS.forEach((evt) =>
    document.removeEventListener(evt, triggerFirstInteractionTick)
  );
}

GESTURE_EVENTS.forEach((evt) =>
  document.addEventListener(evt, triggerFirstInteractionTick, { passive: true })
);

// Best-effort: try to autoplay the moment the page loads.
// Most browsers block audio autoplay until the user interacts with the page
// (that's a browser policy, not something the code can bypass) — but some
// desktop browsers allow it if the visitor has been on the site before.
window.addEventListener("load", () => {
  if (hasStartedTick || !tick) return;

  tick.volume = 0.45;
  tick.loop = true;

  tick
    .play()
    .then(() => {
      hasStartedTick = true;
    })
    .catch(() => {
      // Blocked — will start on first tap/scroll/click/key instead.
    });
});

acceptBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  acceptBtn.classList.add("accepting");

  const x = e.clientX || acceptBtn.getBoundingClientRect().left + acceptBtn.offsetWidth / 2;
  const y = e.clientY || acceptBtn.getBoundingClientRect().top + acceptBtn.offsetHeight / 2;

  createSparkles(x, y);
  createPetals();
  playSong();

  setTimeout(() => {
    document.querySelector(".page").classList.add("state-accepted");
  }, 150);

  setTimeout(() => {
    inviteScreen.classList.remove("active");
    thanksScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 700);
});

declineBtn.addEventListener("click", () => {
  declineModal.classList.add("active");
});

declineClose.addEventListener("click", () => {
  declineModal.classList.remove("active");
});

declineModal.addEventListener("click", (e) => {
  if (e.target === declineModal) declineModal.classList.remove("active");
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopTick();
  } else if (!isSongPlaying && hasStartedTick) {
    startTick();
  }
});

updateCountdown();
setInterval(updateCountdown, 1000);