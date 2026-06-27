import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

export default function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const count = 55; // Highly optimized for performance

    const warmColors = [
      "rgba(255, 75, 43, ",   // Fire Red-Orange
      "rgba(255, 140, 0, ",   // Dark Orange
      "rgba(255, 186, 8, ",   // Amber Gold
      "rgba(232, 93, 4, ",    // Rust Orange
      "rgba(244, 140, 6, "    // Orange Gold
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.9 - 0.2, // Move upwards
        alpha: Math.random() * 0.6 + 0.2,
        color: warmColors[Math.floor(Math.random() * warmColors.length)]
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Sway slightly horizontally
        p.vx += (Math.random() - 0.5) * 0.05;
        if (p.vx > 0.45) p.vx = 0.45;
        if (p.vx < -0.45) p.vx = -0.45;

        // Reset if goes off screen or fully faded
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.vy = -Math.random() * 0.9 - 0.2;
          p.alpha = Math.random() * 0.6 + 0.2;
        }
        if (p.x < -10 || p.x > canvas.width + 10) {
          p.x = Math.random() * canvas.width;
        }

        // Render soft glowing fire ember
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Glow effect
        ctx.shadowBlur = Math.random() * 6 + 4;
        ctx.shadowColor = p.color.replace(", ", ")");
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
