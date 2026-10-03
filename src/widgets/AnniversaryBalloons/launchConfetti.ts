const CONFETTI_COLORS = ["#2f9e62", "#e89d35", "#5a36a5", "#d764a8"];

export async function launchConfetti(origin: { x: number; y: number }) {
  const { default: confetti } = await import("canvas-confetti");
  const base = {
    colors: CONFETTI_COLORS,
    zIndex: 100,
    disableForReducedMotion: true,
  };

  confetti({
    ...base,
    particleCount: 90,
    spread: 80,
    startVelocity: 40,
    origin,
  });

  [0.2, 0.5, 0.8].forEach((x, i) => {
    setTimeout(
      () => {
        confetti({
          ...base,
          particleCount: 70,
          spread: 120,
          startVelocity: 35,
          origin: { x, y: 0.3 },
        });
      },
      250 + i * 200,
    );
  });

  const end = Date.now() + 1500;
  (function frame() {
    confetti({
      ...base,
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
    });
    confetti({
      ...base,
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
