const inviteScreen  = document.getElementById("inviteScreen");
const thanksScreen  = document.getElementById("thanksScreen");
const acceptBtn     = document.getElementById("acceptBtn");
const declineBtn    = document.getElementById("declineBtn");
const declineModal  = document.getElementById("declineModal");
const declineClose  = document.getElementById("declineClose");
const loader        = document.getElementById("loader");
const song          = document.getElementById("song");
const petals        = document.getElementById("petals");

const weddingDate = new Date("2026-09-10T00:00:00").getTime();

const SONG_START_SECOND = 0;
const SONG_PLAY_SECONDS = 20;

function updateCountdown() {
  const now      = Date.now();
  const distance = weddingDate - now;

  const days  = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((distance / (1000 * 60 * 60)) % 24));
  const mins  = Math.max(0, Math.floor((distance / (1000 * 60)) % 60));
  const secs  = Math.max(0, Math.floor((distance / 1000) % 60));

  document.querySelectorAll("[data-countdown]").forEach((box) => {
    box.innerHTML = `
      <div class="time-box"><strong>${String(days).padStart(2,"0")}</strong><span>DAYS</span></div>
      <div class="time-box"><strong>${String(hours).padStart(2,"0")}</strong><span>HOURS</span></div>
      <div class="time-box"><strong>${String(mins).padStart(2,"0")}</strong><span>MINS</span></div>
      <div class="time-box"><strong>${String(secs).padStart(2,"0")}</strong><span>SECS</span></div>
    `;
  });
}

function createPetals() {
  const symbols = ["❀", "✿", "❁", "♡", "✦"];

  for (let i = 0; i < 90; i++) {
    const petal = document.createElement("div");

    petal.className = "petal";
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Spread horizontally across the entire viewport width
    petal.style.left = Math.random() * 100 + "vw";
    
    petal.style.animationDuration = 5 + Math.random() * 6 + "s";
    petal.style.animationDelay = Math.random() * 2.5 + "s";
    petal.style.opacity = 0.3 + Math.random() * 0.5;
    petal.style.color = ["#9b9aa5","#b99aad","#c9a96e","#c07090","#7c5fa0"][Math.floor(Math.random() * 5)];
    petal.style.fontSize = 14 + Math.random() * 18 + "px";

    petals.appendChild(petal);
    setTimeout(() => petal.remove(), 14000);
  }
}

function playSong() {
  if (!song) return;
  song.pause();
  song.currentTime = SONG_START_SECOND;
  song.volume = 0.85;
  song.play().catch(() => {});
  setTimeout(() => {
    song.pause();
    song.currentTime = SONG_START_SECOND;
  }, SONG_PLAY_SECONDS * 1000);
}

function createSparkles(startX, startY) {
  const sparkleColors = ["#c9a96e", "#e8cc94", "#7c5fa0", "#c49abf", "#e8a0b0", "#6aab94"];
  const shapes = ["✦", "✧", "★", "☆", "♡", "❤", "✨"];
  
  // Create 45 sparkle particles radiating outward
  for (let i = 0; i < 45; i++) {
    const particle = document.createElement("div");
    particle.className = "sparkle-particle";
    
    // Choose random shape and color
    particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    particle.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    
    // Position at click coordinate
    particle.style.left = startX + "px";
    particle.style.top = startY + "px";
    
    // Random direction and distance (angle + radius)
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 220; // travel distance
    const moveX = Math.cos(angle) * distance + "px";
    const moveY = Math.sin(angle) * distance + "px";
    const scale = 0.5 + Math.random() * 1.5;
    const rotation = (Math.random() * 720 - 360) + "deg";
    
    particle.style.setProperty("--mx", moveX);
    particle.style.setProperty("--my", moveY);
    particle.style.setProperty("--ms", scale);
    particle.style.setProperty("--mrot", rotation);
    
    // Vary animation duration and delay slightly
    particle.style.animationDuration = (0.6 + Math.random() * 0.6) + "s";
    
    document.body.appendChild(particle);
    
    // Clean up particle
    setTimeout(() => {
      particle.remove();
    }, 1200);
  }
}

/* ── Accept ── */
acceptBtn.addEventListener("click", (e) => {
  acceptBtn.classList.add("accepting");
  
  // Get button click coordinates (or fall back to center of button)
  const x = e.clientX || (acceptBtn.getBoundingClientRect().left + acceptBtn.offsetWidth / 2);
  const y = e.clientY || (acceptBtn.getBoundingClientRect().top + acceptBtn.offsetHeight / 2);
  
  createSparkles(x, y);
  createPetals();
  playSong();

  // Trigger transition state on parent container (150ms delay)
  setTimeout(() => {
    document.querySelector(".page").classList.add("state-accepted");
  }, 150);

  // Clean up inviteScreen active class once animation completes (700ms)
  setTimeout(() => {
    inviteScreen.classList.remove("active");
    thanksScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 700);
});

/* ── Decline ── */
declineBtn.addEventListener("click", () => {
  declineModal.classList.add("active");
});

declineClose.addEventListener("click", () => {
  declineModal.classList.remove("active");
});

// Tap backdrop to close
declineModal.addEventListener("click", (e) => {
  if (e.target === declineModal) declineModal.classList.remove("active");
});

updateCountdown();
setInterval(updateCountdown, 1000);