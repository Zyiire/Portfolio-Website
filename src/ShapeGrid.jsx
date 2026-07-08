import { useRef, useEffect } from "react";

/*
  Animated background grid rendered on a <canvas>.
  Fills its parent element; the grid drifts in `direction` and the
  cell under the cursor fills with `hoverFillColor`.
  shape: "hexagon" | "square"
  hoverTrailAmount: 0 (no trail) → 1 (long fading trail)
*/
export default function ShapeGrid({
  speed = 0.5,
  squareSize = 40,
  direction = "right", // "right" | "left" | "up" | "down" | "diagonal"
  borderColor = "#999",
  hoverFillColor = "#222",
  shape = "square",
  hoverTrailAmount = 0,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const offset = { x: 0, y: 0 };
    const mouse = { x: null, y: null };
    const trail = new Map(); // "col,row" -> alpha
    let raf;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const hex = shape === "hexagon";
    const r = squareSize / 2;
    const colW = hex ? 1.5 * r : squareSize;
    const rowH = hex ? Math.sqrt(3) * r : squareSize;
    const yShiftFor = (col) => (hex && col % 2 !== 0 ? rowH / 2 : 0);

    const cellPath = (cx, cy) => {
      ctx.beginPath();
      if (hex) {
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          const px = cx + r * Math.cos(a);
          const py = cy + r * Math.sin(a);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else {
        ctx.rect(cx - r, cy - r, squareSize, squareSize);
      }
    };

    const hoveredCell = () => {
      if (mouse.x === null) return null;
      const mx = mouse.x + offset.x;
      const my = mouse.y + offset.y;
      const c0 = Math.floor(mx / colW);
      let best = null;
      let bestD = Infinity;
      for (let c = c0 - 1; c <= c0 + 1; c++) {
        const shift = yShiftFor(c);
        const r0 = Math.floor((my - shift) / rowH);
        for (let row = r0 - 1; row <= r0 + 1; row++) {
          const d = (c * colW - mx) ** 2 + (row * rowH + shift - my) ** 2;
          if (d < bestD) {
            bestD = d;
            best = `${c},${row}`;
          }
        }
      }
      return best;
    };

    const frame = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const hovered = hoveredCell();
      if (hovered) trail.set(hovered, 1);
      const fade =
        hoverTrailAmount > 0 ? Math.max(0.01, 0.1 * (1 - hoverTrailAmount)) : 1;
      for (const [key, alpha] of trail) {
        if (key !== hovered) {
          const next = alpha - fade;
          next <= 0 ? trail.delete(key) : trail.set(key, next);
        }
      }

      const c0 = Math.floor(offset.x / colW) - 1;
      const c1 = Math.ceil((offset.x + w) / colW) + 1;
      ctx.strokeStyle = borderColor;
      for (let c = c0; c <= c1; c++) {
        const shift = yShiftFor(c);
        const r0 = Math.floor((offset.y - shift) / rowH) - 1;
        const r1 = Math.ceil((offset.y - shift + h) / rowH) + 1;
        for (let row = r0; row <= r1; row++) {
          const cx = c * colW - offset.x;
          const cy = row * rowH + shift - offset.y;
          cellPath(cx, cy);
          const alpha = trail.get(`${c},${row}`);
          if (alpha) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          ctx.stroke();
        }
      }

      if (direction === "right" || direction === "diagonal") offset.x += speed;
      if (direction === "left") offset.x -= speed;
      if (direction === "down" || direction === "diagonal") offset.y += speed;
      if (direction === "up") offset.y -= speed;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [speed, squareSize, direction, borderColor, hoverFillColor, shape, hoverTrailAmount]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
