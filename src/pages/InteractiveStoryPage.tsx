import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, ArrowLeft, Heart, Star, Play, Sparkles, Trophy } from 'lucide-react';
import InteractiveStoryPlayer from '../components/story/InteractiveStoryPlayer';
import StoryProgress from '../components/story/StoryProgress';
import PageLayout from '../components/layout/PageLayout';
import { storyScenes } from '../data/storyScenes';
import { useTheme } from '../contexts/ThemeContext';

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

const InteractiveStoryPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [achievements, setAchievements] = useState([
    {
      id: 'first-scene',
      name: 'Story Starter',
      description: 'Read your first scene',
      icon: '📖',
      unlocked: false
    },
    {
      id: 'privacy-learner',
      name: 'Privacy Learner',
      description: 'Learn about privacy concepts',
      icon: '🛡️',
      unlocked: false
    },
    {
      id: 'wise-choices',
      name: 'Wise Choices',
      description: 'Make 3 good decisions',
      icon: '🧠',
      unlocked: false
    },
    {
      id: 'story-complete',
      name: 'Story Master',
      description: 'Complete the entire story',
      icon: '🏆',
      unlocked: false
    }
  ]);


  const handleSceneChange = (sceneId: string) => {
    const sceneIndex = storyScenes.findIndex(scene => scene.id === sceneId);
    if (sceneIndex !== -1) {
      setCurrentSceneIndex(sceneIndex);
    }
  };

  const handleChoiceMade = (choice: { text: string; nextScene: string; consequence?: string }) => {
    try {
      // Save choice to localStorage
      const savedChoicesStr = localStorage.getItem('story-choices') || '[]';
      let savedChoices: any[] = [];
      try {
        savedChoices = JSON.parse(savedChoicesStr);
        if (!Array.isArray(savedChoices)) {
          savedChoices = [];
        }
      } catch (error) {
        console.error('Error parsing saved choices:', error);
        savedChoices = [];
      }
      
      savedChoices.push({
        text: choice.text,
        nextScene: choice.nextScene,
        consequence: choice.consequence,
        timestamp: Date.now()
      });
      
      try {
        localStorage.setItem('story-choices', JSON.stringify(savedChoices));
      } catch (error) {
        console.error('Error saving choices to localStorage:', error);
      }
      
      // Check for achievements
      checkChoiceAchievements();
    } catch (error) {
      console.error('Error handling choice:', error);
    }
  };

  const checkChoiceAchievements = () => {
    try {
      const savedChoicesStr = localStorage.getItem('story-choices') || '[]';
      let savedChoices: any[] = [];
      try {
        savedChoices = JSON.parse(savedChoicesStr);
        if (!Array.isArray(savedChoices)) {
          savedChoices = [];
        }
      } catch (error) {
        console.error('Error parsing saved choices:', error);
        savedChoices = [];
      }
      
      const privacyChoices = savedChoices.filter((choice: any) => 
        choice && choice.consequence && typeof choice.consequence === 'string' && choice.consequence.includes('privacy')
      );
      
      // Unlock privacy learner achievement
      if (privacyChoices.length >= 2) {
        const wasUnlocked = achievements.find(a => a.id === 'privacy-learner')?.unlocked;
        if (!wasUnlocked) {
          setAchievements((prev: Achievement[]) => prev.map((a: Achievement) => 
            a.id === 'privacy-learner' ? { ...a, unlocked: true } : a
          ));
          showAchievementUnlocked('Privacy Learner', '🛡️', 'You\'ve learned about privacy concepts!');
        }
      }
      
      // Unlock wise choices achievement
      if (savedChoices.length >= 3) {
        const wasUnlocked = achievements.find(a => a.id === 'wise-choices')?.unlocked;
        if (!wasUnlocked) {
          setAchievements((prev: Achievement[]) => prev.map((a: Achievement) => 
            a.id === 'wise-choices' ? { ...a, unlocked: true } : a
          ));
          showAchievementUnlocked('Wise Choices', '🧠', 'You\'ve made 3 good decisions!');
        }
      }
    } catch (error) {
      console.error('Error checking choice achievements:', error);
    }
  };

  const showAchievementUnlocked = (title: string, icon: string, description: string) => {
    const achievementElement = document.createElement('div');
    achievementElement.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        color: white;
        padding: 1.5rem;
        border-radius: 16px;
        box-shadow: 0 12px 32px rgba(251, 191, 36, 0.4);
        z-index: 10000;
        max-width: 300px;
        animation: achievementSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid rgba(255, 255, 255, 0.2);
      ">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
          <span style="font-size: 2rem;">${icon}</span>
          <div>
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: bold;">Achievement Unlocked!</h3>
            <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">${title}</p>
          </div>
        </div>
        <p style="margin: 0; font-size: 0.85rem; opacity: 0.8;">${description}</p>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes achievementSlideIn {
        0% { 
          opacity: 0; 
          transform: translateX(100%) scale(0.8); 
        }
        100% { 
          opacity: 1; 
          transform: translateX(0) scale(1); 
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(achievementElement);
    
    setTimeout(() => {
      achievementElement.style.animation = 'achievementSlideOut 0.4s ease-in forwards';
      setTimeout(() => {
        document.body.removeChild(achievementElement);
        document.head.removeChild(style);
      }, 400);
    }, 4000);
    
    // Add slide out animation
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
      @keyframes achievementSlideOut {
        0% { 
          opacity: 1; 
          transform: translateX(0) scale(1); 
        }
        100% { 
          opacity: 0; 
          transform: translateX(100%) scale(0.8); 
        }
      }
    `;
    document.head.appendChild(slideOutStyle);
  };

  const handleStoryComplete = () => {
    const wasUnlocked = achievements.find(a => a.id === 'story-complete')?.unlocked;
    if (!wasUnlocked) {
      setAchievements((prev: Achievement[]) => prev.map((a: Achievement) => 
        a.id === 'story-complete' ? { ...a, unlocked: true } : a
      ));
      setPoints((prev: number) => prev + 50);
      
      // Show completion celebration
      showStoryCompletionCelebration();
    }
  };

  const showStoryCompletionCelebration = () => {
    // Create celebration overlay
    const celebrationOverlay = document.createElement('div');
    celebrationOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9));
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: celebrationFadeIn 0.8s ease-out;
    `;
    
    celebrationOverlay.innerHTML = `
      <div style="
        text-align: center;
        color: white;
        padding: 3rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        backdrop-filter: blur(20px);
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: celebrationBounce 0.6s ease-out 0.3s both;
      ">
        <div style="font-size: 4rem; margin-bottom: 1rem; animation: celebrationSpin 2s ease-in-out infinite;">🏆</div>
        <h2 style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: bold;">Congratulations!</h2>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">You've completed Privacy Panda's journey!</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
          " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            Continue Learning
          </button>
        </div>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes celebrationFadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      
      @keyframes celebrationBounce {
        0% { 
          opacity: 0; 
          transform: scale(0.5) translateY(50px); 
        }
        100% { 
          opacity: 1; 
          transform: scale(1) translateY(0); 
        }
      }
      
      @keyframes celebrationSpin {
        0%, 100% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(10deg) scale(1.1); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(celebrationOverlay);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      celebrationOverlay.style.animation = 'celebrationFadeOut 0.5s ease-in forwards';
      setTimeout(() => {
        document.body.removeChild(celebrationOverlay);
        document.head.removeChild(style);
      }, 500);
    }, 8000);
    
    // Add fade out animation
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
      @keyframes celebrationFadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(fadeOutStyle);
  };

  // Unlock first scene achievement
  useEffect(() => {
    if (currentSceneIndex === 0) {
      setAchievements((prev: any[]) => prev.map((a: any) => 
        a.id === 'first-scene' ? { ...a, unlocked: true } : a
      ));
    }
  }, [currentSceneIndex]);

  // Unlock privacy learner achievement
  useEffect(() => {
    if (currentSceneIndex >= 5) {
      setAchievements((prev: any[]) => prev.map((a: any) => 
        a.id === 'privacy-learner' ? { ...a, unlocked: true } : a
      ));
    }
  }, [currentSceneIndex]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('story-bookmarks');
    if (savedBookmarks) {
      try {
        const bookmarkArray = JSON.parse(savedBookmarks);
        setBookmarks(new Set(bookmarkArray));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('story-bookmarks', JSON.stringify(Array.from(bookmarks)));
  }, [bookmarks]);


  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('story-progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCurrentSceneIndex(progress.sceneIndex || 0);
        setPoints(progress.points || 0);
        setAchievements(progress.achievements || achievements);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    const progress = {
      sceneIndex: currentSceneIndex,
      points,
      achievements,
      timestamp: Date.now()
    };
    localStorage.setItem('story-progress', JSON.stringify(progress));
  }, [currentSceneIndex, points, achievements]);

  const toggleBookmark = (sceneId: string) => {
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(sceneId)) {
        newBookmarks.delete(sceneId);
      } else {
        newBookmarks.add(sceneId);
      }
      return newBookmarks;
    });
  };

  const jumpToBookmark = (sceneId: string) => {
    const sceneIndex = storyScenes.findIndex(scene => scene.id === sceneId);
    if (sceneIndex !== -1) {
      setCurrentSceneIndex(sceneIndex);
      setShowBookmarks(false);
    }
  };

  // Keyboard navigation for main page
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'h':
          event.preventDefault();
          setShowKeyboardHelp(!showKeyboardHelp);
          break;
        case 'b':
          event.preventDefault();
          setShowBookmarks(!showBookmarks);
          break;
        case 'escape':
          if (showKeyboardHelp) {
            setShowKeyboardHelp(false);
          }
          if (showBookmarks) {
            setShowBookmarks(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showKeyboardHelp, showBookmarks]);

  return (
    <PageLayout
      title="Privacy Panda"
      subtitle="Join Po the Panda on an interactive adventure through the Digital Bamboo Forest as he learns about privacy, sharing, and staying safe online. Make choices, unlock achievements, and become a privacy expert!"
      icon={Book}
      badge="INTERACTIVE STORY"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        
        {/* Interactive Story Player - Primary Content (First Section After Hero) */}
        <div id="story-player" style={{ marginBottom: '2rem', marginTop: '1rem' }}>
          <InteractiveStoryPlayer
            scenes={storyScenes}
            currentSceneIndex={currentSceneIndex}
            onSceneIndexChange={setCurrentSceneIndex}
            onSceneChange={handleSceneChange}
            onStoryComplete={handleStoryComplete}
            onChoiceMade={handleChoiceMade}
            hideControls={false}
          />
        </div>

        {/* Enhanced Progress Component */}
        <div style={{ marginBottom: '2rem' }} className="relative z-10">
          <StoryProgress
            currentScene={currentSceneIndex + 1}
            totalScenes={storyScenes.length}
            points={points}
            achievements={achievements}
            showDetailedProgress={true}
          />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <div className={`absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 animate-pulse ${isDark ? 'bg-green-700' : 'bg-green-200'}`} style={{ animationDuration: '3s' }}></div>
          <div className={`absolute top-40 right-20 w-24 h-24 rounded-full opacity-20 animate-pulse ${isDark ? 'bg-blue-700' : 'bg-blue-200'}`} style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
          <div className={`absolute bottom-20 left-1/4 w-40 h-40 rounded-full opacity-15 animate-pulse ${isDark ? 'bg-purple-700' : 'bg-purple-200'}`} style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
          <div className={`absolute top-1/2 right-1/4 w-28 h-28 rounded-full opacity-20 animate-pulse ${isDark ? 'bg-yellow-600' : 'bg-yellow-200'}`} style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}></div>
        </div>

        {/* Feature Section with Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 items-center mb-8 relative z-10" style={{ marginTop: '2rem' }}>
          {/* Left Column - Feature Grid and CTA */}
          <div className="text-left">
            {/* Enhanced Feature Grid with Icons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105 ${isDark ? 'bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 border-yellow-600' : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300'}`}>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-yellow-600' : 'bg-yellow-400'}`}>
                  <Star size={20} className={isDark ? 'text-yellow-100' : 'text-yellow-900'} fill="currentColor" />
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--gray-800)' }}>Ages 5-12</div>
                  <div className="text-xs" style={{ color: 'var(--gray-600)' }}>Perfect Age</div>
                </div>
              </div>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105 ${isDark ? 'bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'}`}>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-400'}`}>
                  <Book size={20} className={isDark ? 'text-blue-100' : 'text-blue-900'} />
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--gray-800)' }}>Interactive</div>
                  <div className="text-xs" style={{ color: 'var(--gray-600)' }}>Engaging</div>
                </div>
              </div>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105 ${isDark ? 'bg-gradient-to-br from-red-900/40 to-red-800/40 border-red-600' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-300'}`}>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-red-600' : 'bg-red-400'}`}>
                  <Heart size={20} className={isDark ? 'text-red-100' : 'text-red-900'} fill="currentColor" />
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--gray-800)' }}>Educational</div>
                  <div className="text-xs" style={{ color: 'var(--gray-600)' }}>Learning</div>
                </div>
              </div>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105 ${isDark ? 'bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-600' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300'}`}>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-600' : 'bg-purple-400'}`}>
                  <span className="text-2xl">🎮</span>
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--gray-800)' }}>Make Choices</div>
                  <div className="text-xs" style={{ color: 'var(--gray-600)' }}>Decisions</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => document.getElementById('story-player')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Play size={18} />
                Start Adventure
              </button>
              <button 
                onClick={() => setShowKeyboardHelp(true)}
                className={`px-4 py-3 rounded-lg font-semibold transition-all border ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'}`}
              >
                Help
              </button>
            </div>
          </div>

          {/* Right Column - Enhanced Visual Element */}
          <div className="relative hidden md:block">
            <div className="relative">
              {/* Main Panda Illustration Area with Enhanced Visuals */}
              <div className={`relative rounded-3xl p-8 border-4 shadow-2xl overflow-hidden ${isDark ? 'bg-gradient-to-br from-green-900/60 via-emerald-900/60 to-teal-900/60 border-green-600' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-300'}`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                  }}></div>
                </div>
                
                <div className="text-center relative z-10">
                  <div className="flex justify-center mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
                    <div style={{ 
                      width: '140px', 
                      height: '140px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: isDark ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.2))' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                      borderRadius: '50%',
                      border: isDark ? '4px solid rgba(74, 222, 128, 0.4)' : '4px solid rgba(16, 185, 129, 0.3)',
                      boxShadow: isDark ? '0 8px 24px rgba(74, 222, 128, 0.3)' : '0 8px 24px rgba(16, 185, 129, 0.2)',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src="/LogoPandagarde.png" 
                        alt="PandaGarde Logo" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          padding: '8px'
                        }} 
                      />
                    </div>
                  </div>
                  
                  {/* Enhanced Icon Row */}
                  <div className="flex justify-center gap-3 mb-4">
                    <div className={`p-3 rounded-full shadow-lg animate-pulse ${isDark ? 'bg-gray-800' : 'bg-white'}`} style={{ animationDelay: '0s' }}>
                      <span className="text-3xl">🛡️</span>
                    </div>
                    <div className={`p-3 rounded-full shadow-lg animate-pulse ${isDark ? 'bg-gray-800' : 'bg-white'}`} style={{ animationDelay: '0.2s' }}>
                      <span className="text-3xl">🔒</span>
                    </div>
                    <div className={`p-3 rounded-full shadow-lg animate-pulse ${isDark ? 'bg-gray-800' : 'bg-white'}`} style={{ animationDelay: '0.4s' }}>
                      <span className="text-3xl">⭐</span>
                    </div>
                  </div>
                  
                  <p className="text-base font-semibold mb-2" style={{ color: 'var(--gray-800)' }}>Ready to protect your digital privacy?</p>
                  <div className="flex justify-center gap-1 mt-2">
                    <Sparkles size={16} className="text-yellow-500" />
                    <span className="text-xs" style={{ color: 'var(--gray-600)' }}>Interactive Learning Adventure</span>
                    <Sparkles size={16} className="text-yellow-500" />
                  </div>
                </div>
                
                {/* Floating Decorative Elements */}
                <div className="absolute -top-6 -right-6 text-5xl opacity-40 animate-float" style={{ animationDuration: '3s' }}>🌿</div>
                <div className="absolute -bottom-6 -left-6 text-5xl opacity-40 animate-float" style={{ animationDuration: '4s', animationDelay: '1s' }}>🎋</div>
                <div className="absolute top-1/2 -left-8 text-4xl opacity-30 animate-float" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🐼</div>
                <div className="absolute top-1/4 -right-8 text-4xl opacity-30 animate-float" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>🦉</div>
              </div>
            </div>
          </div>
        </div>


      {/* Enhanced Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
          className="bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110 hover:rotate-12 relative overflow-hidden group"
          title="Help (H)"
          aria-label="Show keyboard shortcuts"
        >
          <span className="relative z-10 text-2xl font-bold">?</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
        <button
          onClick={() => setShowBookmarks(!showBookmarks)}
          className="bg-gradient-to-br from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110 hover:rotate-12 relative overflow-hidden group"
          title="Bookmarks (B)"
          aria-label="Show bookmarks"
        >
          <span className="relative z-10 text-2xl">🔖</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
        {bookmarks.size > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
            {bookmarks.size}
          </div>
        )}
      </div>

      {/* Keyboard Help Panel */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-labelledby="keyboard-help-title">
          <div className={`rounded-lg p-6 max-w-md mx-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`} style={{ backgroundColor: 'var(--card-color)' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 id="keyboard-help-title" className="text-xl font-bold" style={{ color: 'var(--gray-800)' }}>Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="text-2xl"
                style={{ color: 'var(--gray-500)' }}
                aria-label="Close keyboard help"
              >
                ×
              </button>
            </div>
            <div className="space-y-3" style={{ color: 'var(--gray-700)' }}>
              <div className="flex justify-between">
                <span>Next scene:</span>
                <kbd className={`px-2 py-1 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ color: 'var(--gray-700)' }}>→</kbd>
              </div>
              <div className="flex justify-between">
                <span>Previous scene:</span>
                <kbd className={`px-2 py-1 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ color: 'var(--gray-700)' }}>←</kbd>
              </div>
              <div className="flex justify-between">
                <span>Play/Pause:</span>
                <kbd className={`px-2 py-1 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ color: 'var(--gray-700)' }}>P</kbd>
              </div>
              <div className="flex justify-between">
                <span>Mute/Unmute:</span>
                <kbd className={`px-2 py-1 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ color: 'var(--gray-700)' }}>M</kbd>
              </div>
              <div className="flex justify-between">
                <span>Reset story:</span>
                <kbd className={`px-2 py-1 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ color: 'var(--gray-700)' }}>R</kbd>
              </div>
              <div className="flex justify-between">
                <span>Select choice:</span>
                <kbd className={`px-2 py-1 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ color: 'var(--gray-700)' }}>Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span>Show this help:</span>
                <kbd className={`px-2 py-1 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ color: 'var(--gray-700)' }}>H</kbd>
              </div>
              <div className="flex justify-between">
                <span>Show bookmarks:</span>
                <kbd className={`px-2 py-1 rounded text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ color: 'var(--gray-700)' }}>B</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bookmarks Panel */}
      {showBookmarks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-labelledby="bookmarks-title">
          <div className={`rounded-lg p-6 max-w-2xl mx-4 max-h-96 overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`} style={{ backgroundColor: 'var(--card-color)' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 id="bookmarks-title" className="text-xl font-bold" style={{ color: 'var(--gray-800)' }}>Story Bookmarks</h2>
              <button
                onClick={() => setShowBookmarks(false)}
                className="text-2xl"
                style={{ color: 'var(--gray-500)' }}
                aria-label="Close bookmarks"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {bookmarks.size === 0 ? (
                <p className="text-center py-4" style={{ color: 'var(--gray-500)' }}>No bookmarks yet. Click the bookmark icon on any scene to save it!</p>
              ) : (
                Array.from(bookmarks).map(sceneId => {
                  const scene = storyScenes.find(s => s.id === sceneId);
                  return scene ? (
                    <div key={sceneId} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: 'var(--gray-800)' }}>{scene.title}</h3>
                        <p className="text-sm" style={{ color: 'var(--gray-600)' }}>
                          {scene.content.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => jumpToBookmark(sceneId)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Go to
                        </button>
                        <button
                          onClick={() => toggleBookmark(sceneId)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : null;
                })
              )}
            </div>
          </div>
        </div>
      )}

        {/* Visual Achievement Showcase */}
        <div className="mb-6 relative z-10">
          <div className={`rounded-2xl p-6 border-2 shadow-lg ${isDark ? 'bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-orange-900/40 border-purple-700' : 'bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border-purple-200'}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--gray-800)' }}>
              <Trophy className="text-yellow-500" size={24} />
              Your Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`relative p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    achievement.unlocked
                      ? isDark 
                        ? 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-600 shadow-md'
                        : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400 shadow-md'
                      : isDark
                        ? 'bg-gray-800 border-gray-600 opacity-60'
                        : 'bg-gray-100 border-gray-300 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="font-bold text-sm" style={{ color: achievement.unlocked ? 'var(--gray-800)' : 'var(--gray-500)' }}>
                      {achievement.name}
                    </div>
                    {achievement.unlocked && (
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-green-500 rounded-full p-1">
                          <Star size={12} className="text-white" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action with Visuals */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }} className="relative z-10">
          <div style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
            color: 'white',
            padding: '3rem',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
            border: '3px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Animated Background Pattern */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              opacity: 0.15,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23 11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 4c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm32-24c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px'
            }}></div>
            
            {/* Floating Icons */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
              <div className="animate-float" style={{ position: 'absolute', top: '1rem', left: '1rem', fontSize: '2.5rem', animationDuration: '3s' }}>🐼</div>
              <div className="animate-float" style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '2rem', animationDuration: '4s', animationDelay: '0.5s' }}>🛡️</div>
              <div className="animate-float" style={{ position: 'absolute', bottom: '1rem', left: '2rem', fontSize: '2rem', animationDuration: '3.5s', animationDelay: '1s' }}>⭐</div>
              <div className="animate-float" style={{ position: 'absolute', bottom: '1rem', right: '2rem', fontSize: '2.5rem', animationDuration: '4.5s', animationDelay: '1.5s' }}>🌿</div>
              <div className="animate-float" style={{ position: 'absolute', top: '50%', left: '10%', fontSize: '1.5rem', animationDuration: '3s', animationDelay: '0.3s' }}>🔒</div>
              <div className="animate-float" style={{ position: 'absolute', top: '50%', right: '10%', fontSize: '1.5rem', animationDuration: '3.5s', animationDelay: '0.7s' }}>📚</div>
            </div>
            
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="text-yellow-300" size={24} />
                <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  Continue Learning with Privacy Panda!
                </h2>
                <Sparkles className="text-yellow-300" size={24} />
              </div>
              <p style={{ fontSize: '1.125rem', opacity: 0.95, maxWidth: '42rem', margin: '0 auto 2rem', lineHeight: 1.6, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Explore more activities, games, and resources to help children learn about digital privacy and online safety.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                <Link
                  to="/activity-book"
                  className="group"
                  style={{
                    background: 'white',
                    color: '#16a34a',
                    padding: '0.875rem 2.25rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.3s',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0fdf4';
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                  }}
                >
                  <Book size={22} className="group-hover:rotate-12 transition-transform" />
                  Activity Book
                </Link>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '0.875rem 2.25rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.3s',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                  }}
                >
                  <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                  Back to Top
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>
    </PageLayout>
  );
};

export default InteractiveStoryPage;