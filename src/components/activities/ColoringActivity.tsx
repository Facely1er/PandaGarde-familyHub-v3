import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, CheckCircle2, Palette, Sparkles } from 'lucide-react';
import ActivityGameShell, { shellBtn, shellBtnPrimary } from './ActivityGameShell';
import ActivityPurposeBanner, { type ActivityContext } from './ActivityPurposeBanner';

interface ColoringActivityProps {
  onComplete: (score?: number) => void;
  onClose: () => void;
  context?: ActivityContext;
}

const ColoringActivity: React.FC<ColoringActivityProps> = ({ onComplete, onClose, context }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(10);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE'
  ];

  const drawColoringPage = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, 600, 400);

    // Set background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#E8F5E8');
    gradient.addColorStop(1, '#F8F9FA');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);

    // Draw decorative border
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 580, 380);

    // Draw Privacy Panda outline with thicker, more child-friendly lines
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 4;
    ctx.beginPath();

    // Panda head (larger and more rounded)
    ctx.arc(300, 150, 90, 0, 2 * Math.PI);
    ctx.stroke();

    // Panda ears (larger)
    ctx.beginPath();
    ctx.arc(250, 100, 35, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(350, 100, 35, 0, 2 * Math.PI);
    ctx.stroke();

    // Panda eyes (larger and more expressive)
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.arc(280, 140, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(320, 140, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Eye highlights
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(282, 138, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(322, 138, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Panda nose (larger)
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.arc(300, 160, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Panda mouth (more expressive)
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(300, 170, 18, 0, Math.PI);
    ctx.stroke();

    // Panda body
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(300, 200, 60, 0, 2 * Math.PI);
    ctx.stroke();

    // Panda arms
    ctx.beginPath();
    ctx.arc(250, 220, 25, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(350, 220, 25, 0, 2 * Math.PI);
    ctx.stroke();

    // Shield outline (more detailed)
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(200, 250);
    ctx.lineTo(200, 350);
    ctx.lineTo(300, 380);
    ctx.lineTo(400, 350);
    ctx.lineTo(400, 250);
    ctx.lineTo(300, 220);
    ctx.closePath();
    ctx.stroke();

    // Shield decoration lines
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.lineTo(250, 350);
    ctx.moveTo(300, 250);
    ctx.lineTo(300, 350);
    ctx.moveTo(350, 250);
    ctx.lineTo(350, 350);
    ctx.stroke();

    // Lock symbol on shield (more detailed)
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(300, 300, 25, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(275, 300);
    ctx.lineTo(275, 275);
    ctx.lineTo(325, 275);
    ctx.lineTo(325, 300);
    ctx.stroke();

    // Lock keyhole
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.arc(300, 300, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Add some decorative elements
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ðŸ”’', 300, 320);

    // Text with better styling
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Privacy Panda', 300, 50);
    ctx.font = '18px Arial';
    ctx.fillStyle = '#4CAF50';
    ctx.fillText('Protect Your Digital Treasure!', 300, 75);

    // Add some stars for decoration
    ctx.fillStyle = '#FFD700';
    ctx.font = '20px Arial';
    ctx.fillText('â­', 50, 50);
    ctx.fillText('â­', 550, 50);
    ctx.fillText('â­', 50, 350);
    ctx.fillText('â­', 550, 350);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}

    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Draw the coloring page outline
    drawColoringPage(ctx);
  }, []);

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {return { x: 0, y: 0 };}

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      // Mouse event
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    drawAt(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {return;}
    e.preventDefault();
    const pos = getEventPos(e);
    drawAt(pos.x, pos.y);
  };

  const drawAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}

    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}

    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Allow keyboard users to "draw" by pressing Enter or Space
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = rect.width / 2;
        const y = rect.height / 2;
        drawAt(x, y);
      }
    } else if (e.key === 'c' || e.key === 'C') {
      e.preventDefault();
      checkCompletion();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      clearCanvas();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}

    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}

    drawColoringPage(ctx);
    setIsCompleted(false);
    setScore(0);
    setFeedback(null);
  };

  const checkCompletion = () => {
    // Enhanced completion check - if user has drawn significantly
    const canvas = canvasRef.current;
    if (!canvas) {return;}

    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let coloredPixels = 0;
    let totalPixels = 0;
    
    // Check only the main drawing areas (panda and shield)
    for (let y = 50; y < 350; y++) {
      for (let x = 100; x < 500; x++) {
        const i = (y * canvas.width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Skip background colors
        if (!(r === 232 && g === 245 && b === 232) && // Light green background
            !(r === 248 && g === 249 && b === 250) && // Light gray background
            !(r === 44 && g === 62 && b === 80)) {    // Dark outline
          totalPixels++;
          if (a > 0) {
            coloredPixels++;
          }
        }
      }
    }

    // Calculate completion percentage
    const completionPercentage = totalPixels > 0 ? (coloredPixels / totalPixels) * 100 : 0;
    
    // If more than 30% of the drawing area is colored, consider it complete
    if (completionPercentage > 30) {
      const finalScore = Math.min(100, Math.round(completionPercentage));
      setScore(finalScore);
      setIsCompleted(true);
      setFeedback(null);
      onComplete(finalScore);
    } else {
      setFeedback(`Keep coloring! About ${Math.round(completionPercentage)}% filled â€” add more color to the panda and shield.`);
    }
  };

  return (
    <ActivityGameShell
      titleId="coloring-title"
      title="Color Privacy Panda"
      subtitle="Color the panda and shield â€” then check when you're proud of it."
      titleIcon={<Palette className="h-5 w-5" aria-hidden="true" />}
      onClose={onClose}
      progressPercent={isCompleted ? 100 : score}
      progressLeft={isCompleted ? 'Complete!' : 'Paint the panda & shield'}
      progressRight={score > 0 ? `Score: ${score}%` : 'Tap Done when ready'}
      headerGradient="from-rose-500 to-pink-500"
      maxWidthClass="max-w-3xl"
      footer={
        <>
          <button type="button" onClick={clearCanvas} className={shellBtn}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
          <button type="button" onClick={checkCompletion} className={shellBtnPrimary}>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            I&apos;m done
          </button>
        </>
      }
      completed={
        isCompleted
          ? {
              title: 'Beautiful work!',
              message: `Your Privacy Panda artwork scored ${score}%.`,
              submessage: 'The shield stands for protecting people you trust online.',
              onPlayAgain: clearCanvas,
              onDone: onClose,
              icon: <Sparkles className="h-8 w-8 text-rose-500 dark:text-rose-400" aria-hidden="true" />,
            }
          : undefined
      }
    >
      {context && <ActivityPurposeBanner context={context} />}

      <div className="flex flex-col gap-4 lg:flex-row">
        <aside className="shrink-0 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 lg:w-48">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Colors</p>
          <div className="mb-4 grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                aria-label={`Select color ${color}`}
                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  selectedColor === color ? 'border-gray-900 ring-2 ring-offset-2 dark:border-white' : 'border-white/50'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Brush size
          </label>
          <input
            type="range"
            min={5}
            max={25}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            aria-label="Brush size"
            className="w-full accent-rose-500"
          />
          <p className="mt-1 text-center text-xs text-gray-500">{brushSize}px</p>
        </aside>

        <div className="flex flex-1 justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-3 dark:from-gray-800 dark:to-gray-950">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onKeyDown={handleKeyDown}
            className="h-auto max-w-full cursor-crosshair rounded-xl bg-white shadow-md"
            style={{ touchAction: 'none' }}
            role="img"
            aria-label="Privacy Panda coloring page. Draw with mouse or touch. Press C to check completion, R to reset."
            tabIndex={0}
          />
        </div>
      </div>

      {feedback && (
        <p role="status" className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
          {feedback}
        </p>
      )}
    </ActivityGameShell>
  );
};

export default ColoringActivity;
