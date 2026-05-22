import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ORIGIN_STORY_SLUG } from './data/stories';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { SearchProvider } from './contexts/SearchContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { FamilyProgressProvider } from './contexts/FamilyProgressContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ErrorFallback from './components/ui/ErrorFallback';
import PageLoader from './components/ui/PageLoader';
import { usePageTracking } from './hooks/useAnalytics';
import NavigationErrorBoundary from './components/NavigationErrorBoundary';
import { SentryErrorBoundary } from './lib/sentry';

const HomePage = lazy(() => import('./pages/HomePage'));
const ActivityBookPage = lazy(() => import('./pages/ActivityBookPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AgeGroupsPage = lazy(() => import('./pages/AgeGroupsPage'));
const ImplementationPage = lazy(() => import('./pages/ImplementationPage'));
const FamilyHubWrapper = lazy(() => import('./pages/family-hub/FamilyHubWrapper'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const GetStartedPage = lazy(() => import('./pages/GetStartedPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));
const AccessibilityPage = lazy(() => import('./pages/AccessibilityPage'));
const PrivacyExplorersPage = lazy(() => import('./pages/PrivacyExplorersPage'));
const PrivacyHandbookPage = lazy(() => import('./pages/PrivacyHandbookPage'));
const DigitalCitizenshipPage = lazy(() => import('./pages/DigitalCitizenshipPage'));
const TeenHandbookPage = lazy(() => import('./pages/TeenHandbookPage'));
const PrivacyToolsPage = lazy(() => import('./pages/PrivacyToolsPage'));
const DigitalRightsPage = lazy(() => import('./pages/DigitalRightsPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const DownloadGuidePage = lazy(() => import('./pages/DownloadGuidePage'));
const ColoringSheetsPage = lazy(() => import('./pages/ColoringSheetsPage'));
const SafetyPostersPage = lazy(() => import('./pages/SafetyPostersPage'));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage'));
const FamilyAgreementPage = lazy(() => import('./pages/FamilyAgreementPage'));
const DeviceSetupGuidePage = lazy(() => import('./pages/DeviceSetupGuidePage'));
const AppSelectionGuidePage = lazy(() => import('./pages/AppSelectionGuidePage'));
const ModelingBehaviorGuidePage = lazy(() => import('./pages/ModelingBehaviorGuidePage'));
const PrivacyConcernsGuidePage = lazy(() => import('./pages/PrivacyConcernsGuidePage'));
const FamilyPrivacyGuidePage = lazy(() => import('./pages/guides/FamilyPrivacyGuidePage'));
const EmergencySafetyGuidePage = lazy(() => import('./pages/guides/EmergencySafetyGuidePage'));
const AgeSpecificGuidePage = lazy(() => import('./pages/guides/AgeSpecificGuidePage'));
const ConversationApproachesPage = lazy(() => import('./pages/guides/ConversationApproachesPage'));
const SafetyNetPage = lazy(() => import('./pages/guides/SafetyNetPage'));
const AgeSpecificPrivacyPage = lazy(() => import('./pages/guides/AgeSpecificPrivacyPage'));
const FamilyPrivacyPlanPage = lazy(() => import('./pages/FamilyPrivacyPlanPage'));
const EducatorToolsPage = lazy(() => import('./pages/EducatorToolsPage'));
const ClassroomActivitiesPage = lazy(() => import('./pages/ClassroomActivitiesPage'));
const NewsletterPage = lazy(() => import('./pages/NewsletterPage'));
const UnsubscribePage = lazy(() => import('./pages/UnsubscribePage'));
const NewsletterArchivePage = lazy(() => import('./pages/NewsletterArchivePage'));
const NewsletterIssuePage = lazy(() => import('./pages/NewsletterIssuePage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const ImplementationGuidePage = lazy(() => import('./pages/ImplementationGuidePage'));
const OverviewPage = lazy(() => import('./pages/OverviewPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const QuickStartPage = lazy(() => import('./pages/QuickStartPage'));
const ParentToolkitPage = lazy(() => import('./pages/ParentToolkitPage'));
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage'));
const PrivacyLearningKitPage = lazy(() => import('./pages/PrivacyLearningKitPage'));
const WorksheetsPage = lazy(() => import('./pages/WorksheetsPage'));
const PilotPage = lazy(() => import('./pages/PilotPage'));
const ChildSafetyAlertsPage = lazy(() => import('./pages/ChildSafetyAlertsPage'));
const ServiceCatalogPage = lazy(() => import('./pages/ServiceCatalogPage'));
const ParentalConsentPage = lazy(() => import('./pages/ParentalConsentPage'));
const ParentalConsentPendingPage = lazy(() => import('./pages/ParentalConsentPendingPage'));
const DigitalFootprintPage = lazy(() => import('./pages/DigitalFootprintPage'));
const PrivacyAssessmentPage = lazy(() => import('./pages/PrivacyAssessmentPage'));
const AssessmentHistoryPage = lazy(() => import('./pages/AssessmentHistoryPage'));
const PrivacyGoalsPage = lazy(() => import('./pages/PrivacyGoalsPage'));
const QuickAssessmentPage = lazy(() => import('./pages/QuickAssessmentPage'));
const SuccessStoriesPage = lazy(() => import('./pages/community/SuccessStoriesPage'));
const ResourceSharingPage = lazy(() => import('./pages/community/ResourceSharingPage'));
const PrivacyTipsForumPage = lazy(() => import('./pages/community/PrivacyTipsForumPage'));
const AppFeaturesPage = lazy(() => import('./pages/AppFeaturesPage'));
const AppStoreReviewPage = lazy(() => import('./pages/AppStoreReviewPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const StoryListPage = lazy(() =>
  import('./pages/StoryListPage').then((m) => ({ default: m.StoryListPage }))
);
const StoryReaderPage = lazy(() =>
  import('./pages/StoryReaderPage').then((m) => ({ default: m.StoryReaderPage }))
);

// Component to handle hash navigation
const HashHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Wait for the page to render, then scroll to the element
      const scrollToElement = () => {
        const element = document.querySelector(location.hash);
        if (element) {
          // Use requestAnimationFrame for better timing
          requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          });
        } else {
          // If element not found, try again after a short delay
          setTimeout(scrollToElement, 100);
        }
      };
      
      // Initial attempt
      setTimeout(scrollToElement, 100);
    }
  }, [location]);

  return null;
};

// Component to handle page tracking inside Router context
const PageTracker: React.FC = () => {
  usePageTracking();
  return null;
};


// Component to conditionally render header based on route
const ConditionalHeader: React.FC = () => {
  const location = useLocation();
  const isFamilyHub = location.pathname.startsWith('/family-hub');
  
  // Don't render main header on Family Hub pages (they have their own header)
  if (isFamilyHub) {
    return null;
  }
  
  return <Header />;
};

// Component to conditionally render footer based on route
const ConditionalFooter: React.FC = () => {
  const location = useLocation();
  const isFamilyHub = location.pathname.startsWith('/family-hub');
  
  // Don't render main footer on Family Hub pages (they have their own footer)
  if (isFamilyHub) {
    return null;
  }
  
  return <Footer />;
};

// Component to apply the content wrapper only on non-Family-Hub routes.
// Family Hub uses AppShell with h-screen; the 60px padding-top from
// main-content-wrapper would shift the shell down and clip the bottom nav.
const ConditionalMain: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isFamilyHub = location.pathname.startsWith('/family-hub');
  return (
    <main id="main-content" className={isFamilyHub ? '' : 'main-content-wrapper'}>
      {children}
    </main>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SearchProvider>
          <FamilyProvider>
            <ProgressProvider>
              <FamilyProgressProvider>
                <Router>
                <SentryErrorBoundary fallback={<ErrorFallback />}>
                  <NavigationErrorBoundary>
                    <div className="App">
                      <PageTracker />
                      <HashHandler />
                      <ConditionalHeader />
                      <ConditionalMain>
                        <Suspense fallback={<PageLoader />}>
                        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/story"
              element={<Navigate to={`/stories/${ORIGIN_STORY_SLUG}`} replace />}
            />
            <Route
              path="/privacy-panda"
              element={<Navigate to={`/stories/${ORIGIN_STORY_SLUG}`} replace />}
            />
            <Route
              path="/story-classic"
              element={<Navigate to={`/stories/${ORIGIN_STORY_SLUG}`} replace />}
            />
            <Route
              path="/interactive-story"
              element={<Navigate to={`/stories/${ORIGIN_STORY_SLUG}`} replace />}
            />
            <Route path="/activity-book" element={<ActivityBookPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/age-groups" element={<AgeGroupsPage />} />
            <Route path="/ages-5-8" element={<Navigate to="/activity-book" replace />} />
            <Route path="/ages-9-12" element={<Navigate to="/privacy-explorers" replace />} />
            <Route path="/ages-13-17" element={<Navigate to="/teen-handbook" replace />} />
            <Route path="/mission-hub" element={<Navigate to="/family-hub" replace />} />
            <Route path="/implementation" element={<ImplementationPage />} />
            <Route path="/family-hub/*" element={<FamilyHubWrapper />} />
            
            {/* Age Group Pages */}
            <Route path="/privacy-explorers" element={<PrivacyExplorersPage />} />
            <Route path="/privacy-handbook" element={<PrivacyHandbookPage />} />
            <Route path="/digital-citizenship" element={<DigitalCitizenshipPage />} />
            <Route path="/teen-handbook" element={<TeenHandbookPage />} />
            <Route path="/privacy-tools" element={<PrivacyToolsPage />} />
            <Route path="/digital-rights" element={<DigitalRightsPage />} />

            {/* General Pages */}
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<FeaturesPage />} />
            <Route path="/app-features" element={<AppFeaturesPage />} />
            <Route path="/app-store-review" element={<AppStoreReviewPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/parent-resources" element={<ResourcesPage />} /> {/* Redirect to consolidated resources */}
            <Route path="/parent-toolkit" element={<ParentToolkitPage />} />
            <Route path="/quick-start" element={<QuickStartPage />} />
            <Route path="/educator-tools" element={<EducatorToolsPage />} />
            <Route path="/classroom-activities" element={<ClassroomActivitiesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
            <Route path="/newsletter/archive" element={<NewsletterArchivePage />} />
            <Route path="/newsletter/unsubscribe" element={<UnsubscribePage />} />
            <Route path="/newsletter/:id" element={<NewsletterIssuePage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/pilot" element={<PilotPage />} />
            <Route path="/join-pilot" element={<PilotPage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/implementation-guide" element={<ImplementationGuidePage />} />
            <Route path="/service-catalog" element={<ServiceCatalogPage />} />
            <Route path="/safety-alerts" element={<ChildSafetyAlertsPage />} />
            <Route path="/alerts" element={<ChildSafetyAlertsPage />} />
            <Route path="/child-safety-alerts" element={<Navigate to="/safety-alerts" replace />} />
            <Route path="/digital-footprint" element={<DigitalFootprintPage />} />
            <Route path="/footprint" element={<DigitalFootprintPage />} />
            <Route path="/privacy-assessment" element={<PrivacyAssessmentPage />} />
            <Route path="/quick-assessment" element={<QuickAssessmentPage />} />
            <Route path="/assessment" element={<PrivacyAssessmentPage />} />
            <Route path="/assessment-history" element={<AssessmentHistoryPage />} />
            <Route path="/assessment/history" element={<AssessmentHistoryPage />} />
            <Route path="/privacy-goals" element={<PrivacyGoalsPage />} />
            <Route path="/goals" element={<PrivacyGoalsPage />} />
            
            {/* Community Features */}
            <Route path="/community/stories" element={<SuccessStoriesPage />} />
            <Route path="/community/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/community/resources" element={<ResourceSharingPage />} />
            <Route path="/community/forum" element={<PrivacyTipsForumPage />} />
            <Route path="/community/privacy-tips" element={<PrivacyTipsForumPage />} />
            
            {/* COPPA Compliance Pages */}
            <Route path="/parental-consent" element={<ParentalConsentPage />} />
            <Route path="/parental-consent/pending" element={<ParentalConsentPendingPage />} />

            {/* Legal Pages */}
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />

            {/* Download Pages */}
            {/* Short paths mirror /downloads/* for bookmarks and old links; prefer /downloads/* in new links */}
            <Route path="/downloads/coloring-sheets" element={<ColoringSheetsPage />} />
            <Route path="/coloring-sheets" element={<ColoringSheetsPage />} />
            <Route path="/downloads/safety-posters" element={<SafetyPostersPage />} />
            <Route path="/safety-posters" element={<SafetyPostersPage />} />
            <Route path="/downloads/certificates" element={<CertificatesPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/downloads/family-agreement" element={<FamilyAgreementPage />} />
            <Route path="/family-agreement" element={<FamilyAgreementPage />} />
            
            {/* Alternative download routes using DownloadGuidePage */}
            <Route path="/downloads/coloring-sheets/guide" element={<DownloadGuidePage title="Privacy Panda Coloring Sheets" description="Educational coloring pages that teach privacy concepts while having fun" type="download" resourceType="coloring-sheets" />} />
            <Route path="/downloads/safety-posters/guide" element={<DownloadGuidePage title="Digital Safety Posters" description="Visual reminders of important digital safety rules for home and classroom" type="download" resourceType="safety-posters" />} />
            <Route path="/downloads/certificates/guide" element={<DownloadGuidePage title="Privacy Champion Certificates" description="Printable certificates to celebrate your child's privacy learning achievements" type="download" resourceType="certificates" />} />
            <Route path="/downloads/family-agreement/guide" element={<DownloadGuidePage title="Family Internet Agreement" description="A comprehensive agreement to establish safe internet use rules for your family" type="download" resourceType="family-agreement" />} />

            {/* Guide Pages */}
            <Route path="/guides/device-setup" element={<DeviceSetupGuidePage />} />
            <Route path="/guides/parental-controls" element={<Navigate to="/guides/device-setup" replace />} />
            <Route path="/guides/device-security" element={<Navigate to="/guides/device-setup" replace />} />
            <Route path="/guides/privacy-settings" element={<Navigate to="/privacy-tools" replace />} />
            <Route path="/guides/privacy-basics" element={<Navigate to="/privacy-handbook" replace />} />
            <Route path="/guides/social-media-privacy" element={<Navigate to="/teen-handbook" replace />} />
            <Route path="/guides/security" element={<Navigate to="/guides/emergency-safety" replace />} />
            <Route path="/guides/urgent-protection" element={<Navigate to="/guides/emergency-safety" replace />} />
            <Route path="/guides/practical-privacy" element={<Navigate to="/guides/family-privacy" replace />} />
            <Route path="/guides/app-selection" element={<AppSelectionGuidePage />} />
            <Route path="/guides/modeling-behavior" element={<ModelingBehaviorGuidePage />} />
            <Route path="/guides/privacy-concerns" element={<PrivacyConcernsGuidePage />} />
            <Route path="/guides/family-privacy" element={<FamilyPrivacyGuidePage />} />
            <Route path="/guides/emergency-safety" element={<EmergencySafetyGuidePage />} />
            <Route path="/guides/age-specific" element={<AgeSpecificGuidePage />} />
            <Route path="/guides/conversation-approaches" element={<ConversationApproachesPage />} />
            <Route path="/guides/safety-net" element={<SafetyNetPage />} />
            <Route path="/guides/age-specific-privacy" element={<AgeSpecificPrivacyPage />} />
            <Route path="/family-privacy-plan" element={<FamilyPrivacyPlanPage />} />
            <Route path="/guides/family-privacy-plan" element={<FamilyPrivacyPlanPage />} />

            {/* Privacy Panda Stories */}
            <Route path="/stories" element={<StoryListPage />} />
            <Route path="/stories/:slug" element={<StoryReaderPage />} />

            {/* Activity Pages */}
            <Route path="/activities/privacy-learning-kit" element={<PrivacyLearningKitPage />} />
            <Route
              path="/activities/story"
              element={<Navigate to="/stories/privacy-panda-and-the-digital-bamboo-forest" replace />}
            />
            <Route path="/activities/:activityId" element={<ActivitiesPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            
            {/* Additional Download Pages */}
            <Route path="/downloads/worksheets" element={<WorksheetsPage />} />
            
            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                        </Suspense>
                      </ConditionalMain>
                      <ConditionalFooter />
                      <BackToTop />
                    </div>
                  </NavigationErrorBoundary>
                </SentryErrorBoundary>
              </Router>
              </FamilyProgressProvider>
            </ProgressProvider>
          </FamilyProvider>
        </SearchProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;