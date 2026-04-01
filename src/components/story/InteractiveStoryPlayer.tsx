import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, ChevronLeft, ChevronRight, Settings, BookOpen, Grid } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface StoryScene {
  id: string;
  title: string;
  content: string;
  character?: string;
  animation?: string;
  imageUrl?: string;
  choices?: Array<{
    text: string;
    nextScene: string;
    consequence?: string;
  }>;
  audioUrl?: string;
  duration?: number;
  background?: string;
  timeOfDay?: string;
  weather?: string;
  mood?: string;
}

interface InteractiveStoryPlayerProps {
  scenes: StoryScene[];
  onSceneChange?: (sceneId: string) => void;
  onStoryComplete?: () => void;
  onChoiceMade?: (choice: { text: string; nextScene: string; consequence?: string }) => void;
  hideControls?: boolean;
  currentSceneIndex?: number;
  onSceneIndexChange?: (index: number) => void;
  initialViewMode?: 'interactive' | 'fulltext';
}

const InteractiveStoryPlayer: React.FC<InteractiveStoryPlayerProps> = ({
  scenes,
  onSceneChange,
  onStoryComplete,
  onChoiceMade,
  hideControls = false,
  currentSceneIndex: controlledSceneIndex,
  onSceneIndexChange,
  initialViewMode = 'interactive'
}) => {
  const { theme } = useTheme();
  const [internalSceneIndex, setInternalSceneIndex] = useState(0);
  
  // Use controlled index if provided, otherwise use internal state
  const currentSceneIndex = controlledSceneIndex !== undefined ? controlledSceneIndex : internalSceneIndex;
  const setCurrentSceneIndex = onSceneIndexChange || setInternalSceneIndex;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [speechVoice, setSpeechVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [viewMode, setViewMode] = useState<'interactive' | 'fulltext'>(initialViewMode);
  const [isMobile, setIsMobile] = useState(false);
  const [showGestureHint, setShowGestureHint] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const skipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Safely get current scene (may be undefined)
  const currentScene = scenes && scenes.length > 0 ? scenes[currentSceneIndex] : null;
  const hasValidScenes = scenes && scenes.length > 0;
  
  // Ensure currentSceneIndex is within bounds
  useEffect(() => {
    if (hasValidScenes && (currentSceneIndex < 0 || currentSceneIndex >= scenes.length)) {
      setCurrentSceneIndex(0);
    }
  }, [currentSceneIndex, scenes?.length, setCurrentSceneIndex, hasValidScenes]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || ('ontouchstart' in window));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide gesture hint after first interaction or after 5 seconds
  useEffect(() => {
    if (isMobile && showGestureHint) {
      const timer = setTimeout(() => setShowGestureHint(false), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isMobile, showGestureHint]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Auto-select a good default voice if none selected
      if (!speechVoice && voices.length > 0) {
        // Try to find an English voice, preferring female voices for storytelling
        const preferredVoice = voices.find(v => 
          v.lang.startsWith('en') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha'))
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        setSpeechVoice(preferredVoice);
      }
    };

    // Load voices immediately
    loadVoices();
    
    // Also load when voices change (some browsers load them asynchronously)
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [speechVoice]);

  const nextScene = useCallback(() => {
    if (currentSceneIndex < scenes.length - 1) {
      setIsLoading(true);
      const nextIndex = currentSceneIndex + 1;
      
      // Clear any existing skip timeout
      if (skipTimeoutRef.current) {
        clearTimeout(skipTimeoutRef.current);
      }
      
      // Show skip button after 2 seconds
      setShowSkipButton(true);
      skipTimeoutRef.current = setTimeout(() => {
        setShowSkipButton(false);
      }, 5000);
      
      // Simulate loading time for better UX
      setTimeout(() => {
        const nextScene = scenes[nextIndex];
        if (nextScene) {
          setCurrentSceneIndex(nextIndex);
          setSelectedChoice(null);
          setIsLoading(false);
          setShowSkipButton(false);
          onSceneChange?.(nextScene.id);
        }
      }, 800);
    } else {
      onStoryComplete?.();
    }
  }, [currentSceneIndex, scenes, onSceneChange, onStoryComplete, setCurrentSceneIndex]);

  // Auto-advance functionality - wait for text-to-speech to complete
  useEffect(() => {
    if (isPlaying && autoAdvance && currentScene?.content) {
      // If text-to-speech is available and playing, wait for it to complete
      if ('speechSynthesis' in window && !isMuted) {
        // The speech synthesis will trigger nextScene() via its onend callback
        return undefined;
      }
      
      // Fallback to duration-based timing if no text-to-speech
      const timer = setTimeout(() => {
        nextScene();
      }, (currentScene.duration || 8) * 1000 / readingSpeed);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isPlaying, autoAdvance, currentScene?.content, currentScene?.duration, readingSpeed, nextScene, isMuted]);

  // Audio playback
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = readingSpeed;
      if (isMuted) {
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = 0.7;
      }
    }
  }, [readingSpeed, isMuted]);

  // Character animation
  useEffect(() => {
    if (currentScene?.animation && animationRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentScene?.animation]);

  // Text-to-speech functionality
  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.volume = isMuted ? 0 : 0.8;
      
      if (speechVoice) {
        utterance.voice = speechVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // Auto-advance to next scene when speech completes (if auto-advance is enabled)
        if (isPlaying && autoAdvance) {
          nextScene();
        }
      };
      utterance.onerror = () => setIsSpeaking(false);
      
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [speechRate, speechPitch, speechVoice, isMuted, isPlaying, autoAdvance, nextScene]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Define functions using useCallback to avoid temporal dead zone issues
  const togglePlay = useCallback(() => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    if (audioRef.current) {
      if (newIsPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
    
    // Handle text-to-speech
    if (currentScene?.content) {
      if (newIsPlaying) {
        speakText(currentScene.content);
      } else {
        stopSpeaking();
      }
    }
  }, [isPlaying, currentScene?.content, speakText, stopSpeaking]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const resetStory = useCallback(() => {
    setCurrentSceneIndex(0);
    setIsPlaying(false);
    setSelectedChoice(null);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [setCurrentSceneIndex]);

  const prevScene = useCallback(() => {
    if (currentSceneIndex > 0) {
      const prevIndex = currentSceneIndex - 1;
      const prevScene = scenes[prevIndex];
      if (prevScene) {
        setCurrentSceneIndex(prevIndex);
        setSelectedChoice(null);
        onSceneChange?.(prevScene.id);
      }
    }
  }, [currentSceneIndex, scenes, onSceneChange, setCurrentSceneIndex]);

  const handleChoice = useCallback((choice: { text: string; nextScene: string; consequence?: string }) => {
    setSelectedChoice(choice.text);
    onChoiceMade?.(choice);
    const nextSceneIndex = scenes.findIndex(scene => scene.id === choice.nextScene);
    if (nextSceneIndex !== -1) {
      setTimeout(() => {
        setCurrentSceneIndex(nextSceneIndex);
        onSceneChange?.(choice.nextScene);
      }, 1000);
    }
  }, [scenes, onSceneChange, onChoiceMade, setCurrentSceneIndex]);

  // Auto-speak when scene changes
  useEffect(() => {
    if (currentScene?.content && isPlaying) {
      speakText(currentScene.content);
    }
    
    return () => {
      stopSpeaking();
    };
  }, [currentScene?.content, isPlaying, speakText, stopSpeaking]);

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setTouchStart({ x: touch.clientX, y: touch.clientY });
      setTouchEnd(null);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setTouchEnd({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      return;
    }
    
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const minSwipeDistance = 50;
    
    // Hide gesture hint on first interaction
    if (showGestureHint) {
      setShowGestureHint(false);
    }
    
    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - previous scene
        prevScene();
      } else {
        // Swipe left - next scene (if no choices)
        if (!currentScene?.choices || currentScene.choices.length === 0) {
          nextScene();
        }
      }
    }
    
    // Vertical swipe up - toggle play/pause
    if (deltaY < -minSwipeDistance && Math.abs(deltaY) > Math.abs(deltaX)) {
      togglePlay();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isLoading) {
        return;
      }
      
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          if (currentScene?.choices && currentScene.choices.length > 0) {
            // Don't auto-advance if there are choices
            return;
          }
          nextScene();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevScene();
          break;
        case 'Enter':
          event.preventDefault();
          if (currentScene?.choices && currentScene.choices.length > 0) {
            // Select first choice if available
            const firstChoice = currentScene.choices[0];
            if (firstChoice) {
              handleChoice(firstChoice);
            }
          } else {
            nextScene();
          }
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          togglePlay();
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          toggleMute();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          resetStory();
          break;
        case 's':
        case 'S':
          event.preventDefault();
          setShowSettings(!showSettings);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isLoading, currentScene, nextScene, prevScene, togglePlay, toggleMute, resetStory, showSettings]);

  const progress = hasValidScenes ? ((currentSceneIndex + 1) / scenes.length) * 100 : 0;

  // Safety check: ensure we have valid scenes (after all hooks)
  if (!hasValidScenes) {
    return (
      <div className="interactive-story-player" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>No story scenes available. Please check the story data.</p>
      </div>
    );
  }

  // Safety check: ensure current scene exists
  if (!currentScene) {
    return (
      <div className="interactive-story-player" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Scene not found. Please check the story data.</p>
      </div>
    );
  }

  return (
    <div className="interactive-story-player">
      {/* Audio element */}
      {currentScene?.audioUrl && (
        <audio
          ref={audioRef}
          src={currentScene.audioUrl}
          loop={false}
          onEnded={() => {
            if (autoAdvance) {
              nextScene();
            } else {
              setIsPlaying(false);
            }
          }}
        />
      )}

      {/* Enhanced Header with Controls */}
      {!hideControls && (
        <div className="story-header">
          <div className="story-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="progress-text">
              Scene {currentSceneIndex + 1} of {scenes.length}
            </span>
          </div>

          <div className="story-controls">
            <button
              onClick={prevScene}
              disabled={currentSceneIndex === 0}
              className="control-btn"
              title="Previous Scene"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={togglePlay}
              className="control-btn play-btn"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              onClick={nextScene}
              disabled={currentSceneIndex === scenes.length - 1}
              className="control-btn"
              title="Next Scene"
            >
              <ChevronRight size={20} />
            </button>

            <button
              onClick={toggleMute}
              className="control-btn"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="control-btn"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'interactive' ? 'fulltext' : 'interactive')}
              className="control-btn"
              title={viewMode === 'interactive' ? 'View Full Story' : 'View Interactive'}
            >
              {viewMode === 'interactive' ? <BookOpen size={20} /> : <Grid size={20} />}
            </button>

            <button
              onClick={resetStory}
              className="control-btn"
              title="Reset Story"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Settings panel */}
      {showSettings && (
        <div className="story-settings">
          <div className="setting-group">
            <label>🎭 Current Voice</label>
            <div style={{ 
              padding: '0.75rem', 
              background: 'var(--light)', 
              borderRadius: '0.5rem', 
              border: '2px solid var(--primary)',
              marginBottom: '1rem'
            }}>
              <strong>{speechVoice?.name?.split(' ').slice(0, 2).join(' ') || 'System Default'}</strong>
              {speechVoice && (
                <span style={{ display: 'block', fontSize: '0.875rem', opacity: 0.7, marginTop: '0.25rem' }}>
                  Language: {speechVoice.lang}
                </span>
              )}
            </div>
          </div>
          <div className="setting-group">
            <label>Reading Speed</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={readingSpeed}
              onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
            />
            <span>{readingSpeed}x</span>
          </div>
          <div className="setting-group">
            <label>
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
              />
              Auto-advance
            </label>
          </div>
          <div className="setting-group">
            <label>Speech Rate</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            />
            <span>{speechRate}x</span>
          </div>
          <div className="setting-group">
            <label>Speech Pitch</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechPitch}
              onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
            />
            <span>{speechPitch}x</span>
          </div>
          <div className="setting-group">
            <label>Voice Selection</label>
            <select
              value={speechVoice?.name || ''}
              onChange={(e) => {
                const selectedVoice = availableVoices.find(v => v.name === e.target.value);
                setSpeechVoice(selectedVoice || null);
              }}
              className="voice-selector"
            >
              <option value="">System Default</option>
              
              {/* English voices - most common for storytelling */}
              {availableVoices.filter(v => v.lang.startsWith('en')).length > 0 && (
                <optgroup label="📖 English Voices (Recommended)">
                  {availableVoices
                    .filter(v => v.lang.startsWith('en'))
                    .map((voice, index) => (
                      <option key={`en-${index}`} value={voice.name}>
                        {voice.name.split(' ').slice(0, 2).join(' ')} ({voice.lang})
                      </option>
                    ))}
                </optgroup>
              )}
              
              {/* Other languages */}
              {availableVoices.filter(v => !v.lang.startsWith('en')).length > 0 && (
                <optgroup label="🌍 Other Languages">
                  {availableVoices
                    .filter(v => !v.lang.startsWith('en'))
                    .sort((a, b) => a.lang.localeCompare(b.lang))
                    .map((voice, index) => (
                      <option key={`other-${index}`} value={voice.name}>
                        {voice.name.split(' ').slice(0, 2).join(' ')} ({voice.lang})
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
            <small style={{ display: 'block', marginTop: '0.5rem', opacity: 0.7 }}>
              {availableVoices.length} voices available on your device
            </small>
          </div>
          <div className="setting-group">
            <label>Test Voice Settings</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => currentScene?.content && speakText(currentScene.content)}
                disabled={isSpeaking}
                className="speech-button"
                style={{ flex: '1 1 auto' }}
              >
                {isSpeaking ? '🔊 Speaking...' : '🎤 Test Current Scene'}
              </button>
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="speech-button stop"
                  style={{ flex: '0 0 auto' }}
                >
                  ⏹️ Stop
                </button>
              )}
            </div>
            <small style={{ display: 'block', marginTop: '0.5rem', opacity: 0.7 }}>
              Adjust voice, speed, and pitch above, then test here
            </small>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading next scene...</p>
          </div>
        </div>
      )}

      {/* Skip button */}
      {showSkipButton && !isLoading && (
        <div className="skip-button-container">
          <button
            onClick={nextScene}
            className="skip-button"
            title="Skip to next scene (Space or →)"
          >
            Skip Scene
          </button>
        </div>
      )}

      {/* Mobile gesture hint - only show on mobile and when enabled */}
      {isMobile && showGestureHint && (
        <div className="mobile-gesture-hint">
          <div className="gesture-hint-content">
            <span className="gesture-icon">👆</span>
            <span className="gesture-text">Swipe left/right to navigate, swipe up to play/pause</span>
          </div>
        </div>
      )}

      {/* Enhanced Story Content */}
      <div 
        className="story-content"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {viewMode === 'fulltext' ? (
          /* Full Story Text View */
          <div className="full-story-text">
            <div className="full-story-header">
              <h2 className="full-story-title">Privacy Panda and the Digital Bamboo Forest</h2>
              <p className="full-story-intro" style={{ color: theme === 'dark' ? 'var(--gray-300)' : 'var(--gray-600)' }}>
                Join Po the Panda on an adventure through the Digital Bamboo Forest as he learns about privacy, sharing, and staying safe online.
              </p>
            </div>
            <div className="full-story-body" style={{ color: theme === 'dark' ? 'var(--gray-200)' : 'var(--gray-800)' }}>
              {scenes.map((scene, index) => (
                <div key={scene.id} className="full-story-scene">
                  {index > 0 && <div className="scene-divider"></div>}
                  <h3 className="scene-heading">{scene.title}</h3>
                  <p className="scene-paragraph">{scene.content}</p>
                </div>
              ))}
              <div className="story-ending">
                <p className="ending-text">The End</p>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Scene View */
          currentScene && (
            <div className="story-scene">
              <h2 className="scene-title">{currentScene.title}</h2>
              
              {/* Story Image Display */}
              {currentScene.imageUrl && (
                <div className="story-image-container">
                  <img 
                    src={currentScene.imageUrl} 
                    alt={currentScene.title}
                    className="story-image"
                  />
                </div>
              )}
              
              {/* Enhanced Character animation area */}
              {currentScene.character && !currentScene.imageUrl && (
                <div 
                  ref={animationRef}
                  className={`character-display ${isAnimating ? 'animating' : ''} ${isSpeaking ? 'speaking' : ''}`}
                >
                  <div className="character-icon">
                    {currentScene.character === 'panda' && '🐼'}
                    {currentScene.character === 'turtle' && '🐢'}
                    {currentScene.character === 'monkey' && '🐵'}
                    {currentScene.character === 'beaver' && '🦫'}
                    {currentScene.character === 'rabbit' && '🐰'}
                    {currentScene.character === 'owl' && '🦉'}
                    {currentScene.character === 'fox' && '🦊'}
                  </div>
                  {isSpeaking && (
                    <div className="speaking-indicator">
                      <div className="speech-bubble">
                        <div className="bubble-dot"></div>
                        <div className="bubble-dot"></div>
                        <div className="bubble-dot"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Story text */}
              <div 
                ref={textRef}
                className="story-text"
                style={{ 
                  animationDuration: `${2 / readingSpeed}s`,
                  color: theme === 'dark' ? 'var(--gray-200)' : 'var(--gray-800)'
                }}
              >
                {currentScene.content}
              </div>

              {/* Enhanced Interactive choices */}
              {currentScene.choices && currentScene.choices.length > 0 && (
                <div className="story-choices">
                  <h3>What should happen next?</h3>
                  <div className="choices-grid">
                    {currentScene.choices.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => handleChoice(choice)}
                        className={`choice-btn ${selectedChoice === choice.text ? 'selected' : ''}`}
                        disabled={selectedChoice !== null}
                      >
                        {choice.text}
                        {choice.consequence && (
                          <span className="choice-consequence">{choice.consequence}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>

      <style>{`
        .interactive-story-player {
          max-width: 900px;
          margin: 0 auto;
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, #0D1117 0%, #161B22 50%, #1C2128 100%)' 
            : 'white'};
          border-radius: 20px;
          box-shadow: ${theme === 'dark' 
            ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(102, 187, 106, 0.1)' 
            : '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)'};
          overflow: hidden;
          border: ${theme === 'dark' 
            ? '1px solid rgba(102, 187, 106, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.05)'};
          position: relative;
          width: 100%;
        }

        .interactive-story-player::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${theme === 'dark' 
            ? 'linear-gradient(90deg, #66BB6A, #81C784, #4CAF50, #66BB6A)' 
            : 'linear-gradient(90deg, #10b981, #059669, #047857, #065f46)'};
          z-index: 1;
          box-shadow: ${theme === 'dark' 
            ? '0 0 20px rgba(102, 187, 106, 0.5), 0 0 40px rgba(102, 187, 106, 0.3)' 
            : 'none'};
        }

        .story-header {
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, #1a2e1a 0%, #243524 50%, #2d4a2d 100%)' 
            : 'linear-gradient(135deg, var(--primary), var(--primary-light))'};
          color: white;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          border-bottom: ${theme === 'dark' 
            ? '1px solid rgba(102, 187, 106, 0.3)' 
            : 'none'};
        }

        .story-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='dots' width='20' height='20' patternUnits='userSpaceOnUse'><circle cx='10' cy='10' r='1' fill='rgba(255,255,255,0.1)'/></pattern></defs><rect width='100%' height='100%' fill='url(%23dots)'/></svg>");
          opacity: 0.3;
        }

        .story-progress {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: white;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: clamp(0.75rem, 2vw, 0.9rem);
          font-weight: 700;
          white-space: nowrap;
          min-width: fit-content;
          color: #ffffff !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.3);
          background: rgba(0, 0, 0, 0.35);
          padding: 0.35rem 0.85rem;
          border-radius: 12px;
          backdrop-filter: blur(4px);
          letter-spacing: 0.02em;
        }

        .story-controls {
          display: flex;
          gap: 0.5rem;
        }

        .control-btn {
          background: ${theme === 'dark' 
            ? 'rgba(110, 231, 183, 0.12)' 
            : 'rgba(255, 255, 255, 0.15)'};
          border: 1px solid ${theme === 'dark' 
            ? 'rgba(110, 231, 183, 0.25)' 
            : 'rgba(255, 255, 255, 0.2)'};
          color: white;
          padding: 0.75rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          min-width: 44px;
          min-height: 44px;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .control-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, ${theme === 'dark' 
            ? 'rgba(110, 231, 183, 0.25)' 
            : 'rgba(255, 255, 255, 0.2)'}, transparent);
          transition: left 0.5s ease;
        }

        .control-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .control-btn:hover:not(:disabled) {
          background: ${theme === 'dark' 
            ? 'rgba(110, 231, 183, 0.25)' 
            : 'rgba(255, 255, 255, 0.25)'};
          transform: translateY(-2px) scale(1.05);
          box-shadow: ${theme === 'dark' 
            ? '0 4px 20px rgba(110, 231, 183, 0.5), 0 0 24px rgba(110, 231, 183, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.2)'};
          border-color: ${theme === 'dark' 
            ? 'rgba(110, 231, 183, 0.5)' 
            : 'rgba(255, 255, 255, 0.3)'};
        }

        .control-btn:active:not(:disabled) {
          transform: translateY(0) scale(0.95);
        }

        .control-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .play-btn {
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(110, 231, 183, 0.25) 0%, rgba(134, 239, 172, 0.25) 100%)' 
            : 'rgba(255, 255, 255, 0.25)'};
          padding: 1rem;
          border-radius: 50%;
          box-shadow: ${theme === 'dark' 
            ? '0 4px 24px rgba(110, 231, 183, 0.5), 0 0 36px rgba(110, 231, 183, 0.3)' 
            : '0 4px 16px rgba(0, 0, 0, 0.2)'};
          border: ${theme === 'dark' 
            ? '1px solid rgba(110, 231, 183, 0.3)' 
            : 'none'};
        }

        .play-btn:hover:not(:disabled) {
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(110, 231, 183, 0.35) 0%, rgba(134, 239, 172, 0.35) 100%)' 
            : 'rgba(255, 255, 255, 0.35)'};
          transform: translateY(-3px) scale(1.1);
          box-shadow: ${theme === 'dark' 
            ? '0 6px 32px rgba(110, 231, 183, 0.6), 0 0 48px rgba(110, 231, 183, 0.4)' 
            : '0 6px 20px rgba(0, 0, 0, 0.3)'};
          border-color: ${theme === 'dark' 
            ? 'rgba(110, 231, 183, 0.5)' 
            : 'transparent'};
        }

        .story-settings {
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(51, 65, 85, 0.98) 100%)' 
            : 'var(--light)'};
          padding: 1rem;
          border-top: 1px solid ${theme === 'dark' 
            ? 'rgba(110, 231, 183, 0.2)' 
            : 'var(--gray-200)'};
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          backdrop-filter: ${theme === 'dark' ? 'blur(12px) saturate(180%)' : 'none'};
          box-shadow: ${theme === 'dark' 
            ? '0 -4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(110, 231, 183, 0.1)' 
            : 'none'};
        }

        .setting-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .setting-group label {
          font-weight: 500;
          color: ${theme === 'dark' ? 'var(--gray-300)' : 'var(--gray-700)'};
        }

        .setting-group input[type="range"] {
          width: 100px;
        }

        .setting-group select {
          padding: 0.25rem 0.5rem;
          border: 1px solid ${theme === 'dark' 
            ? 'rgba(102, 187, 106, 0.2)' 
            : 'var(--gray-300)'};
          border-radius: 4px;
          background: ${theme === 'dark' 
            ? 'rgba(22, 27, 34, 0.8)' 
            : 'white'};
          color: ${theme === 'dark' ? 'var(--gray-300)' : 'var(--gray-800)'};
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .setting-group select:hover {
          border-color: ${theme === 'dark' 
            ? 'rgba(102, 187, 106, 0.4)' 
            : 'var(--gray-400)'};
        }

        .setting-group select:focus {
          outline: none;
          border-color: ${theme === 'dark' 
            ? 'var(--primary)' 
            : 'var(--primary-light)'};
          box-shadow: ${theme === 'dark' 
            ? '0 0 0 3px rgba(102, 187, 106, 0.2)' 
            : '0 0 0 3px rgba(27, 94, 32, 0.1)'};
        }

        .speech-button {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .speech-button:hover:not(:disabled) {
          background: var(--primary-light);
        }

        .speech-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .speech-button.stop {
          background: var(--error);
          margin-left: 0.5rem;
        }

        .speech-button.stop:hover {
          background: #dc2626;
        }

        .story-content {
          padding: clamp(1rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem);
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.85) 50%, rgba(51, 65, 85, 0.7) 100%)' 
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%)'};
          backdrop-filter: blur(10px);
          position: relative;
          min-height: 200px;
        }

        .story-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${theme === 'dark' 
            ? "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='subtle' width='40' height='40' patternUnits='userSpaceOnUse'><circle cx='20' cy='20' r='0.5' fill='rgba(110, 231, 183, 0.12)'/></pattern></defs><rect width='100%' height='100%' fill='url(%23subtle)'/></svg>\")"
            : "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='subtle' width='40' height='40' patternUnits='userSpaceOnUse'><circle cx='20' cy='20' r='0.5' fill='rgba(16, 185, 129, 0.05)'/></pattern></defs><rect width='100%' height='100%' fill='url(%23subtle)'/></svg>\")"};
          opacity: ${theme === 'dark' ? '0.7' : '0.5'};
          z-index: 0;
        }

        .story-scene {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .scene-title {
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          font-weight: bold;
          margin-bottom: clamp(1rem, 3vw, 2rem);
          color: var(--primary);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: titleGlow 3s ease-in-out infinite alternate;
          line-height: 1.2;
          word-wrap: break-word;
        }

        .character-display {
          margin: 3rem 0;
          transition: all 0.4s ease;
          position: relative;
        }

        .character-display.animating {
          animation: characterBounce 0.8s ease-in-out;
        }

        .character-display.speaking {
          animation: characterPulse 2s ease-in-out infinite;
        }

        .character-display:hover {
          transform: scale(1.05);
        }

        .speaking-indicator {
          position: absolute;
          top: -10px;
          right: -10px;
        }

        .speech-bubble {
          display: flex;
          gap: 2px;
          animation: wave 1s infinite;
        }

        .bubble-dot {
          width: 4px;
          height: 4px;
          background: var(--primary);
          border-radius: 50%;
          animation: wave 1.5s infinite;
        }

        .bubble-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .bubble-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .character-icon {
          font-size: 4rem;
          display: inline-block;
        }

        .story-image-container {
          width: 100%;
          max-width: 800px;
          margin: clamp(1rem, 3vw, 2rem) auto;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: ${theme === 'dark' 
            ? '0 12px 48px rgba(0, 0, 0, 0.7), 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 24px rgba(110, 231, 183, 0.15), inset 0 1px 0 rgba(110, 231, 183, 0.2)' 
            : '0 8px 24px rgba(0, 0, 0, 0.15)'};
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)' 
            : 'white'};
          border: ${theme === 'dark' 
            ? '1px solid rgba(110, 231, 183, 0.2)' 
            : 'none'};
          animation: fadeInUp 0.8s ease-out;
        }

        .story-image {
          width: 100%;
          height: auto;
          display: block;
          transition: opacity 0.5s ease-in-out;
        }

        .story-text {
          font-size: clamp(1rem, 3vw, 1.2rem);
          line-height: 1.8;
          margin: clamp(1rem, 3vw, 2rem) 0;
          text-align: left;
          animation: fadeInUp 0.8s ease-out;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .story-choices {
          margin-top: 2rem;
          text-align: left;
        }

        .story-choices h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: var(--primary);
          text-shadow: ${theme === 'dark' 
            ? '0 0 16px rgba(110, 231, 183, 0.4), 0 2px 8px rgba(110, 231, 183, 0.2)' 
            : 'none'};
        }

        .choices-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .choice-btn {
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.9) 100%)' 
            : 'white'};
          border: 2px solid ${theme === 'dark' 
            ? 'rgba(110, 231, 183, 0.3)' 
            : 'var(--primary-light)'};
          color: ${theme === 'dark' ? 'var(--gray-700)' : 'var(--gray-800)'};
          padding: clamp(1rem, 3vw, 1.5rem);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
          overflow: hidden;
          box-shadow: ${theme === 'dark' 
            ? '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 12px rgba(110, 231, 183, 0.1), inset 0 1px 0 rgba(110, 231, 183, 0.15)' 
            : '0 2px 8px rgba(0, 0, 0, 0.1)'};
          min-height: 60px;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .choice-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, ${theme === 'dark' 
            ? 'rgba(110, 231, 183, 0.2)' 
            : 'rgba(16, 185, 129, 0.1)'}, transparent);
          transition: left 0.6s ease;
        }

        .choice-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .choice-btn:hover:not(:disabled) {
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(110, 231, 183, 0.25) 0%, rgba(134, 239, 172, 0.25) 100%)' 
            : 'var(--primary-light)'};
          color: ${theme === 'dark' ? 'var(--gray-800)' : 'white'};
          transform: translateY(-4px) scale(1.02);
          box-shadow: ${theme === 'dark' 
            ? '0 12px 40px rgba(110, 231, 183, 0.5), 0 4px 20px rgba(110, 231, 183, 0.3), inset 0 1px 0 rgba(110, 231, 183, 0.3), 0 0 24px rgba(110, 231, 183, 0.2)' 
            : '0 8px 24px rgba(16, 185, 129, 0.3)'};
          border-color: ${theme === 'dark' 
            ? 'rgba(110, 231, 183, 0.6)' 
            : 'var(--primary)'};
        }

        .choice-btn:active:not(:disabled) {
          transform: translateY(-2px) scale(0.98);
        }

        .choice-btn.selected {
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(110, 231, 183, 0.35) 0%, rgba(134, 239, 172, 0.35) 100%)' 
            : 'var(--primary)'};
          color: ${theme === 'dark' ? 'var(--white)' : 'white'};
          border-color: ${theme === 'dark' 
            ? 'rgba(110, 231, 183, 0.8)' 
            : 'var(--primary)'};
          transform: scale(1.05);
          box-shadow: ${theme === 'dark' 
            ? '0 12px 48px rgba(110, 231, 183, 0.6), 0 4px 24px rgba(110, 231, 183, 0.4), inset 0 1px 0 rgba(110, 231, 183, 0.5), 0 0 32px rgba(110, 231, 183, 0.3)' 
            : '0 8px 24px rgba(16, 185, 129, 0.4)'};
        }

        .choice-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .choice-consequence {
          font-size: 0.9rem;
          opacity: 0.8;
          font-style: italic;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${theme === 'dark' 
            ? 'rgba(13, 17, 23, 0.9)' 
            : 'rgba(0, 0, 0, 0.7)'};
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loading-spinner {
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(22, 27, 34, 0.95) 0%, rgba(28, 33, 40, 0.95) 100%)' 
            : 'white'};
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: ${theme === 'dark' 
            ? '0 20px 60px rgba(0, 0, 0, 0.8), 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(102, 187, 106, 0.2)' 
            : '0 8px 25px rgba(0, 0, 0, 0.3)'};
          border: ${theme === 'dark' 
            ? '1px solid rgba(102, 187, 106, 0.2)' 
            : 'none'};
          color: ${theme === 'dark' ? 'var(--gray-300)' : 'inherit'};
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--gray-200);
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        .skip-button-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 100;
        }

        .skip-button {
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(102, 187, 106, 0.9) 0%, rgba(129, 199, 132, 0.9) 100%)' 
            : 'var(--primary)'};
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          box-shadow: ${theme === 'dark' 
            ? '0 4px 16px rgba(102, 187, 106, 0.5), 0 0 30px rgba(102, 187, 106, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.2)'};
          transition: all 0.2s ease;
          animation: pulse 2s infinite;
          border: ${theme === 'dark' 
            ? '1px solid rgba(102, 187, 106, 0.5)' 
            : 'none'};
        }

        .skip-button:hover {
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(102, 187, 106, 1) 0%, rgba(129, 199, 132, 1) 100%)' 
            : 'var(--primary-light)'};
          transform: translateY(-2px);
          box-shadow: ${theme === 'dark' 
            ? '0 6px 24px rgba(102, 187, 106, 0.6), 0 0 40px rgba(102, 187, 106, 0.4)' 
            : '0 6px 16px rgba(0, 0, 0, 0.3)'};
        }

        .mobile-gesture-hint {
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          opacity: 0.8;
          animation: fadeInOut 3s ease-in-out;
          pointer-events: none;
          max-width: calc(100vw - 2rem);
        }

        .gesture-hint-content {
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(22, 27, 34, 0.95) 0%, rgba(28, 33, 40, 0.95) 100%)' 
            : 'rgba(0, 0, 0, 0.85)'};
          color: ${theme === 'dark' ? 'var(--gray-300)' : 'white'};
          padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem);
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: clamp(0.75rem, 2.5vw, 0.9rem);
          white-space: nowrap;
          box-shadow: ${theme === 'dark' 
            ? '0 8px 24px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(102, 187, 106, 0.2)' 
            : '0 4px 12px rgba(0, 0, 0, 0.3)'};
          border: ${theme === 'dark' 
            ? '1px solid rgba(102, 187, 106, 0.2)' 
            : 'none'};
          backdrop-filter: ${theme === 'dark' ? 'blur(10px)' : 'none'};
        }

        .gesture-icon {
          font-size: 1.2rem;
        }

        .gesture-text {
          font-weight: 500;
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          20%, 80% { opacity: 0.8; transform: translateX(-50%) translateY(0); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes titleGlow {
          from { 
            text-shadow: ${theme === 'dark' 
              ? '2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 8px rgba(102, 187, 106, 0.2)' 
              : '2px 2px 4px rgba(0, 0, 0, 0.1)'};
            filter: brightness(1);
          }
          to { 
            text-shadow: ${theme === 'dark' 
              ? '2px 2px 8px rgba(102, 187, 106, 0.5), 0 0 20px rgba(102, 187, 106, 0.4), 0 0 30px rgba(102, 187, 106, 0.2)' 
              : '2px 2px 8px rgba(16, 185, 129, 0.3), 0 0 16px rgba(16, 185, 129, 0.2)'};
            filter: brightness(${theme === 'dark' ? '1.15' : '1.1'});
          }
        }

        @keyframes characterBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) scale(1);
          }
          10% {
            transform: translateY(-15px) scale(1.1);
          }
          40% {
            transform: translateY(-8px) scale(1.05);
          }
          60% {
            transform: translateY(-4px) scale(1.02);
          }
        }

        @keyframes characterPulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.2);
          }
        }

        @media (max-width: 768px) {
          .interactive-story-player {
            border-radius: 12px;
            margin: 0.5rem;
            max-width: calc(100% - 1rem);
          }

          .story-header {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem 0.75rem;
            gap: 0.75rem;
          }

          .story-progress {
            width: 100%;
            gap: 0.75rem;
          }

          .progress-bar {
            min-width: 0;
            flex: 1;
          }

          .progress-text {
            font-size: 0.8rem;
            flex-shrink: 0;
          }

          .story-controls {
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.5rem;
            width: 100%;
          }

          .control-btn {
            padding: 0.75rem;
            min-width: 44px;
            min-height: 44px;
            flex: 0 0 auto;
          }

          .control-btn svg {
            width: 18px;
            height: 18px;
          }

          .play-btn {
            padding: 0.875rem;
          }

          .story-settings {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
            max-height: 60vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .setting-group {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            width: 100%;
          }

          .setting-group label {
            font-size: 0.9rem;
          }

          .setting-group input[type="range"] {
            width: 100%;
            max-width: 100%;
          }

          .setting-group select {
            width: 100%;
            max-width: 100%;
            padding: 0.5rem;
          }

          .choices-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .choice-btn {
            padding: 1.25rem;
            font-size: clamp(0.9rem, 3vw, 1rem);
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: 100%;
          }

          .skip-button-container {
            bottom: 10px;
            right: 10px;
            left: auto;
          }

          .skip-button {
            padding: 0.75rem 1.25rem;
            font-size: 0.9rem;
            min-width: 44px;
            min-height: 44px;
            border-radius: 20px;
          }

          .story-content {
            padding: 1rem;
            touch-action: pan-y;
            min-height: auto;
          }

          .story-scene {
            text-align: center;
          }

          .character-display {
            margin: 1.5rem 0;
          }

          .character-icon {
            font-size: clamp(2.5rem, 8vw, 3rem);
          }

          .story-image-container {
            margin: 1rem auto;
            border-radius: 12px;
          }

          .story-choices {
            margin-top: 1.5rem;
          }

          .story-choices h3 {
            font-size: clamp(1rem, 4vw, 1.2rem);
            margin-bottom: 1rem;
          }

          .full-story-text {
            padding: 0;
          }

          .full-story-header {
            margin-bottom: 2rem;
          }

          .full-story-title {
            font-size: clamp(1.5rem, 6vw, 2rem);
          }

          .full-story-intro {
            font-size: clamp(0.95rem, 3vw, 1.125rem);
            padding: 0 0.5rem;
          }

          .full-story-body {
            font-size: clamp(0.95rem, 3vw, 1.125rem);
          }

          .scene-heading {
            font-size: clamp(1.25rem, 4vw, 1.5rem);
          }

          .scene-paragraph {
            font-size: clamp(0.95rem, 3vw, 1.125rem);
          }

          .mobile-gesture-hint {
            bottom: 70px;
            max-width: calc(100vw - 1rem);
          }

          .gesture-hint-content {
            white-space: normal;
            text-align: center;
            flex-wrap: wrap;
            justify-content: center;
          }

          .gesture-text {
            font-size: clamp(0.7rem, 2.5vw, 0.85rem);
          }
        }

        .full-story-text {
          text-align: left;
          max-width: 800px;
          margin: 0 auto;
        }

        .full-story-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .full-story-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: var(--primary);
          text-shadow: ${theme === 'dark' 
            ? '0 0 20px rgba(102, 187, 106, 0.4), 0 0 40px rgba(102, 187, 106, 0.2)' 
            : 'none'};
        }

        .full-story-intro {
          font-size: 1.125rem;
          line-height: 1.7;
          max-width: 600px;
          margin: 0 auto;
        }

        .full-story-body {
          line-height: 1.8;
          font-size: 1.125rem;
        }

        .full-story-scene {
          margin-bottom: 2rem;
        }

        .scene-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--primary-light), transparent);
          margin: 2rem 0;
          box-shadow: ${theme === 'dark' 
            ? '0 0 10px rgba(102, 187, 106, 0.3)' 
            : 'none'};
        }

        .scene-heading {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: var(--primary);
          text-shadow: ${theme === 'dark' 
            ? '0 0 10px rgba(102, 187, 106, 0.3)' 
            : 'none'};
        }

        .scene-paragraph {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }

        .story-ending {
          text-align: center;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid var(--primary-light);
          box-shadow: ${theme === 'dark' 
            ? '0 -2px 10px rgba(102, 187, 106, 0.2)' 
            : 'none'};
        }

        .ending-text {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary);
          text-shadow: ${theme === 'dark' 
            ? '0 0 15px rgba(102, 187, 106, 0.4), 0 0 30px rgba(102, 187, 106, 0.2)' 
            : 'none'};
        }

        @media (max-width: 480px) {
          .interactive-story-player {
            margin: 0.25rem;
            border-radius: 8px;
            max-width: calc(100% - 0.5rem);
          }

          .story-header {
            padding: 0.75rem 0.5rem;
            gap: 0.5rem;
          }

          .story-progress {
            gap: 0.5rem;
          }

          .progress-text {
            font-size: 0.75rem;
          }

          .story-controls {
            gap: 0.375rem;
            justify-content: space-around;
          }

          .control-btn {
            padding: 0.625rem;
            min-width: 44px;
            min-height: 44px;
            flex: 1 1 auto;
            max-width: calc(25% - 0.375rem);
          }

          .control-btn svg {
            width: 16px;
            height: 16px;
          }

          .play-btn {
            padding: 0.75rem;
            max-width: calc(25% - 0.375rem);
          }

          .story-settings {
            padding: 0.75rem;
            gap: 0.75rem;
          }

          .setting-group {
            gap: 0.375rem;
          }

          .setting-group label {
            font-size: 0.85rem;
          }

          .story-content {
            padding: 0.75rem;
          }

          .character-display {
            margin: 1rem 0;
          }

          .character-icon {
            font-size: clamp(2rem, 10vw, 2.5rem);
          }

          .story-image-container {
            margin: 0.75rem auto;
            border-radius: 8px;
          }

          .choice-btn {
            padding: 1rem;
            font-size: 0.9rem;
            min-height: 56px;
          }

          .skip-button {
            padding: 0.625rem 1rem;
            font-size: 0.85rem;
            border-radius: 18px;
          }

          .skip-button-container {
            bottom: 8px;
            right: 8px;
          }

          .mobile-gesture-hint {
            bottom: 60px;
            max-width: calc(100vw - 0.5rem);
          }

          .gesture-hint-content {
            padding: 0.5rem 0.75rem;
            gap: 0.375rem;
          }

          .gesture-icon {
            font-size: 1rem;
          }

          .gesture-text {
            font-size: 0.7rem;
            line-height: 1.3;
          }

          .full-story-title {
            font-size: clamp(1.25rem, 7vw, 1.75rem);
            margin-bottom: 0.75rem;
          }

          .full-story-intro {
            font-size: 0.9rem;
            padding: 0;
          }

          .full-story-body {
            font-size: 0.95rem;
          }

          .scene-heading {
            font-size: clamp(1.1rem, 5vw, 1.35rem);
          }

          .scene-paragraph {
            font-size: 0.95rem;
            margin-bottom: 1rem;
          }

          .story-ending {
            margin-top: 2rem;
            padding-top: 1.5rem;
          }

          .ending-text {
            font-size: clamp(1.25rem, 5vw, 1.5rem);
          }
        }

        /* Landscape mobile orientation */
        @media (max-width: 768px) and (orientation: landscape) {
          .story-content {
            padding: 1.5rem;
          }

          .story-header {
            padding: 0.75rem;
          }

          .mobile-gesture-hint {
            bottom: 10px;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .control-btn:hover:not(:disabled) {
            transform: none;
          }

          .control-btn:active:not(:disabled) {
            transform: scale(0.95);
            background: rgba(255, 255, 255, 0.3);
          }

          .choice-btn:hover:not(:disabled) {
            transform: none;
          }

          .choice-btn:active:not(:disabled) {
            transform: scale(0.98);
            background: var(--primary-light);
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveStoryPlayer;