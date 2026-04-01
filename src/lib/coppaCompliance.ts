/**
 * COPPA Compliance Manager
 * Handles parental consent, data collection restrictions, and COPPA compliance
 * 
 * Note: This is a client-side implementation. For full COPPA compliance,
 * consider implementing server-side verification in production.
 */

import { encryptData, decryptData, generateUserPassword } from './encryption';

export interface ParentalConsentRecord {
  childAge: number;
  parentEmail: string;
  consentToken: string;
  consentDate: string;
  ipAddress?: string;
  consentMethod: 'email' | 'parental-portal';
  verified: boolean;
  revoked?: boolean;
  revokedDate?: string;
}

export interface ConsentVerificationResult {
  valid: boolean;
  record?: ParentalConsentRecord;
  error?: string;
}

export class COPPAComplianceManager {
  private static readonly CONSENT_STORAGE_KEY = 'pandagarde_coppa_consents';
  private static readonly ZERO_DATA_FLAG = 'pandagarde_zero_data_mode';
  
  /**
   * Generate a unique consent token
   */
  private generateConsentToken(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `coppa_${timestamp}_${random}`;
  }

  /**
   * Get user's IP address (for audit trail)
   * Note: This is a client-side approximation
   */
  private async getUserIP(): Promise<string> {
    // Try multiple IP services with fallbacks
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://api64.ipify.org?format=json',
      'https://ipapi.co/json/'
    ];

    for (const serviceUrl of ipServices) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch(serviceUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          // Handle different response formats
          const ip = data.ip || data.query || data.origin;
          if (ip && typeof ip === 'string') {
            return ip;
          }
        }
      } catch (error) {
        // Silently continue to next service
        continue;
      }
    }
    
    // If all services fail, return unknown
    return 'unknown';
  }

  /**
   * Store consent record (encrypted)
   */
  private async storeConsentRecord(token: string, record: ParentalConsentRecord): Promise<void> {
    try {
      const allConsents = await this.getAllConsentRecords();
      allConsents[token] = record;
      
      // Encrypt before storing
      const userId = this.getCurrentUserId();
      const password = generateUserPassword(userId);
      const encrypted = await encryptData(allConsents, password);
      
      localStorage.setItem(COPPAComplianceManager.CONSENT_STORAGE_KEY, encrypted);
    } catch (error) {
      console.error('Error storing consent record:', error);
      throw new Error('Failed to store consent record');
    }
  }

  /**
   * Get all consent records (decrypted)
   */
  private async getAllConsentRecords(): Promise<Record<string, ParentalConsentRecord>> {
    try {
      const stored = localStorage.getItem(COPPAComplianceManager.CONSENT_STORAGE_KEY);
      if (!stored) {return {};}
      
      const userId = this.getCurrentUserId();
      const password = generateUserPassword(userId);
      return await decryptData<Record<string, ParentalConsentRecord>>(stored, password);
    } catch (error) {
      console.error('Error getting consent records:', error);
      return {};
    }
  }

  /**
   * Get a specific consent record
   */
  async getConsentRecord(token: string): Promise<ParentalConsentRecord | null> {
    const allConsents = await this.getAllConsentRecords();
    return allConsents[token] || null;
  }

  /**
   * Request parental consent via email
   */
  async requestParentalConsent(
    childAge: number,
    parentEmail: string
  ): Promise<{ success: boolean; consentToken: string; error?: string }> {
    try {
      // Validate email
      if (!this.isValidEmail(parentEmail)) {
        return { success: false, consentToken: '', error: 'Invalid email address' };
      }

      // Generate consent token
      const consentToken = this.generateConsentToken();
      
      // Get IP address for audit trail
      const ipAddress = await this.getUserIP();
      
      // Create consent record
      const consentRecord: ParentalConsentRecord = {
        childAge,
        parentEmail,
        consentToken,
        consentDate: new Date().toISOString(),
        ipAddress,
        consentMethod: 'email',
        verified: false
      };
      
      // Store consent record
      await this.storeConsentRecord(consentToken, consentRecord);
      
      // Send consent email
      const emailSent = await this.sendConsentEmail(parentEmail, consentToken);
      
      if (!emailSent) {
        return { 
          success: false, 
          consentToken, 
          error: 'Failed to send consent email. Please try again.' 
        };
      }
      
      return { success: true, consentToken };
    } catch (error) {
      console.error('Error requesting parental consent:', error);
      return { 
        success: false, 
        consentToken: '', 
        error: 'An error occurred while processing your request' 
      };
    }
  }

  /**
   * Send consent email using EmailJS or similar service
   * Note: Configure EmailJS service ID and template in environment variables
   */
  private async sendConsentEmail(parentEmail: string, consentToken: string): Promise<boolean> {
    try {
      // Check if EmailJS is configured
      const emailjsServiceId = import.meta.env['VITE_EMAILJS_SERVICE_ID'];
      const emailjsTemplateId = import.meta.env['VITE_EMAILJS_TEMPLATE_ID'];
      const emailjsPublicKey = import.meta.env['VITE_EMAILJS_PUBLIC_KEY'];

      if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
        // Fallback: Use mailto link or log for manual processing
        console.warn('EmailJS not configured. Consent token:', consentToken);
        console.warn('Parent email:', parentEmail);
        console.warn('Consent URL:', `${window.location.origin}/parental-consent?token=${consentToken}`);
        
        // In development, we'll simulate success
        // In production, you should configure EmailJS or another email service
        return true;
      }

      // Try to send email using EmailJS if available
      // Note: EmailJS is optional - install with: npm install @emailjs/browser
      const consentUrl = `${window.location.origin}/parental-consent?token=${consentToken}`;
      
      try {
        // Dynamic import of EmailJS (if installed)
        // @ts-expect-error - EmailJS is optional dependency
        const emailjsModule = await import('@emailjs/browser').catch(() => null);
        
        if (emailjsModule && emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
          const templateParams = {
            to_email: parentEmail,
            consent_token: consentToken,
            consent_url: consentUrl,
            site_name: 'PandaGarde',
            support_email: import.meta.env['VITE_SUPPORT_EMAIL'] || 'support@pandagarde.com'
          };

          // Add timeout for email sending
          const emailPromise = emailjsModule.send(
            emailjsServiceId,
            emailjsTemplateId,
            templateParams,
            emailjsPublicKey
          );
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Email send timeout')), 10000)
          );
          
          await Promise.race([emailPromise, timeoutPromise]);
          return true;
        }
      } catch (emailError) {
        // Silently fail - fallback to manual processing
        console.warn('EmailJS error (falling back to manual processing):', emailError);
        // Fall through to manual processing
      }
      
      // Fallback: Log consent details for manual email sending
      // In production, you should configure EmailJS or another email service
      console.warn('EmailJS not configured. Manual consent email required:');
      console.warn('Parent Email:', parentEmail);
      console.warn('Consent Token:', consentToken);
      console.warn('Consent URL:', consentUrl);
      
      // In development, return true to allow testing
      // In production, you may want to return false and require email service
      return import.meta.env.MODE === 'development';

      return true;
    } catch (error) {
      console.error('Error sending consent email:', error);
      // Return true in development to allow testing
      // In production, you may want to return false
      return import.meta.env.MODE === 'development';
    }
  }

  /**
   * Verify consent token from email link
   */
  async verifyConsentToken(token: string): Promise<ConsentVerificationResult> {
    try {
      const record = await this.getConsentRecord(token);
      
      if (!record) {
        return { valid: false, error: 'Invalid consent token' };
      }

      if (record.revoked) {
        return { valid: false, error: 'This consent has been revoked' };
      }

      // Mark as verified
      record.verified = true;
      await this.storeConsentRecord(token, record);

      return { valid: true, record };
    } catch (error) {
      console.error('Error verifying consent token:', error);
      return { valid: false, error: 'Failed to verify consent token' };
    }
  }

  /**
   * Revoke parental consent
   */
  async revokeConsent(token: string): Promise<boolean> {
    try {
      const record = await this.getConsentRecord(token);
      if (!record) {return false;}

      record.revoked = true;
      record.revokedDate = new Date().toISOString();
      await this.storeConsentRecord(token, record);

      // Clear all data for this child
      await this.clearChildData(token);

      return true;
    } catch (error) {
      console.error('Error revoking consent:', error);
      return false;
    }
  }

  /**
   * Check if user has valid parental consent
   */
  async hasValidConsent(consentToken?: string): Promise<boolean> {
    if (!consentToken) {
      // Check if there's a stored consent token
      consentToken = sessionStorage.getItem('coppa_consent_token') || '';
    }

    if (!consentToken) {return false;}

    const record = await this.getConsentRecord(consentToken);
    return record?.verified === true && record?.revoked !== true;
  }

  /**
   * Enable zero-data mode (for under-13s without consent)
   */
  enableZeroDataMode(): void {
    sessionStorage.setItem(COPPAComplianceManager.ZERO_DATA_FLAG, 'true');
    
    // Disable analytics
    if (typeof window !== 'undefined') {
      (window as any).ga?.('set', 'anonymizeIp', true);
      (window as any).ga?.('set', 'allowAdFeatures', false);
    }
  }

  /**
   * Disable zero-data mode
   */
  disableZeroDataMode(): void {
    sessionStorage.removeItem(COPPAComplianceManager.ZERO_DATA_FLAG);
  }

  /**
   * Check if zero-data mode is enabled
   */
  isZeroDataMode(): boolean {
    return sessionStorage.getItem(COPPAComplianceManager.ZERO_DATA_FLAG) === 'true';
  }

  /**
   * Clear all data for a child (when consent is revoked)
   */
  private async clearChildData(consentToken: string): Promise<void> {
    try {
      // Clear localStorage data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('pandagarde_')) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear consent record
      const allConsents = await this.getAllConsentRecords();
      delete allConsents[consentToken];
      
      const userId = this.getCurrentUserId();
      const password = generateUserPassword(userId);
      const encrypted = await encryptData(allConsents, password);
      localStorage.setItem(COPPAComplianceManager.CONSENT_STORAGE_KEY, encrypted);
    } catch (error) {
      console.error('Error clearing child data:', error);
    }
  }

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string {
    let userId = localStorage.getItem('pandagarde_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('pandagarde_user_id', userId);
    }
    return userId;
  }

  /**
   * Validate email address
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get all consent records for a parent email
   */
  async getConsentsByEmail(parentEmail: string): Promise<ParentalConsentRecord[]> {
    const allConsents = await this.getAllConsentRecords();
    return Object.values(allConsents).filter(
      record => record.parentEmail.toLowerCase() === parentEmail.toLowerCase()
    );
  }
}

// Export singleton instance
export const coppaComplianceManager = new COPPAComplianceManager();

