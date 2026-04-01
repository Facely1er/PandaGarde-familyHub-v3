import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Download, ChevronDown, ChevronUp, Quote, Lightbulb, ClipboardList, GraduationCap, Palette, Calculator, Globe, FlaskConical, CheckCircle, FileText } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { classroomActivities, crossCurricularConnections, assessmentTools } from '../data/classroomActivities';

const ClassroomActivitiesPage: React.FC = () => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const toggleActivity = (activityId: string) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate/download a PDF
    alert('PDF download would be generated here. This feature will be available soon!');
  };

  return (
    <PageLayout
      title="Privacy Panda Classroom Activities"
      subtitle="Chapter-by-chapter activities aligned with 'Privacy Panda and the Digital Bamboo Forest' story. Perfect for educators teaching digital privacy to children ages 5-8."
      icon={BookOpen}
      badge="EDUCATOR RESOURCES"
      breadcrumbs={true}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Introduction Section */}
        <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8 rounded-r-lg"
             style={{
               backgroundColor: 'var(--light)',
               borderLeftColor: 'var(--primary-light)'
             }}>
          <h2 className="text-2xl font-bold text-green-800 mb-3" style={{ color: 'var(--primary)' }}>
            Introduction for Educators
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4" style={{ color: 'var(--gray-600)' }}>
            "Privacy Panda and the Digital Bamboo Forest" provides an excellent framework for introducing essential digital privacy concepts to children ages 5-8. This guide offers classroom activities designed to reinforce the lessons from each chapter of the story, helping you extend the learning experience in an engaging, interactive way.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4" style={{ color: 'var(--gray-600)' }}>
            Each set of activities includes learning objectives aligned with the story's themes, materials needed, detailed instructions, discussion prompts, assessment opportunities, and adaptations for different learning needs.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              to="/story"
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <BookOpen size={18} />
              Read the Story
            </Link>
            <button
              onClick={handleDownloadPDF}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
            >
              <Download size={18} />
              Download PDF
            </button>
          </div>
        </div>

        {/* General Tips */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8" style={{ backgroundColor: 'var(--light)' }}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
            <Lightbulb size={24} />
            General Tips for Teaching Digital Privacy
          </h3>
          <ul className="space-y-2" style={{ color: 'var(--gray-700)' }}>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Use concrete examples that children can relate to in their daily lives</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Avoid technical jargon that may confuse young learners</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Create a safe space where children feel comfortable asking questions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Be mindful that children may have varying levels of access to technology at home</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Connect with families to ensure consistent messaging about privacy</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Model good privacy practices in your own technology use</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Keep it positive, focusing on empowerment rather than fear</span>
            </li>
          </ul>
        </div>

        {/* Chapters */}
        {classroomActivities.map((chapter) => {
          const isExpanded = expandedChapters.has(chapter.id);
          return (
            <div
              key={chapter.id}
              className="bg-white rounded-xl shadow-md mb-6 overflow-hidden"
              style={{
                backgroundColor: 'var(--card-color)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {/* Chapter Header */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: isExpanded ? 'var(--light)' : undefined }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                    {chapter.number}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                      Chapter {chapter.number}: {chapter.title}
                    </h2>
                    {chapter.storyQuote && (
                      <p className="text-sm mt-1 italic flex items-center gap-2" style={{ color: 'var(--gray-600)' }}>
                        <Quote size={14} />
                        {chapter.storyQuote}
                      </p>
                    )}
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              {/* Chapter Content */}
              {isExpanded && (
                <div className="px-6 pb-6">
                  {/* Story Connection */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6" style={{ backgroundColor: 'var(--light)' }}>
                    <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                      <BookOpen size={18} />
                      Story Connection
                    </h3>
                    <p style={{ color: 'var(--gray-700)' }}>{chapter.storyConnection}</p>
                  </div>

                  {/* Activities */}
                  <div className="space-y-4">
                    {chapter.activities.map((activity) => {
                      const isActivityExpanded = expandedActivities.has(activity.id);
                      return (
                        <div
                          key={activity.id}
                          className="border-2 rounded-lg overflow-hidden"
                          style={{ borderColor: 'var(--gray-300)' }}
                        >
                          <button
                            onClick={() => toggleActivity(activity.id)}
                            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            style={{ backgroundColor: isActivityExpanded ? 'var(--light)' : undefined }}
                          >
                            <h3 className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
                              {activity.title}
                            </h3>
                            {isActivityExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>

                          {isActivityExpanded && (
                            <div className="p-4 space-y-4" style={{ backgroundColor: 'var(--light)' }}>
                              {/* Learning Objective */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                                  <GraduationCap size={18} />
                                  Learning Objective
                                </h4>
                                <p style={{ color: 'var(--gray-700)' }}>{activity.learningObjective}</p>
                              </div>

                              {/* Story Connection */}
                              {activity.storyConnection && (
                                <div className="bg-green-50 rounded p-3">
                                  <h4 className="font-semibold mb-1 text-sm" style={{ color: 'var(--primary)' }}>
                                    Story Connection
                                  </h4>
                                  <p className="text-sm" style={{ color: 'var(--gray-700)' }}>
                                    {activity.storyConnection}
                                  </p>
                                </div>
                              )}

                              {/* Materials */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                                  <ClipboardList size={18} />
                                  Materials
                                </h4>
                                <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--gray-700)' }}>
                                  {activity.materials.map((material, idx) => (
                                    <li key={idx}>{material}</li>
                                  ))}
                                </ul>
                              </div>

                              {/* Instructions */}
                              <div>
                                <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                                  Instructions
                                </h4>
                                <ol className="list-decimal list-inside space-y-2" style={{ color: 'var(--gray-700)' }}>
                                  {activity.instructions.map((instruction, idx) => (
                                    <li key={idx}>{instruction}</li>
                                  ))}
                                </ol>
                              </div>

                              {/* Scenario Examples */}
                              {activity.scenarioExamples && activity.scenarioExamples.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                                    Scenario Examples
                                  </h4>
                                  <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--gray-700)' }}>
                                    {activity.scenarioExamples.map((scenario, idx) => (
                                      <li key={idx} className="italic">"{scenario}"</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Discussion Prompts */}
                              <div>
                                <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                                  Discussion Prompts
                                </h4>
                                <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--gray-700)' }}>
                                  {activity.discussionPrompts.map((prompt, idx) => (
                                    <li key={idx}>"{prompt}"</li>
                                  ))}
                                </ul>
                              </div>

                              {/* Assessment */}
                              <div>
                                <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                                  Assessment
                                </h4>
                                <p style={{ color: 'var(--gray-700)' }}>{activity.assessment}</p>
                              </div>

                              {/* Adaptations */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-yellow-50 rounded p-3">
                                  <h4 className="font-semibold mb-1 text-sm" style={{ color: 'var(--primary)' }}>
                                    For Younger Students
                                  </h4>
                                  <p className="text-sm" style={{ color: 'var(--gray-700)' }}>
                                    {activity.adaptations.younger}
                                  </p>
                                </div>
                                <div className="bg-purple-50 rounded p-3">
                                  <h4 className="font-semibold mb-1 text-sm" style={{ color: 'var(--primary)' }}>
                                    For Advanced Students
                                  </h4>
                                  <p className="text-sm" style={{ color: 'var(--gray-700)' }}>
                                    {activity.adaptations.advanced}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Cross-Curricular Connections */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6" style={{ backgroundColor: 'var(--card-color)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
            Cross-Curricular Connections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                <BookOpen size={20} />
                Language Arts
              </h3>
              <ul className="space-y-2" style={{ color: 'var(--gray-700)' }}>
                {crossCurricularConnections.languageArts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                <Palette size={20} />
                Art
              </h3>
              <ul className="space-y-2" style={{ color: 'var(--gray-700)' }}>
                {crossCurricularConnections.art.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                <Calculator size={20} />
                Math
              </h3>
              <ul className="space-y-2" style={{ color: 'var(--gray-700)' }}>
                {crossCurricularConnections.math.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                <Globe size={20} />
                Social Studies
              </h3>
              <ul className="space-y-2" style={{ color: 'var(--gray-700)' }}>
                {crossCurricularConnections.socialStudies.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                <FlaskConical size={20} />
                Science
              </h3>
              <ul className="space-y-2" style={{ color: 'var(--gray-700)' }}>
                {crossCurricularConnections.science.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Assessment Tools */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6" style={{ backgroundColor: 'var(--card-color)' }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--primary)' }}>
            <FileText size={28} />
            Assessment Tools
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                Observation Checklist
              </h3>
              <ul className="space-y-2" style={{ color: 'var(--gray-700)' }}>
                {assessmentTools.observationChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Digital Privacy Scenario Cards
              </h3>
              <p style={{ color: 'var(--gray-700)' }}>{assessmentTools.digitalPrivacyScenarioCards}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Privacy Concept Map
              </h3>
              <p style={{ color: 'var(--gray-700)' }}>{assessmentTools.privacyConceptMap}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Exit Tickets
              </h3>
              <p style={{ color: 'var(--gray-700)' }}>{assessmentTools.exitTickets}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                Culminating Project
              </h3>
              <p style={{ color: 'var(--gray-700)' }}>{assessmentTools.culminatingProject}</p>
            </div>
          </div>
        </div>

        {/* Family Connection */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8" style={{ backgroundColor: 'var(--light)' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
            Family Connection
          </h2>
          <p className="mb-4" style={{ color: 'var(--gray-700)' }}>
            Maintaining consistency between school and home is crucial for reinforcing privacy concepts. Consider:
          </p>
          <ul className="space-y-2" style={{ color: 'var(--gray-700)' }}>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Sending home a summary of privacy concepts covered in class</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Creating a simple family activity to accompany each chapter</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Sharing resources for parents to continue the conversation at home</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Hosting a "Privacy Panda Family Night" where students can teach their families what they've learned</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Providing a list of recommended privacy-focused books and media for families</span>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-8 text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Use These Activities?
          </h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            These activities are designed to be flexible and can be adjusted to fit your classroom's specific needs, schedule, and available resources.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/educator-tools"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <Users size={20} />
              More Educator Resources
            </Link>
            <Link
              to="/story"
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors inline-flex items-center gap-2"
            >
              <BookOpen size={20} />
              Read the Story
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClassroomActivitiesPage;

