import React, { useEffect, useRef } from "react";
import "./reactbits.css";

export default function ClickSpark() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const sparks = [];
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const click = e => {
      if (e.target.closest("input, textarea, select")) return;
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        sparks.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(a) * 2.4,
          vy: Math.sin(a) * 2.4,
          life: 1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.life -= .035;
        ctx.strokeStyle = `rgba(131,215,174,${Math.max(0,s.life)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 3.3, s.y - s.vy * 3.3);
        ctx.stroke();
        if (s.life <= 0) sparks.splice(i, 1);
      }
      frame = requestAnimationFrame(draw);
    };

    resize(); draw();
    addEventListener("resize", resize);
    addEventListener("pointerdown", click);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      removeEventListener("pointerdown", click);
    };
  }, []);

  return <canvas ref={canvasRef} className="rb-click-spark" aria-hidden="true" />;
}
