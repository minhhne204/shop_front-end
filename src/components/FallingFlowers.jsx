import { useEffect, useRef } from "react";

const FallingFlowers = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let petals = [];

    const createPetal = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 6 + 4,
      speed: Math.random() * 1 + 0.5,
      sway: Math.random() * 1 - 0.5,
      angle: Math.random() * Math.PI,
    });

    for (let i = 0; i < 40; i++) petals.push(createPetal());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        ctx.beginPath();
        ctx.fillStyle = "#f9a8d4"; // màu hoa đào
        ctx.moveTo(0, -p.r);
        ctx.bezierCurveTo(p.r, -p.r, p.r, p.r, 0, p.r);
        ctx.bezierCurveTo(-p.r, p.r, -p.r, -p.r, 0, -p.r);
        ctx.fill();

        ctx.restore();

        p.y += p.speed;
        p.x += p.sway;
        p.angle += 0.01;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
};

export default FallingFlowers;
