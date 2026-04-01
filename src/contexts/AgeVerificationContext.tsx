import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { coppaComplianceManager } from '../lib/coppaCompliance';

interface AgeVerificationContextType {
  isVerified: boolean;
  isUnder13: boolean | null;
  hasParentalConsent: boolean;
  consentToken: string | null;
  verifyAge: (age: number, parentEmail?: string) => Promise<{ success: boolean; error?: string; consentToken?: string }>;
  resetVerification: () => void;
  showAgeModal: boolean;
  setShowAgeModal: (show: boolean) => void;
  getAgeGroup: () => 'ages-5-8' | 'ages-9-12' | 'ages-13-17' | null;
  getAgeAppropriateContent: () => string[];
  requiresParentalConsent: () => boolean;
  canAccessContent: (contentPath: string) => boolean;
  isZeroDataMode: () => boolean;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

interface AgeVerificationProviderProps {
  children: ReactNode;
}

export const AgeVerificationProvider: React.FC<AgeVerificationProviderProps> = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isUnder13, setIsUnder13] = useState<boolean | null>(null);
  const [hasParentalConsent, setHasParentalConsent] = useState(false);
  const [consentToken, setConsentToken] = useState<string | null>(null);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [userAge, setUserAge] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for existing verification on mount
  useEffect(() => {
    const checkVerification = async () => {
      const savedVerification = sessionStorage.getItem('pandagarde-age-verification');
      const storedConsentToken = sessionStorage.getItem('coppa_consent_token');
      
      if (savedVerification) {
        try {
          const { verified, under13, age } = JSON.parse(savedVerification);
          setIsVerified(verified);
          setIsUnder13(under13);
          setUserAge(age);
          
          // Check if consent is valid
          if (under13 && storedConsentToken) {
            const hasValidConsent = await coppaComplianceManager.hasValidConsent(storedConsentToken);
            setHasParentalConsent(hasValidConsent);
            setConsentToken(storedConsentToken);
            
            if (!hasValidConsent) {
              // Enable zero-data mode if consent not verified
              coppaComplianceManager.enableZeroDataMode();
            } else {
              coppaComplianceManager.disableZeroDataMode();
            }
          } else if (under13 && !storedConsentToken) {
            // Under 13 without consent - enable zero-data mode
            coppaComplianceManager.enableZeroDataMode();
            setHasParentalConsent(false);
          } else {
            // Over 13 - no consent needed
            setHasParentalConsent(true);
            coppaComplianceManager.disableZeroDataMode();
          }
          
          // Auto-route to appropriate content if not on a specific page
          if (verified && location.pathname === '/') {
            autoRouteToAppropriateContent(age);
          }
        } catch (error) {
          console.error('Error parsing age verification data:', error);
          // Clear invalid data
          sessionStorage.removeItem('pandagarde-age-verification');
          setShowAgeModal(true);
        }
      } else {
        // Show age modal if no verification exists
        setShowAgeModal(true);
      }
    };
    
    checkVerification();
  }, [location.pathname]);

  const verifyAge = async (age: number, parentEmail?: string): Promise<{ success: boolean; error?: string; consentToken?: string }> => {
    const under13 = age < 13;
    
    if (under13) {
      // Under 13 requires parental consent
      if (!parentEmail) {
        return { success: false, error: 'Parent email is required for users under 13' };
      }
      
      // Request parental consent
      const result = await coppaComplianceManager.requestParentalConsent(age, parentEmail);
      
      if (!result.success) {
        return { success: false, error: result.error || 'Failed to request parental consent' };
      }
      
      // Store consent token
      sessionStorage.setItem('coppa_consent_token', result.consentToken);
      setConsentToken(result.consentToken);
      
      // Enable zero-data mode until consent is verified
      coppaComplianceManager.enableZeroDataMode();
      setHasParentalConsent(false);
      
      // Save verification (without consent yet)
      const verificationData = {
        verified: true,
        under13: true,
        age,
        timestamp: Date.now()
      };
      sessionStorage.setItem('pandagarde-age-verification', JSON.stringify(verificationData));
      
      setIsVerified(true);
      setIsUnder13(true);
      setUserAge(age);
      setShowAgeModal(false);
      
      // Navigate to pending consent page
      navigate('/parental-consent/pending');
      
      return { success: true, consentToken: result.consentToken };
    } else {
      // Over 13 - no consent needed
      setIsVerified(true);
      setIsUnder13(false);
      setHasParentalConsent(true);
      setUserAge(age);
      setShowAgeModal(false);
      
      // Disable zero-data mode
      coppaComplianceManager.disableZeroDataMode();
      
      // Save to sessionStorage (not localStorage for privacy)
      const verificationData = {
        verified: true,
        under13: false,
        age,
        timestamp: Date.now()
      };
      sessionStorage.setItem('pandagarde-age-verification', JSON.stringify(verificationData));
      
      // Auto-route to appropriate content
      autoRouteToAppropriateContent(age);
      
      return { success: true };
    }
  };

  const resetVerification = () => {
    setIsVerified(false);
    setIsUnder13(null);
    setHasParentalConsent(false);
    setConsentToken(null);
    setUserAge(null);
    setShowAgeModal(true);
    sessionStorage.removeItem('pandagarde-age-verification');
    sessionStorage.removeItem('coppa_consent_token');
    coppaComplianceManager.disableZeroDataMode();
  };
  
  const isZeroDataMode = (): boolean => {
    return coppaComplianceManager.isZeroDataMode();
  };

  // Auto-route to age-appropriate content
  const autoRouteToAppropriateContent = (age: number) => {
    if (age >= 5 && age <= 8) {
      navigate('/ages-5-8');
    } else if (age >= 9 && age <= 12) {
      navigate('/ages-9-12');
    } else if (age >= 13 && age <= 17) {
      navigate('/ages-13-17');
    } else {
      navigate('/get-started');
    }
  };

  // Get age group category
  const getAgeGroup = (): 'ages-5-8' | 'ages-9-12' | 'ages-13-17' | null => {
    if (!userAge) {return null;}
    if (userAge >= 5 && userAge <= 8) {return 'ages-5-8';}
    if (userAge >= 9 && userAge <= 12) {return 'ages-9-12';}
    if (userAge >= 13 && userAge <= 17) {return 'ages-13-17';}
    return null;
  };

  // Get age-appropriate content paths
  const getAgeAppropriateContent = (): string[] => {
    const ageGroup = getAgeGroup();
    if (!ageGroup) {return [];}

    const contentMap = {
      'ages-5-8': [
        '/ages-5-8',
        '/interactive-story',
        '/activity-book',
        '/coloring-sheets',
        '/safety-posters'
      ],
      'ages-9-12': [
        '/ages-9-12',
        '/interactive-story',
        '/activity-book',
        '/privacy-tools',
        '/mission-hub'
      ],
      'ages-13-17': [
        '/ages-13-17',
        '/privacy-tools',
        '/mission-hub',
        '/teen-handbook',
        '/digital-citizenship'
      ]
    };

    return contentMap[ageGroup] || [];
  };

  // Check if parental consent is required
  const requiresParentalConsent = (): boolean => {
    return isUnder13 === true && !hasParentalConsent;
  };

  // Check if user can access specific content
  const canAccessContent = (contentPath: string): boolean => {
    if (!isVerified) {return false;}
    
    const ageGroup = getAgeGroup();
    if (!ageGroup) {return false;}

    // Check if content is age-appropriate
    const appropriateContent = getAgeAppropriateContent();
    const isAppropriate = appropriateContent.some(path => contentPath.startsWith(path));
    
    // For restricted content, require parental consent for under-13s
    if (!isAppropriate && isUnder13) {
      return hasParentalConsent;
    }
    
    return isAppropriate || hasParentalConsent;
  };

  return (
    <AgeVerificationContext.Provider
      value={{
        isVerified,
        isUnder13,
        hasParentalConsent,
        consentToken,
        verifyAge,
        resetVerification,
        showAgeModal,
        setShowAgeModal,
        getAgeGroup,
        getAgeAppropriateContent,
        requiresParentalConsent,
        canAccessContent,
        isZeroDataMode
      }}
    >
      {children}
    </AgeVerificationContext.Provider>
  );
};

export const useAgeVerification = (): AgeVerificationContextType => {
  const context = useContext(AgeVerificationContext);
  if (context === undefined) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider');
  }
  return context;
};