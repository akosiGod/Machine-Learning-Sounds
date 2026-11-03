// Teachable Machine Export URL
const URL = "https://teachablemachine.withgoogle.com/models/lXz3UKp9h/";

let recognizer;

// Exact Animal Icon Mapping (Robust normalization for Owl, Gecko, Dog, etc.)
const animalIcons = {
  "dog": "🐕",
  "cat": "🐈",
  "duck": "🦆",
  "cow": "🐄",
  "pig": "🐖",
  "owl": "🦉",
  "goat": "🐐",
  "tuko/gecko": "🦎",
  "tuko": "🦎",
  "gecko": "🦎",
  "background noise": "🌙",
  "noise": "🌌"
};

// Build Visualizer Equalizer Elements
const visualizerContainer = document.getElementById("visualizer-container");
const NUM_BARS = 32;
const barElements = [];

for (let i = 0; i < NUM_BARS; i++) {
  const bar = document.createElement("div");
  bar.className = "v-bar";
  visualizerContainer.appendChild(bar);
  barElements.push(bar);
}

// Create SpeechCommands Recognizer
async function createModel() {
  const checkpointURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  const model = speechCommands.create(
    "BROWSER_FFT",
    undefined,
    checkpointURL,
    metadataURL
  );

  await model.ensureModelLoaded();
  return model;
}

// Initialize Model & Speech Recognition
async function init() {
  const startBtn = document.getElementById("start-btn");
  const statusText = document.getElementById("status-text");
  const statusContainer = document.querySelector(".status-indicator");

  startBtn.disabled = true;
  statusText.innerText = "Loading Neural Model...";

  try {
    recognizer = await createModel();
    const classLabels = recognizer.wordLabels();
    const labelContainer = document.getElementById("label-container");

    labelContainer.innerHTML = "";

    classLabels.forEach((label) => {
      const cleanLabel = label.trim().toLowerCase();
      
      let icon = "🐾";
      for (const [key, val] of Object.entries(animalIcons)) {
        if (cleanLabel.includes(key)) {
          icon = val;
          break;
        }
      }

      const safeId = cleanLabel.replace(/[^a-z0-9]/g, "-");

      const card = document.createElement("div");
      card.className = "animal-card";
      card.id = `card-${safeId}`;

      card.innerHTML = `
        <div class="animal-avatar">${icon}</div>
        <div class="animal-name">${label}</div>
        <div class="progress-track">
          <div class="progress-bar" id="bar-${safeId}"></div>
        </div>
        <div class="score-badge" id="score-${safeId}">0%</div>
      `;

      labelContainer.appendChild(card);
    });

    statusText.innerText = "Listening Active...";
    statusContainer.classList.add("listening");
    startBtn.classList.add("active");
    startBtn.querySelector(".btn-text").innerText = "Acoustic Stream Active";

    recognizer.listen(
      (result) => {
        const scores = result.scores;
        let highestScore = 0;

        for (let i = 0; i < classLabels.length; i++) {
          const label = classLabels[i];
          const score = scores[i];
          const percentage = Math.round(score * 100);

          const safeId = label.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
          const cardElem = document.getElementById(`card-${safeId}`);
          const barElem = document.getElementById(`bar-${safeId}`);
          const scoreElem = document.getElementById(`score-${safeId}`);

          if (barElem && scoreElem && cardElem) {
            barElem.style.width = `${percentage}%`;
            scoreElem.innerText = `${percentage}%`;

            if (score >= 0.90 && !label.toLowerCase().includes("background") && !label.toLowerCase().includes("noise")) {
              cardElem.classList.add("highlight");
            } else {
              cardElem.classList.remove("highlight");
            }
          }

          if (score > highestScore) {
            highestScore = score;
          }
        }

        animateVisualizer(highestScore);
      },
      {
        includeSpectrogram: true,
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50
      }
    );

  } catch (err) {
    console.error(err);
    statusText.innerText = `Error: ${err.message || "Failed to load model"}`;
    startBtn.disabled = false;
  }
}

// Smooth Visualizer Equalizer Bar Animation
function animateVisualizer(intensity) {
  barElements.forEach((bar, index) => {
    const factor = Math.sin((index / NUM_BARS) * Math.PI);
    const height = Math.max(8, Math.min(74, intensity * 78 * factor * (0.6 + Math.random() * 0.4)));
    bar.style.height = `${height}px`;
  });
}

/* =================================================================
   +200% ULTRA-DETAILED 60 FPS CINEMATIC NIGHT FARM CANVAS ENGINE
================================================================= */
const canvas = document.getElementById("farm-canvas");
const ctx = canvas.getContext("2d", { alpha: false });

let width, height;
const fireflies = [];
const stars = [];
const mistParticles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Star {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * (height * 0.6);
    this.size = Math.random() * 1.8 + 0.4;
    this.alpha = Math.random();
    this.twinkleSpeed = Math.random() * 0.02 + 0.004;
  }

  update() {
    this.alpha += this.twinkleSpeed;
    if (this.alpha >= 1 || this.alpha <= 0.2) {
      this.twinkleSpeed = -this.twinkleSpeed;
    }
  }

  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.alpha)})`;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

class Firefly {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = height * 0.45 + Math.random() * (height * 0.55);
    this.radius = Math.random() * 2.2 + 0.8;
    this.alpha = Math.random();
    this.speedAlpha = (Math.random() * 0.012 + 0.003) * (Math.random() < 0.5 ? 1 : -1);
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.35;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha += this.speedAlpha;

    if (this.alpha >= 1 || this.alpha <= 0) {
      this.speedAlpha = -this.speedAlpha;
    }

    if (this.x < 0 || this.x > width || this.y < height * 0.35 || this.y > height) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.shadowBlur = 14;
    ctx.shadowColor = "#fbbf24";
    ctx.fill();
    ctx.restore();
  }
}

class MistParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width - width * 0.2;
    this.y = height * 0.75 + Math.random() * (height * 0.25);
    this.vx = Math.random() * 0.3 + 0.1;
    this.radius = Math.random() * 80 + 40;
    this.alpha = Math.random() * 0.08 + 0.02;
  }

  update() {
    this.x += this.vx;
    if (this.x > width + 100) {
      this.x = -150;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    const grad = ctx.createRadialGradient(this.x, this.y, 5, this.x, this.y, this.radius);
    grad.addColorStop(0, "rgba(56, 189, 248, 0.25)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 90; i++) stars.push(new Star());
for (let i = 0; i < 45; i++) fireflies.push(new Firefly());
for (let i = 0; i < 12; i++) mistParticles.push(new MistParticle());

let windAngle = 0;
let lastTime = 0;
let fpsCount = 0;
let currentFps = 60;
const fpsElem = document.getElementById("fps-counter");

// Master 60 FPS Render Loop
function renderFarmBackground(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  
  if (delta >= 1000) {
    currentFps = Math.round((fpsCount * 1000) / delta);
    if (fpsElem) fpsElem.innerText = `${currentFps} FPS`;
    fpsCount = 0;
    lastTime = timestamp;
  }
  fpsCount++;

  ctx.clearRect(0, 0, width, height);

  // 1. Cinematic Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, "#010206");
  skyGrad.addColorStop(0.4, "#060d21");
  skyGrad.addColorStop(1, "#0d152e");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Stars
  stars.forEach((s) => { s.update(); s.draw(); });

  // 3. Volumetric Moon & Halo
  const moonX = width * 0.85;
  const moonY = height * 0.18;
  
  const haloGrad = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 320);
  haloGrad.addColorStop(0, "rgba(224, 242, 254, 0.25)");
  haloGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.08)");
  haloGrad.addColorStop(1, "transparent");
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(moonX, moonY, 320, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(moonX, moonY, 42, 0, Math.PI * 2);
  ctx.fillStyle = "#f8fafc";
  ctx.shadowBlur = 25;
  ctx.shadowColor = "#e0f2fe";
  ctx.fill();
  ctx.restore();

  // 4. Parallax Mountain & Hill Ranges (Layers 1 & 2)
  ctx.fillStyle = "#070d1d";
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.6);
  ctx.quadraticCurveTo(width * 0.28, height * 0.45, width * 0.58, height * 0.64);
  ctx.quadraticCurveTo(width * 0.82, height * 0.52, width, height * 0.58);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#040814";
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.75);
  ctx.quadraticCurveTo(width * 0.32, height * 0.65, width * 0.68, height * 0.78);
  ctx.quadraticCurveTo(width * 0.88, height * 0.72, width, height * 0.8);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Detailed Barn Silhouette + Glowing Lantern Window
  const barnX = width * 0.18;
  const barnY = height * 0.68;
  ctx.fillStyle = "#020409";
  ctx.fillRect(barnX, barnY, 80, 52);
  ctx.beginPath();
  ctx.moveTo(barnX - 12, barnY);
  ctx.lineTo(barnX + 40, barnY - 30);
  ctx.lineTo(barnX + 92, barnY);
  ctx.closePath();
  ctx.fill();

  // Glowing Warm Windows
  ctx.fillStyle = "rgba(251, 191, 36, 0.9)";
  ctx.shadowBlur = 12;
  ctx.shadowColor = "#fbbf24";
  ctx.fillRect(barnX + 32, barnY + 14, 16, 20);
  ctx.shadowBlur = 0;

  // Wind Turbine Animation
  windAngle += 0.012;
  const turbineX = width * 0.72;
  const turbineY = height * 0.64;
  ctx.strokeStyle = "#070d1d";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(turbineX, turbineY);
  ctx.lineTo(turbineX, turbineY - 75);
  ctx.stroke();

  ctx.save();
  ctx.translate(turbineX, turbineY - 75);
  ctx.rotate(windAngle);
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 3; i++) {
    ctx.rotate((Math.PI * 2) / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -42);
    ctx.stroke();
  }
  ctx.restore();

  // 5. Rolling Mist & Ground Fog
  mistParticles.forEach((m) => { m.update(); m.draw(); });

  // 6. Fireflies
  fireflies.forEach((f) => { f.update(); f.draw(); });

  requestAnimationFrame(renderFarmBackground);
}

requestAnimationFrame(renderFarmBackground);