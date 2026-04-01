import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Download, CheckCircle } from 'lucide-react';

interface ColoringActivityProps {
  onComplete: () => void;
  onClose: () => void;
}

const ColoringActivity: React.FC<ColoringActivityProps> = ({ onComplete, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(10);
  const [isCompleted, setIsCompleted] = useState(false);

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
    ctx.fillText('🔒', 300, 320);

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
    ctx.fillText('⭐', 50, 50);
    ctx.fillText('⭐', 550, 50);
    ctx.fillText('⭐', 50, 350);
    ctx.fillText('⭐', 550, 350);
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
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}

    const link = document.createElement('a');
    link.download = 'privacy-panda-coloring.png';
    link.href = canvas.toDataURL();
    link.click();
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
      setIsCompleted(true);
      // Calculate score based on completion percentage (capped at 100)
      const finalScore = Math.min(100, Math.round(completionPercentage));
      onComplete(finalScore);
      
      // Add celebration animation
      setTimeout(() => {
        const celebration = document.createElement('div');
        celebration.textContent = '🎉🎨✨';
        celebration.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 48px;
          z-index: 10000;
          pointer-events: none;
          animation: celebrate 2s ease-out forwards;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
          @keyframes celebrate {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1) translateY(-100px); }
          }
        `;
        document.head.appendChild(style);
        document.body.appendChild(celebration);
        
        setTimeout(() => {
          document.body.removeChild(celebration);
          document.head.removeChild(style);
        }, 2000);
      }, 100);
    } else {
      // Show progress feedback
      const progressMessage = `Keep coloring! You've filled ${Math.round(completionPercentage)}% of the drawing area.`;
      alert(progressMessage);
    }
  };

  return (
    <div className="coloring-activity">
      <div className="activity-header">
        <h2 className="activity-title">Privacy Panda Coloring Activity</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="activity-content">
        <div className="tools-panel">
          <div className="color-palette">
            <h3>Colors</h3>
            <div className="colors-grid">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`color-button ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="brush-controls">
            <h3>Brush Size</h3>
            <input
              type="range"
              min="5"
              max="25"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="brush-slider"
            />
            <span className="brush-size">{brushSize}px</span>
          </div>

          <div className="action-buttons">
            <button onClick={clearCanvas} className="action-button">
              <RotateCcw size={16} />
              Clear
            </button>
            <button onClick={downloadImage} className="action-button">
              <Download size={16} />
              Download
            </button>
            <button onClick={checkCompletion} className="action-button primary">
              <CheckCircle size={16} />
              Check Complete
            </button>
          </div>
        </div>

        <div className="canvas-container">
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
            className="coloring-canvas"
            style={{ touchAction: 'none' }}
            role="img"
            aria-label="Privacy Panda coloring page with panda and shield outline. Use mouse or touch to color, or press Enter or Space to add color. Press C to check completion, R to reset."
            tabIndex={0}
          />
          {isCompleted && (
            <div className="completion-overlay">
              <div className="completion-message">
                <CheckCircle size={48} className="success-icon" />
                <h3>Great Job!</h3>
                <p>You've completed the Privacy Panda coloring activity!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .coloring-activity {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          z-index: 1000;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: white;
          border-bottom: 1px solid #e0e0e0;
        }

        .activity-title {
          margin: 0;
          color: #2C3E50;
          font-size: 24px;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .activity-content {
          display: flex;
          flex: 1;
          background: white;
        }

        .tools-panel {
          width: 250px;
          padding: 20px;
          background: #f8f9fa;
          border-right: 1px solid #e0e0e0;
          overflow-y: auto;
        }

        .color-palette h3,
        .brush-controls h3 {
          margin: 0 0 15px 0;
          color: #2C3E50;
          font-size: 16px;
        }

        .colors-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 30px;
        }

        .color-button {
          width: 40px;
          height: 40px;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .color-button:hover {
          transform: scale(1.1);
        }

        .color-button.selected {
          border-color: #2C3E50;
          transform: scale(1.1);
        }

        .brush-controls {
          margin-bottom: 30px;
        }

        .brush-slider {
          width: 100%;
          margin: 10px 0;
        }

        .brush-size {
          display: block;
          text-align: center;
          color: #666;
          font-size: 14px;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .action-button:hover {
          background: #f0f0f0;
        }

        .action-button.primary {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }

        .action-button.primary:hover {
          background: #45a049;
        }

        .canvas-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
        }

        .coloring-canvas {
          border: 2px solid #ddd;
          border-radius: 8px;
          cursor: crosshair;
          background: white;
        }

        .completion-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }

        .completion-message {
          background: white;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .success-icon {
          color: #4CAF50;
          margin-bottom: 20px;
        }

        .completion-message h3 {
          margin: 0 0 10px 0;
          color: #2C3E50;
          font-size: 24px;
        }

        .completion-message p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .activity-content {
            flex-direction: column;
          }

          .tools-panel {
            width: 100%;
            height: auto;
            max-height: 250px;
            overflow-y: auto;
            padding: 15px;
          }

          .colors-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
          }

          .color-button {
            width: 35px;
            height: 35px;
            min-width: 35px;
            min-height: 35px;
          }

          .action-buttons {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 8px;
          }

          .action-button {
            flex: 1;
            min-width: 80px;
            padding: 10px 12px;
            font-size: 13px;
          }

          .coloring-canvas {
            width: 100%;
            max-width: 350px;
            height: 250px;
            touch-action: none;
          }

          .canvas-container {
            padding: 15px;
            min-height: 300px;
          }
        }

        @media (max-width: 480px) {
          .tools-panel {
            max-height: 200px;
            padding: 10px;
          }

          .colors-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 6px;
          }

          .color-button {
            width: 30px;
            height: 30px;
            min-width: 30px;
            min-height: 30px;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-button {
            width: 100%;
            margin-bottom: 5px;
          }

          .coloring-canvas {
            max-width: 300px;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default ColoringActivity;