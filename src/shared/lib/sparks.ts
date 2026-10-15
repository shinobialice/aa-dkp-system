type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  color: string;
};

const PARTICLE_COUNT = 50;
const GRAVITY = 0.18;

let canvas: HTMLCanvasElement | null = null;
let particles: Particle[] = [];

export function burstSparks(origin: Element, colors: string[]) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = origin.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 1,
      decay: 0.012 + Math.random() * 0.02,
      size: 1.5 + Math.random() * 2.5,
      color: colors[i % colors.length],
    });
  }
  if (!canvas) {
    canvas = createCanvas();
    requestAnimationFrame(draw);
  }
}

function createCanvas() {
  const element = document.createElement("canvas");
  const ratio = window.devicePixelRatio || 1;
  element.width = Math.round(window.innerWidth * ratio);
  element.height = Math.round(window.innerHeight * ratio);
  element.setAttribute("aria-hidden", "true");
  Object.assign(element.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "60",
  });
  element.getContext("2d")?.scale(ratio, ratio);
  document.body.append(element);
  return element;
}

function draw() {
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += GRAVITY;
    particle.vx *= 0.985;
    particle.life -= particle.decay;
    context.globalAlpha = Math.max(0, particle.life);
    context.fillStyle = particle.color;
    context.beginPath();
    context.arc(
      particle.x,
      particle.y,
      particle.size * particle.life + 0.4,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  particles = particles.filter((particle) => particle.life > 0);
  if (particles.length > 0) {
    requestAnimationFrame(draw);
    return;
  }
  canvas.remove();
  canvas = null;
}
