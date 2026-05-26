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

  const handlePrintGuide = () => {
    window.print();
  };

  return (
    <PageLayout
      title="Privacy Panda Classroom Activities"
      subtitle="Chapter-by-chapter activities aligned with 'Privacy Panda and the Digital Bamboo Forest' story. Perfect for educators teaching digital privacy to children ages 5-8."
      breadcrumbs={true}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="mb-8 rounded-r-lg border-l-4 border-green-500 bg-green-50 p-6 dark:border-green-600 dark:bg-green-950/30">
          <h2 className="mb-3 text-2xl font-bold text-green-800 dark:text-green-300">
            Introduction for Educators
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            &ldquo;Privacy Panda and the Digital Bamboo Forest&rdquo; provides an excellent framework for introducing essential digital privacy concepts to children ages 5-8. This guide offers classroom activities designed to reinforce the lessons from each chapter of the story, helping you extend the learning experience in an engaging, interactive way.
          </p>
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            Each set of activities includes learning objectives aligned with the story&apos;s themes, materials needed, detailed instructions, discussion prompts, assessment opportunities, and adaptations for different learning needs.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              to="/story"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              <BookOpen size={18} aria-hidden />
              Read the Story
            </Link>
            <Link
              to="/downloads/worksheets"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <Download size={18} aria-hidden />
              Printable worksheets
            </Link>
            <button
              type="button"
              onClick={handlePrintGuide}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-800 transition-colors hover:bg-gray-50 print:hidden dark:border-gray-600 dark:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <FileText size={18} aria-hidden />
              Print this guide
            </button>
          </div>
        </section>

        <section className="mb-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-950/30">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <Lightbulb size={24} />
            General Tips for Teaching Digital Privacy
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
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
        </section>

        {/* Chapters */}
        {classroomActivities.map((chapter) => {
          const isExpanded = expandedChapters.has(chapter.id);
          return (
            <div
              key={chapter.id}
              className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-200"
            >
              <button
                type="button"
                onClick={() => toggleChapter(chapter.id)}
                aria-expanded={isExpanded}
                className={`flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:bg-gray-700/50 ${
                  isExpanded ? 'bg-gray-50 dark:bg-gray-700/30' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                    {chapter.number}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Chapter {chapter.number}: {chapter.title}
                    </h2>
                    {chapter.storyQuote && (
                      <p className="mt-1 flex items-center gap-2 text-sm italic text-gray-600 dark:text-gray-400">
                        <Quote size={14} aria-hidden />
                        {chapter.storyQuote}
                      </p>
                    )}
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={24} aria-hidden /> : <ChevronDown size={24} aria-hidden />}
              </button>

              {/* Chapter Content */}
              {isExpanded && (
                <div className="px-6 pb-6">
                  {/* Story Connection */}
                  <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                      <BookOpen size={18} aria-hidden />
                      Story Connection
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{chapter.storyConnection}</p>
                  </div>

                  {/* Activities */}
                  <div className="space-y-4">
                    {chapter.activities.map((activity) => {
                      const isActivityExpanded = expandedActivities.has(activity.id);
                      return (
                        <div
                          key={activity.id}
                          className="overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-600"
                        >
                          <button
                            type="button"
                            onClick={() => toggleActivity(activity.id)}
                            aria-expanded={isActivityExpanded}
                            className={`flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:bg-gray-700/50 ${
                              isActivityExpanded ? 'bg-gray-50 dark:bg-gray-700/30' : ''
                            }`}
                          >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {activity.title}
                            </h3>
                            {isActivityExpanded ? <ChevronUp size={20} aria-hidden /> : <ChevronDown size={20} aria-hidden />}
                          </button>

                          {isActivityExpanded && (
                            <div className="space-y-4 bg-gray-50 p-4 dark:bg-gray-100/40">
                              {/* Learning Objective */}
                              <div>
                                <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                  <GraduationCap size={18} />
                                  Learning Objective
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300">{activity.learningObjective}</p>
                              </div>

                              {/* Story Connection */}
                              {activity.storyConnection && (
                                <div className="rounded bg-green-50 p-3 dark:bg-green-950/30">
                                  <h4 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                                    Story Connection
                                  </h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {activity.storyConnection}
                                  </p>
                                </div>
                              )}

                              {/* Materials */}
                              <div>
                                <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                  <ClipboardList size={18} />
                                  Materials
                                </h4>
                                <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
                                  {activity.materials.map((material, idx) => (
                                    <li key={idx}>{material}</li>
                                  ))}
                                </ul>
                              </div>

                              {/* Instructions */}
                              <div>
                                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                  Instructions
                                </h4>
                                <ol className="list-inside list-decimal space-y-2 text-gray-700 dark:text-gray-300">
                                  {activity.instructions.map((instruction, idx) => (
                                    <li key={idx}>{instruction}</li>
                                  ))}
                                </ol>
                              </div>

                              {/* Scenario Examples */}
                              {activity.scenarioExamples && activity.scenarioExamples.length > 0 && (
                                <div>
                                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                    Scenario Examples
                                  </h4>
                                  <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
                                    {activity.scenarioExamples.map((scenario, idx) => (
                                      <li key={idx} className="italic">"{scenario}"</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Discussion Prompts */}
                              <div>
                                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                  Discussion Prompts
                                </h4>
                                <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
                                  {activity.discussionPrompts.map((prompt, idx) => (
                                    <li key={idx}>"{prompt}"</li>
                                  ))}
                                </ul>
                              </div>

                              {/* Assessment */}
                              <div>
                                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                  Assessment
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300">{activity.assessment}</p>
                              </div>

                              {/* Adaptations */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded bg-yellow-50 p-3 dark:bg-yellow-950/30">
                                  <h4 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                                    For Younger Students
                                  </h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {activity.adaptations.younger}
                                  </p>
                                </div>
                                <div className="rounded bg-purple-50 p-3 dark:bg-purple-950/30">
                                  <h4 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                                    For Advanced Students
                                  </h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
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

        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-200">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Cross-Curricular Connections
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <BookOpen size={20} aria-hidden />
                Language Arts
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {crossCurricularConnections.languageArts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Palette size={20} aria-hidden />
                Art
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {crossCurricularConnections.art.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Calculator size={20} aria-hidden />
                Math
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {crossCurricularConnections.math.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Globe size={20} aria-hidden />
                Social Studies
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {crossCurricularConnections.socialStudies.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <FlaskConical size={20} aria-hidden />
                Science
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {crossCurricularConnections.science.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-200">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <FileText size={28} aria-hidden />
            Assessment Tools
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                Observation Checklist
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {assessmentTools.observationChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Digital Privacy Scenario Cards
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{assessmentTools.digitalPrivacyScenarioCards}</p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Privacy Concept Map
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{assessmentTools.privacyConceptMap}</p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Exit Tickets
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{assessmentTools.exitTickets}</p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Culminating Project
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{assessmentTools.culminatingProject}</p>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 p-6 dark:from-blue-950/30 dark:to-green-950/30">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Family Connection
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Maintaining consistency between school and home is crucial for reinforcing privacy concepts. Consider:
          </p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
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
              <span>Hosting a &ldquo;Privacy Panda Family Night&rdquo; where students can teach their families what they&apos;ve learned</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-1 flex-shrink-0" />
              <span>Providing a list of recommended privacy-focused books and media for families</span>
            </li>
          </ul>
        </section>

        <section className="mb-8 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Use These Activities?
          </h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            These activities are designed to be flexible and can be adjusted to fit your classroom&apos;s specific needs, schedule, and available resources.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/educator-tools"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-600 transition-colors hover:bg-gray-100"
            >
              <Users size={20} aria-hidden />
              More Educator Resources
            </Link>
            <Link
              to="/story"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-green-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-900"
            >
              <BookOpen size={20} aria-hidden />
              Read the Story
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default ClassroomActivitiesPage;

