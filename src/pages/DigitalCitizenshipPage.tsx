import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Users, Shield, Heart, Brain, CheckCircle, Clock, BookOpen } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

interface Module {
  id: string;
  title: string;
  description: string;
  category: 'respect' | 'responsibility' | 'safety' | 'critical-thinking';
  duration: string;
  completed: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  lessons: string[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

const DigitalCitizenshipPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showModule, setShowModule] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentQuiz, setCurrentQuiz] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);

  const modules: Module[] = [
    {
      id: 'digital-respect',
      title: 'Digital Respect & Kindness',
      description: 'Learn how to be respectful and kind in online interactions, just like in real life.',
      category: 'respect',
      duration: '20 mins',
      completed: false,
      icon: Heart,
      lessons: [
        'Understanding digital communication',
        'Being respectful in online discussions',
        'Recognizing and preventing cyberbullying',
        'Building positive online relationships',
        'Handling disagreements online'
      ],
      quiz: [
        {
          question: 'What should you do if someone is being mean to you online?',
          options: ['Ignore them', 'Be mean back', 'Tell a trusted adult', 'Share it with everyone'],
          correct: 2
        },
        {
          question: 'Is it okay to share someone else\'s personal information without permission?',
          options: ['Yes, if it\'s funny', 'No, never', 'Only if they\'re mean', 'Only with close friends'],
          correct: 1
        }
      ]
    },
    {
      id: 'online-responsibility',
      title: 'Online Responsibility',
      description: 'Understand your responsibilities as a digital citizen and how your actions affect others.',
      category: 'responsibility',
      duration: '18 mins',
      completed: false,
      icon: Users,
      lessons: [
        'Understanding digital footprints',
        'Taking responsibility for your online actions',
        'Being honest and authentic online',
        'Respecting others\' privacy',
        'Contributing positively to online communities'
      ],
      quiz: [
        {
          question: 'What is a digital footprint?',
          options: ['Your shoe size', 'The trail of information you leave online', 'Your password', 'Your favorite website'],
          correct: 1
        },
        {
          question: 'Should you always be honest about who you are online?',
          options: ['No, it\'s safer to lie', 'Yes, but only sometimes', 'Yes, always be honest', 'It doesn\'t matter'],
          correct: 2
        }
      ]
    },
    {
      id: 'digital-safety',
      title: 'Digital Safety & Security',
      description: 'Learn how to protect yourself and others from online dangers and threats.',
      category: 'safety',
      duration: '25 mins',
      completed: false,
      icon: Shield,
      lessons: [
        'Recognizing online threats and scams',
        'Protecting personal information',
        'Safe sharing practices',
        'Understanding privacy settings',
        'Reporting inappropriate content'
      ],
      quiz: [
        {
          question: 'What should you do if a stranger asks for your personal information?',
          options: ['Give it to them', 'Ignore them and tell an adult', 'Ask them why they need it', 'Share it with friends first'],
          correct: 1
        },
        {
          question: 'Is it safe to meet someone you only know online?',
          options: ['Yes, if they seem nice', 'No, never meet online strangers alone', 'Only in public places', 'Only if your parents approve'],
          correct: 1
        }
      ]
    },
    {
      id: 'critical-thinking',
      title: 'Critical Thinking Online',
      description: 'Develop skills to evaluate information, spot fake news, and think critically about online content.',
      category: 'critical-thinking',
      duration: '22 mins',
      completed: false,
      icon: Brain,
      lessons: [
        'Identifying reliable sources',
        'Recognizing fake news and misinformation',
        'Questioning what you see online',
        'Fact-checking information',
        'Developing media literacy skills'
      ],
      quiz: [
        {
          question: 'How can you tell if information online is reliable?',
          options: ['If it has lots of likes', 'Check multiple sources and look for evidence', 'If it sounds exciting', 'If your friend shared it'],
          correct: 1
        },
        {
          question: 'What should you do if you see something that seems too good to be true?',
          options: ['Share it immediately', 'Question it and verify', 'Believe it anyway', 'Ignore it completely'],
          correct: 1
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Modules', icon: Globe },
    { id: 'respect', label: 'Respect & Kindness', icon: Heart },
    { id: 'responsibility', label: 'Responsibility', icon: Users },
    { id: 'safety', label: 'Safety & Security', icon: Shield },
    { id: 'critical-thinking', label: 'Critical Thinking', icon: Brain }
  ];

  const filteredModules = activeCategory === 'all'
    ? modules
    : modules.filter(module => module.category === activeCategory);

  useEffect(() => {
    // Load completed modules from localStorage
    const savedCompleted = localStorage.getItem('digital_citizenship_completed');
    if (savedCompleted) {
      setCompletedModules(JSON.parse(savedCompleted));
    }
  }, []);

  const handleModuleStart = (module: Module) => {
    setSelectedModule(module);
    setShowModule(true);
    setCurrentQuiz(0);
    setQuizAnswers([]);
    setShowQuiz(false);
  };

  const handleModuleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      const newCompleted = [...completedModules, moduleId];
      setCompletedModules(newCompleted);
      localStorage.setItem('digital_citizenship_completed', JSON.stringify(newCompleted));
    }
    setShowModule(false);
    setSelectedModule(null);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);

    if (currentQuiz < (selectedModule?.quiz.length || 0) - 1) {
      setCurrentQuiz(currentQuiz + 1);
    } else {
      // Quiz completed
      setShowQuiz(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryInfo = categories.find(cat => cat.id === category);
    return categoryInfo ? categoryInfo.icon : Globe;
  };

  const getQuizScore = () => {
    if (!selectedModule) {return 0;}
    let correct = 0;
    selectedModule.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / selectedModule.quiz.length) * 100);
  };

  return (
    <PageLayout
      title="Digital Citizenship Academy"
      subtitle="Short lessons about being kind and safe online. Pick a module below—each takes about 15 minutes."
      breadcrumbs={true}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
                Your academy progress
              </h2>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{completedModules.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Modules completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{modules.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((completedModules.length / modules.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Overall progress</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section>
        <div className="mb-6 text-center">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Browse by category
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  aria-pressed={activeCategory === category.id}
                  className={`flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-green-700 text-white dark:bg-green-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            const CategoryIcon = getCategoryIcon(module.category);
            const isCompleted = completedModules.includes(module.id);

            return (
              <div
                key={module.id}
                role="button"
                tabIndex={0}
                className={`cursor-pointer rounded-2xl border bg-white dark:bg-gray-800 ${
                  isCompleted
                    ? 'border-green-600 dark:border-green-500'
                    : 'border-gray-200 hover:border-green-400 dark:border-gray-700 dark:hover:border-green-500'
                }`}
                onClick={() => handleModuleStart(module)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleModuleStart(module);
                  }
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-700 text-white">
                      <Icon size={24} />
                    </div>
                    {isCompleted && (
                      <CheckCircle size={24} className="text-green-500" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <CategoryIcon size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500 capitalize">{module.category.replace('-', ' ')}</span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                    {module.title}
                  </h3>

                  <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                    {module.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {module.duration}
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      {module.lessons.length} lessons
                    </span>
                  </div>

                  <button
                    className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModuleStart(module);
                    }}
                  >
                    {isCompleted ? 'Review Module' : 'Start Learning'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Module Modal */}
      {showModule && selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedModule.title}
                </h3>
                <button
                  onClick={() => setShowModule(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-lg mb-6 text-gray-600">
                  {selectedModule.description}
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold mb-4 text-primary">
                    What You'll Learn:
                  </h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    {selectedModule.lessons.map((lesson, index) => (
                      <li key={index}>{lesson}</li>
                    ))}
                  </ul>
                </div>

                {!showQuiz ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {selectedModule.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={16} />
                        {selectedModule.lessons.length} lessons
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowQuiz(true)}
                        className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Take Quiz
                      </button>
                      <button
                        onClick={() => handleModuleComplete(selectedModule.id)}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-4 text-primary">
                      Quiz: {currentQuiz + 1} of {selectedModule.quiz.length}
                    </h4>
                    <p className="mb-4 text-gray-600">
                      {selectedModule.quiz[currentQuiz].question}
                    </p>
                    <div className="space-y-2">
                      {selectedModule.quiz[currentQuiz].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuizAnswer(index)}
                          className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {currentQuiz === selectedModule.quiz.length - 1 && (
                      <div className="mt-4 text-center">
                        <p className="text-lg font-semibold text-primary">
                          Quiz Complete! Score: {getQuizScore()}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

        <section className="rounded-2xl bg-green-700 p-6 text-center text-white sm:p-8 dark:bg-green-800">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Ready to practice online kindness?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-green-50">
            Read a module, then try a Family Hub mission if you want a family conversation on this device.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/family-hub/activities"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-green-800 hover:bg-green-50"
            >
              <Shield size={20} aria-hidden />
              Privacy missions
            </Link>
            <Link
              to="/family-hub"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border-2 border-white px-5 py-2.5 font-semibold text-white hover:bg-white/10"
            >
              <Users size={20} aria-hidden />
              Family Hub
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default DigitalCitizenshipPage;