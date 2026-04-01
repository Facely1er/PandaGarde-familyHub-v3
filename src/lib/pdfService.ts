// PDF Generation Service for Downloadable Resources
// This service handles generating PDFs for various downloadable resources

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFResource {
  type: 'coloring-sheets' | 'safety-posters' | 'certificates' | 'family-agreement';
  title: string;
  content: string;
  metadata?: {
    author?: string;
    subject?: string;
    keywords?: string[];
  };
}

export class PDFService {
  private static instance: PDFService;
  
  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  /**
   * Generate a PDF from HTML content using jsPDF and html2canvas
   */
  async generatePDF(htmlContent: string, filename: string = 'document.pdf'): Promise<void> {
    try {
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = htmlContent;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.backgroundColor = 'white';
      document.body.appendChild(tempContainer);

      // Generate canvas from HTML
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print dialog
      await this.generatePDFFallback(htmlContent, filename);
    }
  }

  /**
   * Fallback PDF generation using print dialog
   */
  async generatePDFFallback(htmlContent: string, filename: string): Promise<void> {
    try {
      // Create a new window with the HTML content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Unable to open print window. Please check your popup blocker settings.');
      }

      // Use safer method to set content
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load
      printWindow.onload = () => {
        // Trigger print dialog
        printWindow.print();
        
        // Close window after printing (optional)
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      };
    } catch (error) {
      console.error('Error generating PDF fallback:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  /**
   * Download HTML content as a file
   */
  async downloadHTML(htmlContent: string, filename: string, mimeType: string = 'text/html'): Promise<void> {
    try {
      const blob = new Blob([htmlContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file. Please try again.');
    }
  }

  /**
   * Generate coloring sheets PDF
   */
  async generateColoringSheetsPDF(): Promise<void> {
    const htmlContent = await this.getColoringSheetsHTML();
    await this.generatePDF(htmlContent, 'privacy-panda-coloring-sheets.pdf');
  }

  /**
   * Generate safety posters PDF
   */
  async generateSafetyPostersPDF(): Promise<void> {
    const htmlContent = await this.getSafetyPostersHTML();
    await this.generatePDF(htmlContent, 'digital-safety-posters.pdf');
  }

  /**
   * Generate certificates PDF
   */
  async generateCertificatesPDF(): Promise<void> {
    const htmlContent = await this.getCertificatesHTML();
    await this.generatePDF(htmlContent, 'privacy-champion-certificates.pdf');
  }

  /**
   * Generate family agreement PDF
   */
  async generateFamilyAgreementPDF(): Promise<void> {
    const htmlContent = await this.getFamilyAgreementHTML();
    await this.generatePDF(htmlContent, 'family-internet-agreement.pdf');
  }

  /**
   * Generate a custom PDF with user data
   */
  async generateCustomPDF(htmlContent: string, filename: string, metadata?: PDFResource['metadata']): Promise<void> {
    // Add metadata to HTML if provided
    if (metadata) {
      const metaTags = `
        <meta name="author" content="${metadata.author || 'PandaGarde'}">
        <meta name="subject" content="${metadata.subject || 'Digital Privacy Education'}">
        <meta name="keywords" content="${metadata.keywords?.join(', ') || 'privacy, digital safety, education'}">
      `;
      htmlContent = htmlContent.replace('<head>', `<head>${metaTags}`);
    }
    
    await this.generatePDF(htmlContent, filename);
  }

  /**
   * Get HTML content for coloring sheets
   */
  private async getColoringSheetsHTML(): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('/downloads/coloring-sheets.html', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      console.warn('Error fetching coloring sheets HTML, using fallback:', error);
      return this.getDefaultColoringSheetsHTML();
    }
  }

  /**
   * Get HTML content for safety posters
   */
  private async getSafetyPostersHTML(): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('/downloads/safety-posters.html', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      console.warn('Error fetching safety posters HTML, using fallback:', error);
      return this.getDefaultSafetyPostersHTML();
    }
  }

  /**
   * Get HTML content for certificates
   */
  private async getCertificatesHTML(): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('/downloads/certificates.html', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      console.warn('Error fetching certificates HTML, using fallback:', error);
      return this.getDefaultCertificatesHTML();
    }
  }

  /**
   * Get HTML content for family agreement
   */
  private async getFamilyAgreementHTML(): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('/downloads/family-agreement.html', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      console.warn('Error fetching family agreement HTML, using fallback:', error);
      return this.getDefaultFamilyAgreementHTML();
    }
  }

  /**
   * Default coloring sheets HTML (fallback)
   */
  private getDefaultColoringSheetsHTML(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Panda Coloring Sheets</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: white; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 10px; }
          .coloring-page { margin: 20px 0; padding: 20px; border: 2px solid #e5e7eb; border-radius: 10px; page-break-inside: avoid; }
          .coloring-page h3 { color: #059669; margin-bottom: 10px; }
          .coloring-area { width: 100%; height: 300px; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #f9fafb; margin: 15px 0; }
          .privacy-tip { background: #ecfdf5; border-left: 4px solid #10b981; padding: 10px; margin: 10px 0; border-radius: 4px; }
          @media print { .coloring-page { page-break-inside: avoid; margin: 10px 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛡️ Privacy Panda Coloring Sheets</h1>
          <p>Learn about digital privacy while having fun coloring!</p>
        </div>
        <div class="coloring-page">
          <h3>1. Privacy Panda Guards the Password</h3>
          <p>Color Privacy Panda as he protects the treasure chest with a strong password lock!</p>
          <div class="coloring-area">
            <div style="font-size: 48px;">🐼🔒</div>
          </div>
          <div class="privacy-tip">
            <strong>Privacy Tip:</strong> Passwords are like special keys to your digital home. Keep them secret and make them strong!
          </div>
        </div>
        <div class="coloring-page">
          <h3>2. Safe Information Sharing</h3>
          <p>Help Privacy Panda decide what information is safe to share online!</p>
          <div class="coloring-area">
            <div style="font-size: 48px;">🤔📱</div>
          </div>
          <div class="privacy-tip">
            <strong>Privacy Tip:</strong> Never share your full name, address, phone number, or school name with strangers online.
          </div>
        </div>
        <div class="coloring-page">
          <h3>3. Digital Safety Shield</h3>
          <p>Color the shield that protects Privacy Panda from online dangers!</p>
          <div class="coloring-area">
            <div style="font-size: 48px;">🛡️✨</div>
          </div>
          <div class="privacy-tip">
            <strong>Privacy Tip:</strong> Always ask a trusted adult before clicking on links or downloading anything.
          </div>
        </div>
        <div class="coloring-page">
          <h3>4. Privacy Panda's Friends</h3>
          <p>Meet Privacy Panda's friends who help keep the digital world safe!</p>
          <div class="coloring-area">
            <div style="font-size: 48px;">🐼👥🔐</div>
          </div>
          <div class="privacy-tip">
            <strong>Privacy Tip:</strong> Good friends respect your privacy and never ask you to share personal information.
          </div>
        </div>
        <div class="coloring-page">
          <h3>5. The Digital Forest</h3>
          <p>Color the magical digital forest where Privacy Panda lives!</p>
          <div class="coloring-area">
            <div style="font-size: 48px;">🌲🐼💻</div>
          </div>
          <div class="privacy-tip">
            <strong>Privacy Tip:</strong> The internet is like a big forest - it's fun to explore, but always stay on the safe paths!
          </div>
        </div>
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 10px;">
          <h3>🎉 Congratulations!</h3>
          <p>You've completed the Privacy Panda coloring adventure! Remember to always protect your personal information online.</p>
          <p><strong>Print this page to start coloring!</strong></p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Default safety posters HTML (fallback)
   */
  private getDefaultSafetyPostersHTML(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Digital Safety Posters</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: white; }
          .poster { margin: 20px 0; padding: 30px; border: 3px solid #10b981; border-radius: 15px; text-align: center; page-break-inside: avoid; background: linear-gradient(135deg, #f0fdf4, #ecfdf5); scroll-margin-top: 1rem; }
          .poster h2 { color: #059669; font-size: 2.5em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
          .poster .icon { font-size: 4em; margin: 20px 0; }
          .poster .rule { font-size: 1.5em; color: #374151; margin: 15px 0; font-weight: bold; }
          .poster .description { font-size: 1.2em; color: #6b7280; margin: 20px 0; line-height: 1.6; }
          .poster .highlight { background: #fef3c7; padding: 10px; border-radius: 8px; margin: 15px 0; border-left: 5px solid #f59e0b; }
          @media print { .poster { page-break-inside: avoid; margin: 10px 0; } }
        </style>
      </head>
      <body>
        <div class="poster" id="password-safety">
          <h2>🛡️ Password Safety</h2>
          <div class="icon">🔐</div>
          <div class="rule">Keep Your Passwords Secret!</div>
          <div class="description">Passwords are like special keys to your digital home. Never share them with friends, and make them strong and unique!</div>
          <div class="highlight"><strong>Remember:</strong> A strong password has letters, numbers, and symbols!</div>
        </div>
        <div class="poster" id="personal-information">
          <h2>🤐 Personal Information</h2>
          <div class="icon">👤</div>
          <div class="rule">Keep Personal Info Private!</div>
          <div class="description">Never share your full name, address, phone number, or school name with strangers online. This information belongs only to you!</div>
          <div class="highlight"><strong>Safe to share:</strong> Your favorite color, favorite food, or favorite game</div>
        </div>
        <div class="poster" id="stranger-danger">
          <h2>🚫 Stranger Danger</h2>
          <div class="icon">👥</div>
          <div class="rule">Never Talk to Strangers Online!</div>
          <div class="description">If someone you don't know tries to talk to you online, tell a trusted adult immediately. Never meet up with someone you met online!</div>
          <div class="highlight"><strong>Remember:</strong> Real friends are people you know in real life!</div>
        </div>
        <div class="poster" id="app-safety">
          <h2>📱 App Safety</h2>
          <div class="icon">📲</div>
          <div class="rule">Ask Before You Download!</div>
          <div class="description">Always ask a parent or teacher before downloading any apps or games. Some apps might not be safe for kids!</div>
          <div class="highlight"><strong>Safe apps:</strong> Ask your parents to help you find age-appropriate apps!</div>
        </div>
        <div class="poster" id="ask-for-help">
          <h2>🆘 When to Ask for Help</h2>
          <div class="icon">🙋‍♀️</div>
          <div class="rule">Tell a Trusted Adult!</div>
          <div class="description">If something online makes you feel uncomfortable, scared, or confused, tell a parent, teacher, or trusted adult right away!</div>
          <div class="highlight"><strong>You're not in trouble:</strong> It's always okay to ask for help!</div>
        </div>
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 10px;">
          <h3>📋 Display These Posters</h3>
          <p>Print these posters and hang them near your computer or tablet to remember these important safety rules!</p>
          <p><strong>Perfect for classrooms and home learning spaces!</strong></p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Default certificates HTML (fallback)
   */
  private getDefaultCertificatesHTML(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Champion Certificates</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 20px; background: white; }
          .certificate { margin: 20px 0; padding: 40px; border: 5px solid #10b981; border-radius: 20px; text-align: center; page-break-inside: avoid; background: linear-gradient(135deg, #f0fdf4, #ecfdf5); position: relative; min-height: 400px; }
          .certificate::before { content: ''; position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 2px solid #059669; border-radius: 15px; pointer-events: none; }
          .certificate h1 { color: #059669; font-size: 2.5em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); }
          .certificate .icon { font-size: 4em; margin: 20px 0; }
          .certificate .name-line { border-bottom: 2px solid #10b981; padding: 10px; margin: 20px 0; font-size: 1.5em; color: #374151; min-height: 50px; }
          .certificate .achievement { font-size: 1.3em; color: #6b7280; margin: 20px 0; line-height: 1.6; }
          .certificate .date { font-size: 1.1em; color: #059669; margin: 20px 0; font-weight: bold; }
          .certificate .signature-line { display: flex; justify-content: space-between; margin-top: 40px; font-size: 1.1em; color: #6b7280; }
          .signature-box { width: 200px; border-bottom: 2px solid #10b981; padding: 10px; }
          @media print { .certificate { page-break-inside: avoid; margin: 10px 0; } }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>🏆 Privacy Champion Certificate</h1>
          <div class="icon">🛡️</div>
          <p style="font-size: 1.2em; color: #6b7280; margin: 20px 0;">This certifies that</p>
          <div class="name-line"><span style="color: #059669; font-weight: bold;">[Student Name]</span></div>
          <div class="achievement">has successfully completed the Privacy Panda Digital Safety Program and demonstrated excellent understanding of online privacy and safety concepts.</div>
          <div class="achievement"><strong>Skills Mastered:</strong><br>✓ Password Safety<br>✓ Personal Information Protection<br>✓ Safe Online Communication<br>✓ Digital Citizenship</div>
          <div class="date">Date: _______________</div>
          <div class="signature-line">
            <div class="signature-box"><div>Parent/Guardian Signature</div></div>
            <div class="signature-box"><div>Teacher/Educator Signature</div></div>
          </div>
        </div>
        <div class="certificate">
          <h1>🌟 Digital Safety Star Certificate</h1>
          <div class="icon">⭐</div>
          <p style="font-size: 1.2em; color: #6b7280; margin: 20px 0;">This certifies that</p>
          <div class="name-line"><span style="color: #059669; font-weight: bold;">[Student Name]</span></div>
          <div class="achievement">has shown exceptional commitment to learning about digital privacy and has become a role model for safe online behavior.</div>
          <div class="achievement"><strong>Special Recognition For:</strong><br>✓ Helping friends stay safe online<br>✓ Asking questions about privacy<br>✓ Following digital safety rules<br>✓ Being a positive digital citizen</div>
          <div class="date">Date: _______________</div>
          <div class="signature-line">
            <div class="signature-box"><div>Parent/Guardian Signature</div></div>
            <div class="signature-box"><div>Teacher/Educator Signature</div></div>
          </div>
        </div>
        <div class="certificate">
          <h1>🎓 Privacy Explorer Certificate</h1>
          <div class="icon">🔍</div>
          <p style="font-size: 1.2em; color: #6b7280; margin: 20px 0;">This certifies that</p>
          <div class="name-line"><span style="color: #059669; font-weight: bold;">[Student Name]</span></div>
          <div class="achievement">has completed the Privacy Panda Activity Book and learned important lessons about protecting personal information online.</div>
          <div class="achievement"><strong>Activities Completed:</strong><br>✓ Privacy Password Coloring<br>✓ Information Sorting Game<br>✓ Safe Online Journey Maze<br>✓ Privacy Word Search<br>✓ Privacy Shield Connect-the-Dots<br>✓ Privacy Symbol Matching</div>
          <div class="date">Date: _______________</div>
          <div class="signature-line">
            <div class="signature-box"><div>Parent/Guardian Signature</div></div>
            <div class="signature-box"><div>Teacher/Educator Signature</div></div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 10px;">
          <h3>🎉 Print Your Certificates!</h3>
          <p>Print these certificates to celebrate your child's privacy learning achievements!</p>
          <p><strong>Perfect for framing or displaying on the refrigerator!</strong></p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Default family agreement HTML (fallback)
   */
  private getDefaultFamilyAgreementHTML(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Family Internet Agreement</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: white; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 10px; }
          .agreement-section { margin: 20px 0; padding: 20px; border: 2px solid #e5e7eb; border-radius: 10px; page-break-inside: avoid; }
          .agreement-section h3 { color: #059669; margin-bottom: 15px; font-size: 1.3em; }
          .rule { margin: 15px 0; padding: 10px; background: #f9fafb; border-left: 4px solid #10b981; border-radius: 4px; }
          .rule strong { color: #059669; }
          .signature-section { margin: 30px 0; padding: 20px; background: #f3f4f6; border-radius: 10px; }
          .signature-line { display: flex; justify-content: space-between; margin: 20px 0; align-items: center; }
          .signature-box { width: 200px; border-bottom: 2px solid #10b981; padding: 10px; text-align: center; }
          @media print { .agreement-section { page-break-inside: avoid; margin: 10px 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛡️ Family Internet Agreement</h1>
          <p>A guide to safe and responsible internet use for our family</p>
          <p><strong>Date: _______________</strong></p>
        </div>
        <div class="agreement-section">
          <h3>📱 Device Rules</h3>
          <div class="rule"><strong>Screen Time:</strong> I will use devices for no more than _____ hours per day on weekdays and _____ hours on weekends.</div>
          <div class="rule"><strong>Device Location:</strong> I will use devices in common areas of the house where adults can see what I'm doing.</div>
          <div class="rule"><strong>Bedtime:</strong> I will turn off all devices at _____ PM and put them in the designated charging area.</div>
          <div class="rule"><strong>Charging Station:</strong> All devices will be charged in the family charging station, not in bedrooms.</div>
        </div>
        <div class="agreement-section">
          <h3>🔐 Privacy & Safety Rules</h3>
          <div class="rule"><strong>Personal Information:</strong> I will never share my full name, address, phone number, school name, or any other personal information online.</div>
          <div class="rule"><strong>Passwords:</strong> I will create strong passwords and never share them with friends. I will let my parents know my passwords.</div>
          <div class="rule"><strong>Photos & Videos:</strong> I will not post photos or videos of myself or others without permission from my parents.</div>
          <div class="rule"><strong>Strangers:</strong> I will never talk to strangers online or meet up with anyone I met on the internet.</div>
          <div class="rule"><strong>Reporting:</strong> If someone online makes me feel uncomfortable or asks for personal information, I will tell my parents immediately.</div>
        </div>
        <div class="agreement-section">
          <h3>📚 Educational Use</h3>
          <div class="rule"><strong>Learning First:</strong> I will use the internet primarily for educational purposes and learning activities.</div>
          <div class="rule"><strong>App Downloads:</strong> I will ask permission before downloading any new apps or games.</div>
          <div class="rule"><strong>Website Access:</strong> I will only visit websites that are appropriate for my age and that my parents have approved.</div>
          <div class="rule"><strong>Online Learning:</strong> I will participate in online learning activities and complete assignments on time.</div>
        </div>
        <div class="agreement-section">
          <h3>🤝 Respectful Behavior</h3>
          <div class="rule"><strong>Kindness:</strong> I will be kind and respectful to others online, just like I would be in person.</div>
          <div class="rule"><strong>No Bullying:</strong> I will not bully, tease, or be mean to others online.</div>
          <div class="rule"><strong>Standing Up:</strong> If I see someone being bullied online, I will tell a trusted adult.</div>
          <div class="rule"><strong>Think Before Posting:</strong> I will think carefully before posting anything online and ask myself if it's kind and appropriate.</div>
        </div>
        <div class="agreement-section">
          <h3>⚖️ Consequences</h3>
          <div class="rule"><strong>Breaking Rules:</strong> If I break any of these rules, I understand that my internet privileges may be limited or taken away.</div>
          <div class="rule"><strong>Learning Opportunity:</strong> If I make a mistake, I will use it as a learning opportunity to do better next time.</div>
          <div class="rule"><strong>Open Communication:</strong> I will always be honest with my parents about my online activities.</div>
        </div>
        <div class="signature-section">
          <h3>✍️ Family Signatures</h3>
          <p>By signing below, we agree to follow these internet safety rules as a family.</p>
          <div class="signature-line">
            <div><strong>Child's Name:</strong> _________________________</div>
            <div class="signature-box"><div>Child's Signature</div></div>
          </div>
          <div class="signature-line">
            <div><strong>Parent/Guardian Name:</strong> _________________________</div>
            <div class="signature-box"><div>Parent/Guardian Signature</div></div>
          </div>
          <div class="signature-line">
            <div><strong>Parent/Guardian Name:</strong> _________________________</div>
            <div class="signature-box"><div>Parent/Guardian Signature</div></div>
          </div>
          <div style="margin-top: 30px; text-align: center;">
            <p><strong>Date Signed:</strong> _______________</p>
            <p style="color: #6b7280; font-size: 0.9em;">This agreement should be reviewed and updated regularly as your child grows and technology changes.</p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 10px;">
          <h3>📋 How to Use This Agreement</h3>
          <p>1. Print this agreement and fill in the blanks together as a family</p>
          <p>2. Discuss each rule and why it's important</p>
          <p>3. Sign the agreement and post it near your computer or tablet</p>
          <p>4. Review and update the rules regularly</p>
          <p><strong>Remember: This is a living document that grows with your family!</strong></p>
        </div>
      </body>
      </html>
    `;
  }
}

// Export singleton instance
export const pdfService = PDFService.getInstance();