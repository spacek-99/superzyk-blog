type Star = { x: number; y: number; phase: number; size: number };
type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number };

const STAR_COUNT = 36;
const MAX_SPARKS = 32;
const FRAME_MS = 1000 / 30;

export function createCampfireParticles(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  const stars: Star[] = Array.from({ length: STAR_COUNT }, (_, i) => ({
    x: 0.07 + Math.random() * 0.86,
    y: 0.06 + Math.random() * 0.78,
    phase: Math.random() * Math.PI * 2,
    size: i % 9 === 0 ? 1.8 : 1,
  }));
  let sparks: Spark[] = [];
  let width = 1;
  let height = 1;
  let time = 0;
  let running = false;
  let frame = 0;
  let previous = 0;
  let pointerX = 0;
  let pointerY = 0;
  let offsetX = 0;
  let offsetY = 0;

  const draw = () => {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#fff0bc";
    for (const star of stars) {
      const pulse = (Math.sin(time * 0.8 + star.phase) + 1) / 2;
      const x = Math.round(star.x * width + Math.sin(time * 0.18 + star.phase) * 1.5 + offsetX);
      const y = Math.round(star.y * height + Math.cos(time * 0.15 + star.phase) * 1.5 + offsetY);
      context.globalAlpha = 0.12 + pulse * 0.48;
      context.fillRect(x, y, star.size, star.size);
      if (star.size > 1 && pulse > 0.75) {
        context.globalAlpha *= 0.45;
        context.fillRect(x - 2, y, 6, 1);
        context.fillRect(x, y - 2, 1, 6);
      }
    }
    for (const spark of sparks) {
      context.globalAlpha = (1 - spark.age / spark.life) * 0.9;
      context.fillStyle = spark.age < 0.4 ? "#ffe2a1" : "#efaa60";
      context.fillRect(Math.round(spark.x * width), Math.round(spark.y * height), 1.5, 1.5);
    }
    context.globalAlpha = 1;
  };

  const tick = (now: number) => {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    if (previous && now - previous < FRAME_MS) return;
    const delta = previous ? Math.min((now - previous) / 1000, 0.08) : 1 / 30;
    previous = now;
    time += delta;
    offsetX += (pointerX * 5 - offsetX) * 0.08;
    offsetY += (pointerY * 5 - offsetY) * 0.08;
    sparks = sparks.filter((spark) => {
      spark.age += delta;
      spark.x += spark.vx * delta;
      spark.y += spark.vy * delta;
      spark.vx *= 0.99;
      return spark.age < spark.life;
    });
    draw();
  };

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(bounds.width, 1);
    height = Math.max(bounds.height, 1);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context?.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (time > 0) draw();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  return {
    setRunning(next: boolean) {
      if (running === next || !context) return;
      running = next;
      if (next) {
        previous = 0;
        frame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frame);
      }
    },
    point(x: number, y: number) {
      pointerX = Math.max(-0.5, Math.min(x, 0.5));
      pointerY = Math.max(-0.5, Math.min(y, 0.5));
    },
    burst() {
      if (!running) return;
      // Replace the previous burst: repeated clicks never grow the particle budget.
      sparks = Array.from({ length: MAX_SPARKS }, () => ({
        x: 0.5 + (Math.random() - 0.5) * 0.025,
        y: 0.79 + Math.random() * 0.015,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.03 - Math.random() * 0.08,
        age: 0,
        life: 1.2 + Math.random() * 1.5,
      }));
    },
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      context?.clearRect(0, 0, width, height);
    },
  };
}
