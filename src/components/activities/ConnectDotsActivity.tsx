import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, CheckCircle, Download } from 'lucide-react';

interface ConnectDotsActivityProps {
  onComplete: (score?: number) => void;
  onClose: () => void;
}

interface Dot {
  id: number;
  x: number;
  y: number;
  connected: boolean;
  order?: number;
}

const ConnectDotsActivity: React.FC<ConnectDotsActivityProps> = ({ onComplete, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dots, setDots] = useState<Dot[]>([]);
  const [connectedDots, setConnectedDots] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentDot, setCurrentDot] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const generateDots = () => {
    // Create a shield shape with dots
    const newDots: Dot[] = [
      { id: 1, x: 300, y: 100, connected: false },
      { id: 2, x: 250, y: 150, connected: false },
      { id: 3, x: 200, y: 200, connected: false },
      { id: 4, x: 200, y: 250, connected: false },
      { id: 5, x: 200, y: 300, connected: false },
      { id: 6, x: 200, y: 350, connected: false },
      { id: 7, x: 250, y: 400, connected: false },
      { id: 8, x: 300, y: 420, connected: false },
      { id: 9, x: 350, y: 400, connected: false },
      { id: 10, x: 400, y: 350, connected: false },
      { id: 11, x: 400, y: 300, connected: false },
      { id: 12, x: 400, y: 250, connected: false },
      { id: 13, x: 400, y: 200, connected: false },
      { id: 14, x: 350, y: 150, connected: false },
      { id: 15, x: 300, y: 100, connected: false }, // Close the shape
    ];

    setDots(newDots);
    setConnectedDots([]);
    setIsCompleted(false);
    setCurrentDot(null);
    setMoves(0);
    setStartTime(new Date());
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}

    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}

    canvas.width = 600;
    canvas.height = 500;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Privacy Shield Connect the Dots', 300, 40);

    // Draw instructions
    ctx.font = '16px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('Connect the dots in order to reveal Privacy Panda\'s protection shield!', 300, 70);

    // Draw connected lines
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i < connectedDots.length - 1; i++) {
      const dot1 = dots.find(d => d.id === connectedDots[i]);
      const dot2 = dots.find(d => d.id === connectedDots[i + 1]);

      if (dot1 && dot2) {
        if (i === 0) {
          ctx.moveTo(dot1.x, dot1.y);
        }
        ctx.lineTo(dot2.x, dot2.y);
      }
    }
    ctx.stroke();

    // Draw dots
    dots.forEach((dot) => {
      const isConnected = connectedDots.includes(dot.id);
      const isCurrent = currentDot === dot.id;

      // Dot circle
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, isConnected ? 12 : 8, 0, 2 * Math.PI);
      ctx.fillStyle = isConnected ? '#4CAF50' : (isCurrent ? '#FFD700' : '#2C3E50');
      ctx.fill();

      // Dot border
      ctx.strokeStyle = isConnected ? '#2E7D32' : '#2C3E50';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dot number
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dot.id.toString(), dot.x, dot.y);
    });

    // Draw completion message
    if (isCompleted) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#4CAF50';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Shield Complete!', 300, 200);

      ctx.fillStyle = 'white';
      ctx.font = '18px Arial';
      ctx.fillText('Privacy Panda\'s protection shield is now active!', 300, 240);
    }
  }, [dots, connectedDots, currentDot, isCompleted]);

  useEffect(() => {
    generateDots();
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleDotClick = (dotId: number) => {
    if (isCompleted) {return;}

    const dot = dots.find(d => d.id === dotId);
    if (!dot) {return;}

    setMoves(prev => prev + 1);

    // Check if this is the next dot in sequence
    const expectedNext = connectedDots.length === 0 ? 1 : connectedDots[connectedDots.length - 1] + 1;

    if (dotId === expectedNext || (connectedDots.length === 0 && dotId === 1)) {
      setConnectedDots(prev => [...prev, dotId]);
      setCurrentDot(dotId);

      // Check if all dots are connected
      if (connectedDots.length + 1 === dots.length - 1) { // -1 because last dot is duplicate
        setTimeout(() => {
          setIsCompleted(true);
          // Calculate score based on efficiency and accuracy
          const timeSpent = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0;
          const totalDots = dots.length - 1; // Exclude duplicate
          const accuracy = Math.round((totalDots / moves) * 100);
          const timeBonus = Math.max(0, Math.round((60 - timeSpent) / 60 * 30)); // Bonus for speed
          const finalScore = Math.min(100, Math.max(0, accuracy + timeBonus));
          onComplete(finalScore);
        }, 500);
      }
    } else {
      // Wrong dot - show feedback
      setCurrentDot(dotId);
      setTimeout(() => setCurrentDot(null), 200);
    }
  };

  const resetActivity = () => {
    generateDots();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}

    const link = document.createElement('a');
    link.download = 'privacy-shield-connect-dots.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="connect-dots-activity">
      <div className="activity-header">
        <h2 className="activity-title">Privacy Shield Connect the Dots</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="activity-content">
        <div className="instructions">
          <p>Connect the dots in numerical order to reveal Privacy Panda's protection shield!</p>
          <div className="progress">
            Connected: {connectedDots.length} / {dots.length - 1} dots
          </div>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            className="connect-dots-canvas"
            onClick={(e) => {
              if (isCompleted) {return;}

              const rect = canvasRef.current?.getBoundingClientRect();
              if (!rect) {return;}

              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              // Find clicked dot
              const clickedDot = dots.find(dot => {
                const distance = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
                return distance <= 15;
              });

              if (clickedDot) {
                handleDotClick(clickedDot.id);
              }
            }}
          />

          {isCompleted && (
            <div className="completion-overlay">
              <div className="completion-message">
                <CheckCircle size={48} className="success-icon" />
                <h3>Shield Complete!</h3>
                <p>You've successfully connected all the dots!</p>
                <p>Privacy Panda's protection shield is now active and ready to guard your digital privacy!</p>
              </div>
            </div>
          )}
        </div>

        <div className="controls">
          <button onClick={resetActivity} className="control-button">
            <RotateCcw size={16} />
            Reset
          </button>
          <button onClick={downloadImage} className="control-button">
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      <style jsx>{`
        .connect-dots-activity {
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
          flex: 1;
          background: white;
          display: flex;
          flex-direction: column;
        }

        .instructions {
          padding: 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .instructions p {
          margin: 0 0 15px 0;
          color: #2C3E50;
          font-size: 16px;
        }

        .progress {
          font-size: 16px;
          font-weight: bold;
          color: #4CAF50;
        }

        .canvas-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
        }

        .connect-dots-canvas {
          border: 2px solid #ddd;
          border-radius: 8px;
          background: white;
          cursor: crosshair;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
          max-width: 400px;
        }

        .success-icon {
          color: #4CAF50;
          margin-bottom: 20px;
        }

        .completion-message h3 {
          margin: 0 0 15px 0;
          color: #2C3E50;
          font-size: 24px;
        }

        .completion-message p {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 16px;
        }

        .controls {
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .control-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
        }

        .control-button:hover {
          background: #f0f0f0;
        }

        @media (max-width: 768px) {
          .canvas-container {
            padding: 10px;
          }

          .connect-dots-canvas {
            max-width: 100%;
            height: auto;
          }

          .controls {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ConnectDotsActivity;