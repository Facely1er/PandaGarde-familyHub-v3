import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Target,
  Info,
  BarChart3,
  Lightbulb,
  Download,
  FileText
} from 'lucide-react';
import {
  assessmentQuestions,
  familyPrivacyAssessment,
  type AssessmentQuestion,
  type AssessmentAnswer,
  type AssessmentResult
} from '../lib/familyPrivacyAssessment';
import { familyPersonaDetectionEngine, type PersonaDetectionResult } from '../lib/familyPersonaDetection';
import { familyPrivacyReportGenerator } from '../lib/familyPrivacyReportGenerator';
import { useFamily } from '../contexts/FamilyContext';

interface FamilyPrivacyAssessmentProps {
  onComplete?: (result: AssessmentResult) => void;
  compact?: boolean;
}

const FamilyPrivacyAssessment: React.FC<FamilyPrivacyAssessmentProps> = ({
  onComplete,
  compact = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [personaResult, setPersonaResult] = useState<PersonaDetectionResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const { currentFamily } = useFamily();

  const currentQuestion = assessmentQuestions[currentStep];
  const progress = ((currentStep + 1) / assessmentQuestions.length) * 100;

  const handleAnswer = (value: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const answerArray: AssessmentAnswer[] = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value
    }));

    const assessmentResult = familyPrivacyAssessment.calculateScore(answerArray);
    setResult(assessmentResult);
    
    // Detect persona
    const persona = familyPersonaDetectionEngine.analyzeAssessmentResults(assessmentResult, answerArray);
    setPersonaResult(persona);
    
    // Store persona in localStorage
    localStorage.setItem('pandagarde_family_persona', JSON.stringify(persona));
    
    setShowResults(true);
    
    if (onComplete) {
      onComplete(assessmentResult);
    }
  };

  const handleDownloadReport = async () => {
    if (!result) {return;}
    
    setIsGeneratingReport(true);
    try {
      await familyPrivacyReportGenerator.downloadReport(
        result,
        personaResult || undefined,
        {
          familyName: currentFamily?.name || 'Your Family',
          assessmentDate: new Date().toLocaleDateString(),
          includePersona: !!personaResult,
          includeRecommendations: true
        }
      );
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setShowResults(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data-sharing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'privacy-settings':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'online-behavior':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'device-security':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'parental-controls':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) {return 'text-green-600 dark:text-green-400';}
    if (score >= 50) {return 'text-yellow-600 dark:text-yellow-400';}
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (showResults && result) {
    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Assessment Complete!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your family's privacy practices assessment
              </p>
              {personaResult?.profile && (
                <div className="mt-2 flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Your Family Profile: <strong>{personaResult.profile.name}</strong>
                  </span>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Privacy Score</div>
              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(result.riskLevel)}`}>
                {result.riskLevel.toUpperCase()} RISK
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                result.overallScore >= 75 ? 'bg-green-500' :
                result.overallScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${result.overallScore}%` }}
            />
          </div>
        </div>

        {/* Category Scores */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Category Breakdown</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result.categoryScores).map(([category, score]) => (
              <div
                key={category}
                className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(category)}`}>
                    {category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                  <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                    {score}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      score >= 75 ? 'bg-green-500' :
                      score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.strengths.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                  Strengths
                </h3>
              </div>
              <ul className="space-y-2">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2 text-green-800 dark:text-green-200">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.weaknesses.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                  Areas for Improvement
                </h3>
              </div>
              <ul className="space-y-2">
                {result.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start space-x-2 text-red-800 dark:text-red-200">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personalized Recommendations
              </h3>
            </div>
            <div className="space-y-4">
              {result.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-4 rounded-lg border-2 ${
                    rec.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {rec.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {rec.description}
                      </p>
                      <ul className="space-y-1">
                        {rec.actionItems.map((item, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Target className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {rec.resources && rec.resources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        {rec.resources.map((resource, index) => (
                          <Link
                            key={index}
                            to={resource.url}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center space-x-1"
                          >
                            <span>{resource.label}</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadReport}
              disabled={isGeneratingReport}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>{isGeneratingReport ? 'Generating...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={handleRestart}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Retake Assessment
            </button>
            <Link
              to="/assessment-history"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View History
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/privacy-goals"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Target className="h-4 w-4" />
              <span>Set Goals</span>
            </Link>
            <Link
              to="/digital-footprint"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>View Digital Footprint</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-900 dark:text-white">Privacy Assessment</span>
          </div>
          <Link
            to="/privacy-assessment"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Take Assessment →
          </Link>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Assess your family's privacy practices and get personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Question {currentStep + 1} of {assessmentQuestions.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentQuestion.category)}`}>
            {currentQuestion.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {currentQuestion.question}
        </h2>

        {currentQuestion.description && (
          <div className="flex items-start space-x-2 mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {currentQuestion.description}
            </p>
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.type === 'yes-no' && (
            <>
              <button
                onClick={() => handleAnswer('yes')}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  answers[currentQuestion.id] === 'yes'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion.id] === 'yes'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {answers[currentQuestion.id] === 'yes' && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Yes</span>
                </div>
              </button>
              <button
                onClick={() => handleAnswer('no')}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  answers[currentQuestion.id] === 'no'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion.id] === 'no'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {answers[currentQuestion.id] === 'no' && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">No</span>
                </div>
              </button>
            </>
          )}

          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion.id] === option
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion.id] === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {answers[currentQuestion.id] === option && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{option}</span>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span>{currentStep === assessmentQuestions.length - 1 ? 'Complete' : 'Next'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default FamilyPrivacyAssessment;

