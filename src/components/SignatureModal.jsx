import React, { useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const COLORS = [
  { color: "#111", label: "Noir" },
  { color: "#076ff8", label: "Bleu" },
  { color: "#f81d1d", label: "Rouge" },
];

export default function SignatureModal({ open, onClose, onSave }) {
  const [drawColor, setDrawColor] = useState(COLORS[0].color);
  const [drawing, setDrawing] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState("");
  const canvasRef = useRef(null);
  const lastPoint = useRef(null);

  // Dessin sur canvas
  function handlePointerDown(e) {
    setDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    lastPoint.current = {
      x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top,
    };
  }
  function handlePointerMove(e) {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPoint.current = { x, y };
  }
  function handlePointerUp() {
    setDrawing(false);
    setCanvasUrl(canvasRef.current.toDataURL());
  }
  function handleClear() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setCanvasUrl("");
  }
  // Valider
  function handleDone() {
    if (canvasUrl) onSave(canvasUrl);
    onClose();
  }
  // Aperçu
  const hasDraw = !!canvasUrl;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg flex flex-col gap-4">
          <DialogPrimitive.Title className="text-xl font-bold mb-2">
            Signature
          </DialogPrimitive.Title>
          <div className="flex border-b mb-2">
            <button
              className="flex-1 py-2 font-semibold border-b-2 border-violet-700 text-violet-700 bg-violet-100 rounded-tl-xl"
              style={{ background: "#4f1edc", color: "#fff" }}
              disabled
            >
              Dessiner
            </button>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={160}
              className="border bg-gray-100 rounded w-full h-40 cursor-crosshair"
              style={{ touchAction: "none" }}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            />
            <button
              className="text-sm text-blue-600 underline mt-1"
              onClick={handleClear}
            >
              Effacer
            </button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {COLORS.map((c) => (
              <button
                key={c.color}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                  drawColor === c.color ? "border-black" : "border-transparent"
                }`}
                style={{ background: c.color }}
                onClick={() => setDrawColor(c.color)}
                aria-label={c.label}
                type="button"
              >
                {drawColor === c.color && (
                  <span className="text-white text-lg">✓</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>
              Annuler
            </button>
            <button
              className={`px-4 py-2 rounded font-bold ${
                hasDraw
                  ? "bg-violet-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              onClick={handleDone}
              disabled={!hasDraw}
            >
              Terminé
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
