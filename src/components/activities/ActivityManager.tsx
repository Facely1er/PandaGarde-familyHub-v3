import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { MissionShellGameProvider } from '../../utils/familyProgressIntegration';
import { type ActivityContext } from './ActivityPurposeBanner';

// Lazy load activity components
const ColoringActivity = lazy(() => import('./ColoringActivity'));
const DragDropActivity = lazy(() => import('./DragDropActivity'));
const MazeActivity = lazy(() => import('./MazeActivity'));
const WordSearchActivity = lazy(() => import('./WordSearchActivity'));
const ConnectDotsActivity = lazy(() => import('./ConnectDotsActivity'));
const MatchingActivity = lazy(() => import('./MatchingActivity'));
const MemoryGameActivity = lazy(() => import('./MemoryGameActivity'));
const QuizActivity = lazy(() => import('./QuizActivity'));

const PasswordStrengthLab = lazy(() => import('../games/PasswordStrengthLab'));
const PasswordFortressBuilder = lazy(() => import('../games/PasswordFortressBuilder'));
const PhishingDetective = lazy(() => import('../games/PhishingDetective'));
const PrivacySettingsTrainer = lazy(() => import('../games/PrivacySettingsTrainer'));
const SocialMediaAudit = lazy(() => import('../games/SocialMediaAudit'));
const SocialMediaSimulator = lazy(() => import('../games/SocialMediaSimulator'));
const DigitalRightsQuiz = lazy(() => import('../games/DigitalRightsQuiz'));
const DigitalFootprintVisualizer = lazy(() => import('../games/DigitalFootprintVisualizer'));
const SafeUnsafeSorting = lazy(() => import('../games/SafeUnsafeSorting'));
const PrivacyPolicyDecoder = lazy(() => import('../games/PrivacyPolicyDecoder'));

type GameWithBack = React.ComponentType<{
  onBack: () => void;
  onComplete?: (score?: number) => void;
}>;

/**
 * Wraps teen games that only expose onBack navigation. The game reports its
 * real completion via onComplete; leaving with the back button only counts as
 * mission completion if the game was actually finished (with the real score).
 */
const FamilyHubGame: React.FC<{
  Game: GameWithBack;
  onClose: () => void;
  onComplete: (score?: number) => void;
}> = ({ Game, onClose, onComplete }) => {
  const completedScoreRef = useRef<number | null>(null);
  return (
    <MissionShellGameProvider>
      <Game
        onComplete={(score) => {
          completedScoreRef.current = score ?? 100;
        }}
        onBack={() => {
          if (completedScoreRef.current !== null) {
            onComplete(completedScoreRef.current);
          }
          onClose();
        }}
      />
    </MissionShellGameProvider>
  );
};

interface ActivityManagerProps {
  activityId: string;
  onClose: () => void;
  onComplete: (activityId: string, score?: number) => void;
}

const ActivityManager: React.FC<ActivityManagerProps> = ({ activityId, onClose, onComplete }) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const { showSuccess } = useToast();

  const activityInstructions = {
    coloring: {
      title: "Color Privacy Panda",
      description: "Color the panda and shield together. The shield represents people you can trust when something online feels confusing.",
      instructions: [
        "Pick a color from the palette",
        "Paint on the canvas with mouse or finger",
        "Adjust brush size if you want",
        "Press I'm done when you're proud of your artwork",
      ],
      tips: "Use this calm moment to talk about who your child can go to when a message feels uncomfortable online."
    },
    sorting: {
      title: "Safe or Private?",
      description: "Sort everyday facts into two baskets — Safe to share and Keep private. Together you'll learn which details are friendly to share and which ones protect your family.",
      instructions: [
        "Tap a card, then tap a basket — or drag it across",
        "Green basket: Safe to share (okay to tell friends)",
        "Red basket: Keep private (protect this information)",
        "Sort every card, then press 'Check answer'",
      ],
      tips: "Think about what a stranger could use to find you or pretend to be you. Your full name, address, and phone number stay private."
    },
    maze: {
      title: "Safe Online Journey",
      description: "Guide Privacy Panda along the open paths to reach safety. It's a calm way to practise steering around things that don't feel right online.",
      instructions: [
        "Use the arrow keys, WASD, or the on-screen buttons to move",
        "Guide Privacy Panda 🐼 along the open paths",
        "Dark blocks are walls — you can't pass through them",
        "Reach the goal flag 🏁 to finish",
      ],
      tips: "Plan your path and take it slow — staying safe online means thinking a step ahead."
    },
    wordsearch: {
      title: "Privacy Word Search",
      description: "Find privacy words hidden in the grid. Each word is vocabulary your family can use when talking about online safety.",
      instructions: [
        "Look at the word list above the grid",
        "Tap letters one by one to spell a word",
        "Found words turn green in the list",
        "Find every word to finish",
      ],
      tips: "When you find PASSWORD or SECURE, ask your child where they've seen those ideas in real apps."
    },
    connectdots: {
      title: "Privacy Shield",
      description: "Connect the dots in order to build Privacy Panda's shield. The finished shield stands for the protection a strong password gives your accounts.",
      instructions: [
        "Tap the glowing yellow dot to start",
        "Connect the dots in order: 1, 2, 3 …",
        "Wrong taps flash red — just try the next number",
        "Finish the outline to reveal the shield 🛡️",
      ],
      tips: "The shield stands for protection — like a strong password that keeps your accounts locked to everyone but your family."
    },
    matching: {
      title: "Privacy Symbols",
      description: "Match each privacy icon to what it means. These symbols show up on websites and apps your family uses.",
      instructions: [
        "Tap a card to flip it",
        "Flip two cards at a time",
        "Match each emoji to its meaning",
        "Match every pair to finish",
      ],
      tips: "The lock and shield icons appear in browsers and apps — point them out on a site you visit together."
    },
    memory: {
      title: "Privacy Memory",
      description: "Flip cards to match privacy symbols with their meanings. Remembering the pairs helps you spot them in real life.",
      instructions: [
        "Tap a card to flip it",
        "Find matching symbol-and-meaning pairs",
        "Take your time — no rush",
        "Match all pairs to win",
      ],
      tips: "Talk about which symbol your child has seen before while you play."
    },
    quiz: {
      title: "Privacy Quiz",
      description: "Answer short questions about passwords, sharing, and staying safe. Every answer includes an explanation you can discuss.",
      instructions: [
        "Read each question together",
        "Pick the best answer",
        "Read the explanation before moving on",
        "Optional 30-second timer per question",
      ],
      tips: "Wrong answers are fine — the explanations are where the real learning happens."
    },
    'password-strength': {
      title: 'Password Strength Lab',
      description: 'Test passwords and learn what makes them strong or weak.',
      instructions: ['Type sample passwords in the lab', 'Read the feedback for each one', 'Try building a passphrase your family could remember', 'Finish when you have one strong example'],
      tips: 'Long passphrases beat short passwords with symbols. Never reuse passwords across accounts.',
    },
    'password-fortress': {
      title: 'Password Fortress Builder',
      description: 'Build a layered security plan with passphrases and two-factor authentication.',
      instructions: ['Follow each fortress layer', 'Note which accounts need the strongest protection', 'Discuss 2FA with a parent or guardian', 'Complete all layers to finish'],
      tips: 'Your email account is often the master key—protect it first.',
    },
    'phishing-detective': {
      title: 'Phishing Detective',
      description: 'Spot scam messages that pretend to be from games, schools, or prizes.',
      instructions: ['Read each message carefully', 'Decide if it is phishing or legitimate', 'Review the clues after each answer', 'Aim for a high score'],
      tips: 'Urgent rewards and odd links are common scam tricks. Go to official sites instead of clicking message links.',
    },
    'privacy-settings': {
      title: 'Privacy Settings Trainer',
      description: 'Practice changing privacy settings in a safe simulated app.',
      instructions: ['Walk through each setting screen', 'Choose options that limit public visibility', 'Compare choices with your family', 'Finish the trainer to save progress'],
      tips: 'Private accounts and limited location sharing are good defaults for teens.',
    },
    'social-media-audit': {
      title: 'Social Media Audit',
      description: 'Review a sample profile and improve privacy choices.',
      instructions: ['Inspect each profile section', 'Fix risky settings', 'Discuss what should stay public vs. friends-only', 'Complete the audit checklist'],
      tips: 'Assume screenshots and reposts can spread beyond your intended audience.',
    },
    'social-simulator': {
      title: 'Social Media Simulator',
      description: 'Make posting decisions and see how privacy choices play out.',
      instructions: ['Read each scenario', 'Choose how to post, share, or respond', 'Notice consequences in the feedback', 'Discuss better choices as a family'],
      tips: 'Pause before posting: who could see this, and for how long?',
    },
    'digital-rights': {
      title: 'Digital Rights Quiz',
      description: 'Learn about COPPA, GDPR, and your rights over personal data.',
      instructions: ['Answer each rights question', 'Read explanations for tricky topics', 'Talk with a parent about school or app consent', 'Finish when you reach the results screen'],
      tips: 'Laws give families rights to ask what data companies collect and to request deletion in many regions.',
    },
    'digital-footprint': {
      title: 'Digital Footprint Visualizer',
      description: 'See how online actions add up to a digital footprint over time.',
      instructions: ['Explore the timeline examples', 'Add or remove sample actions', 'Discuss which footprints feel permanent', 'Complete the reflection step'],
      tips: 'Even deleted posts can live on in screenshots—think before sharing.',
    },
    'safe-unsafe': {
      title: 'Safe vs Unsafe Sorting',
      description: 'Sort online behaviours into safe and unsafe categories.',
      instructions: ['Drag each item to the correct zone', 'Check your answers', 'Talk about any yellow-zone choices', 'Retry until you feel confident'],
      tips: 'When unsure, the family rule is: ask a trusted adult before sharing or clicking.',
    },
    'privacy-decoder': {
      title: 'Privacy Policy Decoder',
      description: 'Practice reading privacy policies in plain language.',
      instructions: ['Pick a sample policy section', 'Match jargon to plain meanings', 'List one setting you would change', 'Finish the decoder activity'],
      tips: 'Look for sections on data sharing, children, and deletion rights.',
    },
  };

  const activityContext: Record<string, ActivityContext> = {
    sorting: {
      missionTitle: 'Pack Your Digital Backpack',
      guideEmoji: '🐼',
      why: 'Some facts are friendly to share, and some are private — like your address or phone number. Sorting helps you tell them apart.',
      familyTalk: 'Name one thing that is safe to share and one thing to keep private on a favourite app.',
    },
    maze: {
      missionTitle: 'Traffic Light: Safe or Not?',
      guideEmoji: '🐼',
      why: 'Going online is like finding a safe path — you steer around anything that feels wrong and keep heading toward safety.',
      familyTalk: 'Talk about one “red light” moment online and what to do when something feels off.',
    },
    connectdots: {
      missionTitle: 'Secret Keeper Club',
      guideEmoji: '🛡️',
      why: 'Each dot builds a shield. A strong password works the same way — it locks your accounts so only your family gets in.',
      familyTalk: 'Agree on why a password stays secret, even from good friends.',
    },
    coloring: {
      missionTitle: 'Who Can I Talk To Online?',
      guideEmoji: '👨‍👩‍👧',
      why: 'While you color, think about trusted grown-ups — the people you can tell if an online message feels wrong.',
      familyTalk: 'Name two trusted adults your child can go to if a stranger messages them.',
    },
    memory: {
      missionTitle: 'My Public & Private Collage',
      guideEmoji: '🎨',
      why: 'Matching public vs private ideas is like sorting what belongs on a school website and what stays at home.',
      familyTalk: 'Name one hobby that is okay to share publicly and one detail to keep private.',
    },
    wordsearch: {
      missionTitle: 'Permission Please!',
      guideEmoji: '🤝',
      why: 'Privacy words like SECURE and PROTECT are the same language families use when asking before posting a photo.',
      familyTalk: 'Practice asking permission before sharing a family photo online.',
    },
    matching: {
      guideEmoji: '🔒',
      why: 'These icons appear on websites and apps — knowing them helps your family spot safer choices.',
      familyTalk: 'Open one app together and find a lock or privacy icon.',
    },
    quiz: {
      guideEmoji: '🧠',
      why: 'Quick questions turn privacy rules into habits you can use every day online.',
      familyTalk: 'Pick one answer you got wrong and decide what your family will do differently.',
    },
  };

  const currentActivity = activityInstructions[activityId as keyof typeof activityInstructions];

  useEffect(() => {
    // Show instructions for new activities
    setShowInstructions(true);
  }, [activityId]);

  // Progress persistence is handled by the parent (MissionShell.finishMission)
  // to avoid duplicate records — this only reports completion upward.
  const handleComplete = (score?: number) => {
    const validScore = score !== undefined && !isNaN(score) ? Math.round(score) : undefined;
    const scoreMessage = validScore !== undefined ? ` You scored ${validScore}%!` : '';
    showSuccess('Activity Completed!', `Great job!${scoreMessage}`);
    onComplete(activityId, validScore);
  };

  const handleStart = () => {
    setShowInstructions(false);
  };

  const handleRestart = () => {
    setShowInstructions(true);
  };

  const renderActivity = () => {
    // Create activity props with proper typing for onComplete callback
    const activityProps = {
      onComplete: (score?: number) => handleComplete(score),
      onClose: onClose
    };

    switch (activityId) {
      case 'coloring':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading coloring activity...</div>}>
            <ColoringActivity {...activityProps} context={activityContext.coloring} />
          </Suspense>
        );
      case 'sorting':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading sorting activity...</div>}>
            <DragDropActivity {...activityProps} context={activityContext.sorting} />
          </Suspense>
        );
      case 'maze':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading maze activity...</div>}>
            <MazeActivity {...activityProps} context={activityContext.maze} />
          </Suspense>
        );
      case 'wordsearch':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading word search activity...</div>}>
            <WordSearchActivity {...activityProps} context={activityContext.wordsearch} />
          </Suspense>
        );
      case 'connectdots':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading connect dots activity...</div>}>
            <ConnectDotsActivity {...activityProps} context={activityContext.connectdots} />
          </Suspense>
        );
      case 'matching':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading matching activity...</div>}>
            <MatchingActivity {...activityProps} context={activityContext.matching} />
          </Suspense>
        );
      case 'memory':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading memory game...</div>}>
            <MemoryGameActivity {...activityProps} context={activityContext.memory} />
          </Suspense>
        );
      case 'quiz':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading quiz...</div>}>
            <QuizActivity {...activityProps} context={activityContext.quiz} />
          </Suspense>
        );
      case 'password-strength':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading password lab...</div>}>
            <FamilyHubGame Game={PasswordStrengthLab} onClose={onClose} onComplete={activityProps.onComplete} />
          </Suspense>
        );
      case 'password-fortress':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading fortress builder...</div>}>
            <FamilyHubGame Game={PasswordFortressBuilder} onClose={onClose} onComplete={activityProps.onComplete} />
          </Suspense>
        );
      case 'phishing-detective':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading phishing detective...</div>}>
            <FamilyHubGame Game={PhishingDetective} onClose={onClose} onComplete={activityProps.onComplete} />
          </Suspense>
        );
      case 'privacy-settings':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading privacy settings trainer...</div>}>
            <FamilyHubGame Game={PrivacySettingsTrainer} onClose={onClose} onComplete={activityProps.onComplete} />
          </Suspense>
        );
      case 'social-media-audit':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading social media audit...</div>}>
            <FamilyHubGame Game={SocialMediaAudit} onClose={onClose} onComplete={activityProps.onComplete} />
          </Suspense>
        );
      case 'social-simulator':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading simulator...</div>}>
            <FamilyHubGame Game={SocialMediaSimulator} onClose={onClose} onComplete={activityProps.onComplete} />
          </Suspense>
        );
      case 'digital-rights':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading digital rights quiz...</div>}>
            <FamilyHubGame Game={DigitalRightsQuiz} onClose={onClose} onComplete={activityProps.onComplete} />
          </Suspense>
        );
      case 'digital-footprint':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading footprint visualizer...</div>}>
            <FamilyHubGame Game={DigitalFootprintVisualizer} onClose={onClose} onComplete={activityProps.onComplete} />
          </Suspense>
        );
      case 'safe-unsafe':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading sorting game...</div>}>
            <FamilyHubGame Game={SafeUnsafeSorting} onClose={onClose} onComplete={activityProps.onComplete} />
          </Suspense>
        );
      case 'privacy-decoder':
        return (
          <Suspense fallback={<div className="loading-spinner">Loading policy decoder...</div>}>
            <FamilyHubGame Game={PrivacyPolicyDecoder} onClose={onClose} onComplete={activityProps.onComplete} />
          </Suspense>
        );
      default:
        return <div>Activity not found</div>;
    }
  };

  return (
    <div className="activity-manager">
      {showInstructions && currentActivity ? (
        <div className="activity-instructions">
          <div className="instructions-header">
            <h2 className="instructions-title">{currentActivity.title}</h2>
            <button onClick={onClose} className="close-button">×</button>
          </div>

          <div className="instructions-content">
            <div className="instructions-description">
              <p>{currentActivity.description}</p>
            </div>

            <div className="instructions-steps">
              <h3>How to Play:</h3>
              <ol>
                {currentActivity.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>

            <div className="instructions-tips">
              <h3>💡 Tip:</h3>
              <p>{currentActivity.tips}</p>
            </div>

            <div className="instructions-actions">
            <button onClick={handleStart} className="start-button" aria-label="Start the activity">
              <Play size={20} />
              Start Activity
            </button>
            <button onClick={onClose} className="cancel-button" aria-label="Cancel and close activity">
              Cancel
            </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="activity-container">
          <div className="activity-header">
            <h2 className="activity-title">{currentActivity?.title}</h2>
            <div className="activity-controls">
              <button onClick={handleRestart} className="restart-button" title="Restart Activity" aria-label="Restart the activity">
                <RotateCcw size={20} />
              </button>
              <button onClick={onClose} className="close-button" aria-label="Close activity">×</button>
            </div>
          </div>
          {renderActivity()}
        </div>
      )}

      <style jsx>{`
        .activity-manager {
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

        .activity-instructions {
          background: white;
          margin: 20px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          margin: 20px auto;
        }

        .instructions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
          border-radius: 12px 12px 0 0;
        }

        .instructions-title {
          margin: 0;
          color: #2C3E50;
          font-size: 24px;
        }

        .instructions-content {
          padding: 20px;
        }

        .instructions-description {
          margin-bottom: 20px;
        }

        .instructions-description p {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
        }

        .instructions-steps {
          margin-bottom: 20px;
        }

        .instructions-steps h3 {
          color: #2C3E50;
          margin-bottom: 10px;
        }

        .instructions-steps ol {
          padding-left: 20px;
        }

        .instructions-steps li {
          margin-bottom: 8px;
          color: #666;
          line-height: 1.5;
        }

        .instructions-tips {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .instructions-tips h3 {
          margin: 0 0 8px 0;
          color: #856404;
          font-size: 16px;
        }

        .instructions-tips p {
          margin: 0;
          color: #856404;
          font-style: italic;
        }

        .instructions-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .start-button {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }

        .start-button:hover {
          background: #45a049;
        }

        .cancel-button {
          background: #f5f5f5;
          color: #666;
          border: 1px solid #ddd;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .cancel-button:hover {
          background: #e0e0e0;
        }

        .activity-container {
          background: white;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .activity-title {
          margin: 0;
          color: #2C3E50;
          font-size: 20px;
        }

        .activity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .restart-button {
          background: #f5f5f5;
          border: 1px solid #ddd;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          color: #666;
          transition: background 0.2s;
        }

        .restart-button:hover {
          background: #e0e0e0;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 4px;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          font-size: 16px;
          color: #666;
        }

        .loading-spinner::before {
          content: '';
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #4CAF50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }

        @media (max-width: 768px) {
          .activity-instructions {
            margin: 10px;
            max-height: 90vh;
          }

          .instructions-header {
            padding: 15px;
          }

          .instructions-title {
            font-size: 20px;
          }

          .instructions-content {
            padding: 15px;
          }

          .instructions-actions {
            flex-direction: column;
          }

          .start-button,
          .cancel-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityManager;