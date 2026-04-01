import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface StorySceneProps {
  sceneId: string;
  title: string;
  background?: 'forest' | 'cave' | 'meadow' | 'river' | 'mountain' | 'village' | 'digital';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  weather?: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy';
  mood?: 'happy' | 'mysterious' | 'tense' | 'peaceful' | 'exciting' | 'scary';
  children: React.ReactNode;
  onSceneEnter?: () => void;
  onSceneExit?: () => void;
}

const StoryScene: React.FC<StorySceneProps> = ({
  sceneId,
  title,
  background = 'forest',
  timeOfDay = 'morning',
  weather = 'sunny',
  mood = 'peaceful',
  children,
  onSceneEnter,
  onSceneExit
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    setIsVisible(false);
    
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    
    const transitionTimer = setTimeout(() => {
      setIsTransitioning(false);
      onSceneEnter?.();
    }, 800);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(transitionTimer);
      onSceneExit?.();
    };
  }, [sceneId, onSceneEnter, onSceneExit]);

  const backgroundStyles = {
    forest: {
      background: 'linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #6b8e23 100%)',
      backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><defs><pattern id=\'trees\' width=\'20\' height=\'30\' patternUnits=\'userSpaceOnUse\'><rect width=\'4\' height=\'20\' fill=\'%23333\'/><polygon points=\'2,0 8,0 5,15\' fill=\'%234CAF50\'/></pattern></defs><rect width=\'100%\' height=\'100%\' fill=\'url(%23trees)\'/></svg>")'
    },
    cave: {
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%)',
      backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><defs><pattern id=\'cave\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'><circle cx=\'20\' cy=\'20\' r=\'15\' fill=\'none\' stroke=\'%23555\' stroke-width=\'2\'/></pattern></defs><rect width=\'100%\' height=\'100%\' fill=\'url(%23cave)\'/></svg>")'
    },
    meadow: {
      background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #90EE90 100%)',
      backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><defs><pattern id=\'grass\' width=\'10\' height=\'10\' patternUnits=\'userSpaceOnUse\'><rect width=\'1\' height=\'6\' fill=\'%234CAF50\'/><circle cx=\'5\' cy=\'8\' r=\'1\' fill=\'%23FFD700\'/></pattern></defs><rect width=\'100%\' height=\'100%\' fill=\'url(%23grass)\'/></svg>")'
    },
    river: {
      background: 'linear-gradient(135deg, #4682B4 0%, #5F9EA0 50%, #87CEEB 100%)',
      backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><defs><pattern id=\'water\' width=\'20\' height=\'20\' patternUnits=\'userSpaceOnUse\'><path d=\'M0,10 Q10,5 20,10 T40,10\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'1\' opacity=\'0.3\'/></pattern></defs><rect width=\'100%\' height=\'100%\' fill=\'url(%23water)\'/></svg>")'
    },
    mountain: {
      background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #D2B48C 100%)',
      backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><defs><pattern id=\'mountains\' width=\'30\' height=\'30\' patternUnits=\'userSpaceOnUse\'><polygon points=\'0,30 15,10 30,30\' fill=\'%23666\'/></pattern></defs><rect width=\'100%\' height=\'100%\' fill=\'url(%23mountains)\'/></svg>")'
    },
    village: {
      background: 'linear-gradient(135deg, #DEB887 0%, #F4A460 50%, #D2691E 100%)',
      backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><defs><pattern id=\'houses\' width=\'25\' height=\'25\' patternUnits=\'userSpaceOnUse\'><rect width=\'15\' height=\'15\' fill=\'%238B4513\'/><polygon points=\'7,0 15,8 0,8\' fill=\'%23DC143C\'/><rect width=\'3\' height=\'8\' x=\'6\' y=\'7\' fill=\'%23FFD700\'/></pattern></defs><rect width=\'100%\' height=\'100%\' fill=\'url(%23houses)\'/></svg>")'
    },
    digital: {
      background: 'linear-gradient(135deg, #000080 0%, #4169E1 50%, #00BFFF 100%)',
      backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><defs><pattern id=\'circuits\' width=\'20\' height=\'20\' patternUnits=\'userSpaceOnUse\'><rect width=\'2\' height=\'2\' fill=\'%2300FFFF\'/><path d=\'M2,2 L8,2 L8,8 L2,8 Z\' fill=\'none\' stroke=\'%2300FFFF\' stroke-width=\'0.5\'/></pattern></defs><rect width=\'100%\' height=\'100%\' fill=\'url(%23circuits)\'/></svg>")'
    }
  };

  const timeOfDayStyles = {
    morning: { filter: 'brightness(1.2) saturate(1.1)' },
    afternoon: { filter: 'brightness(1.1) saturate(1.2)' },
    evening: { filter: 'brightness(0.8) saturate(1.3) hue-rotate(20deg)' },
    night: { filter: 'brightness(0.4) saturate(0.8) hue-rotate(200deg)' }
  };

  const weatherStyles = {
    sunny: { filter: 'brightness(1.3) saturate(1.2)' },
    cloudy: { filter: 'brightness(0.9) saturate(0.8)' },
    rainy: { filter: 'brightness(0.7) saturate(0.9) hue-rotate(180deg)' },
    stormy: { filter: 'brightness(0.5) saturate(1.1) hue-rotate(200deg)' },
    foggy: { filter: 'brightness(0.8) saturate(0.6) blur(1px)' }
  };

  const moodStyles = {
    happy: { filter: 'brightness(1.2) saturate(1.3)' },
    mysterious: { filter: 'brightness(0.8) saturate(0.9) hue-rotate(280deg)' },
    tense: { filter: 'brightness(0.9) saturate(1.4) hue-rotate(10deg)' },
    peaceful: { filter: 'brightness(1.1) saturate(1.1)' },
    exciting: { filter: 'brightness(1.3) saturate(1.5)' },
    scary: { filter: 'brightness(0.6) saturate(1.2) hue-rotate(300deg)' }
  };

  const sceneStyle = {
    ...backgroundStyles[background],
    ...timeOfDayStyles[timeOfDay],
    ...weatherStyles[weather],
    ...moodStyles[mood]
  };

  return (
    <div className="story-scene-container">
      <div
        className={`scene-background ${isTransitioning ? 'transitioning' : ''} ${isVisible ? 'visible' : ''}`}
        style={sceneStyle}
      >
        <div className="scene-overlay">
          <div className="scene-content">
            <h2 className="scene-title">{title}</h2>
            <div className="scene-body">
              {children}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .story-scene-container {
          position: relative;
          width: 100%;
          min-height: 400px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin: 1rem 0;
        }

        .scene-background {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 500px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: scale(1.1) translateY(20px);
          filter: blur(2px);
        }

        .scene-background.transitioning {
          opacity: 0.6;
          transform: scale(1.05) translateY(10px);
          filter: blur(1px);
        }

        .scene-background.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
          filter: blur(0);
        }

        .scene-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.1) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .scene-content {
          background: ${theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)'};
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 3rem;
          max-width: 700px;
          width: 100%;
          text-align: center;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1);
          border: 2px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'};
          animation: contentAppear 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
          position: relative;
          overflow: hidden;
        }

        .scene-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: shimmer 2s ease-in-out 0.8s;
        }

        .scene-title {
          font-size: 2.8rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: ${theme === 'dark' ? 'var(--gray-100)' : 'var(--gray-800)'};
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: titleSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
        }

        .scene-body {
          color: ${theme === 'dark' ? 'var(--gray-200)' : 'var(--gray-700)'};
          font-size: 1.1rem;
          line-height: 1.8;
          text-align: left;
        }

        @keyframes contentAppear {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes titleSlideIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .scene-content {
            padding: 1.5rem;
            margin: 1rem;
          }

          .scene-title {
            font-size: 2rem;
          }

          .scene-body {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StoryScene;