const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  const dark = root.getAttribute("data-theme") === "dark";
  root.setAttribute("data-theme", dark ? "light" : "dark");
  themeToggle.textContent = dark ? "☾ Theme" : "☀ Theme";
});

document.getElementById("year").textContent = new Date().getFullYear();

// Lightweight animated particle network for the hero background.
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let width = 0, height = 0, points = [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(85, Math.max(35, Math.floor(width / 16)));
  points = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - .5) * .25,
    vy: (Math.random() - .5) * .25
  }));
}
function draw() {
  ctx.clearRect(0, 0, width, height);
  const styles = getComputedStyle(root);
  const accent = styles.getPropertyValue("--accent").trim() || "#4d66ff";
  points.forEach((p, i) => {
    if (!reduceMotion) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
    ctx.fillStyle = accent;
    ctx.globalAlpha = .5;
    ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
    for (let j = i + 1; j < points.length; j++) {
      const q = points[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 125) {
        ctx.globalAlpha = (1 - distance / 125) * .14;
        ctx.strokeStyle = accent; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
  });
  ctx.globalAlpha = 1;
  if (!reduceMotion) requestAnimationFrame(draw);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
draw();
