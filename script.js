const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let dots = [];
let width = 0;
let height = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(Math.floor((width * height) / 19000), 70);
  dots = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.25 + .25,
    dx: (Math.random() - .5) * .16,
    dy: (Math.random() - .5) * .16,
    tone: Math.random() > .73 ? '136,244,211' : '143,183,255'
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    dot.x += dot.dx;
    dot.y += dot.dy;
    if (dot.x < 0 || dot.x > width) dot.dx *= -1;
    if (dot.y < 0 || dot.y > height) dot.dy *= -1;
    ctx.fillStyle = `rgba(${dot.tone}, .62)`;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fill();
    for (let j = i + 1; j < dots.length; j++) {
      const peer = dots[j];
      const distance = Math.hypot(dot.x - peer.x, dot.y - peer.y);
      if (distance < 125) {
        ctx.strokeStyle = `rgba(114,168,255,${.09 * (1 - distance / 125)})`;
        ctx.lineWidth = .5;
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(peer.x, peer.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawStars);
}

resizeCanvas();
drawStars();
window.addEventListener('resize', resizeCanvas);

document.querySelectorAll('[data-delay]').forEach((element) => {
  element.style.setProperty('--reveal-delay', `${element.dataset.delay}ms`);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.getElementById('year').textContent = new Date().getFullYear();
