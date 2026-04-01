/**
 * Family Privacy Assessment Report Generator
 * Creates comprehensive PDF reports from assessment results
 */

import jsPDF from 'jspdf';
import type { AssessmentResult, Recommendation } from './familyPrivacyAssessment';
import type { PersonaDetectionResult } from './familyPersonaDetection';
import { FamilyPersonaProfiles } from '../data/familyPersonaProfiles';

export interface ReportOptions {
  includePersona?: boolean;
  includeRecommendations?: boolean;
  includeCharts?: boolean;
  familyName?: string;
  assessmentDate?: string;
}

export class FamilyPrivacyReportGenerator {
  /**
   * Generate a comprehensive PDF report from assessment results
   */
  async generateReport(
    assessmentResult: AssessmentResult,
    personaResult?: PersonaDetectionResult,
    options: ReportOptions = {}
  ): Promise<Blob> {
    const {
      includePersona = true,
      includeRecommendations = true,
      includeCharts = true,
      familyName = 'Your Family',
      assessmentDate = new Date().toLocaleDateString()
    } = options;

    const doc = new jsPDF();
    let yPosition = 20;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number = 20) => {
      if (yPosition + requiredSpace > 280) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Helper function to add section title
    const addSectionTitle = (title: string, fontSize: number = 16) => {
      checkPageBreak(15);
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, yPosition);
      yPosition += 10;
      doc.setFont('helvetica', 'normal');
    };

    // Helper function to add text
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      checkPageBreak(10);
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 5 + 5;
    };

    // Cover Page
    doc.setFillColor(34, 139, 34); // Green color
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Family Privacy Assessment', 105, 100, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text('Report', 105, 120, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(familyName, 105, 150, { align: 'center' });
    doc.text(assessmentDate, 105, 165, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.addPage();

    // Executive Summary
    addSectionTitle('Executive Summary', 18);
    addText(`This report provides a comprehensive analysis of ${familyName}'s digital privacy practices based on the completed assessment.`, 11);
    yPosition += 5;
    
    addText('Overall Privacy Score', 12, true);
    addText(`${assessmentResult.overallScore}/100`, 16, true);
    yPosition += 5;
    
    addText('Risk Level', 12, true);
    const riskLevelText = assessmentResult.riskLevel.toUpperCase();
    addText(riskLevelText, 14, true);
    yPosition += 10;

    // Persona Analysis (if available)
    if (includePersona && personaResult && personaResult.profile) {
      checkPageBreak(30);
      addSectionTitle('Family Privacy Profile', 16);
      
      const persona = personaResult.profile;
      addText(`Your family's privacy profile: ${persona.name}`, 12, true);
      addText(persona.description, 10);
      yPosition += 5;
      
      addText('Primary Concerns:', 11, true);
      persona.primaryConcerns.forEach(concern => {
        addText(`• ${concern.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`, 10);
      });
      yPosition += 5;
      
      if (personaResult.secondary) {
        const secondaryPersona = FamilyPersonaProfiles[personaResult.secondary];
        if (secondaryPersona) {
          addText(`Secondary Profile: ${secondaryPersona.name}`, 10);
        }
      }
      yPosition += 10;
    }

    // Category Scores
    checkPageBreak(40);
    addSectionTitle('Category Analysis', 16);
    
    Object.entries(assessmentResult.categoryScores).forEach(([category, score]) => {
      const categoryName = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      addText(`${categoryName}: ${score}/100`, 11, true);
      
      let status = '';
      if (score >= 75) {status = 'Excellent';}
      else if (score >= 50) {status = 'Good';}
      else if (score >= 25) {status = 'Needs Improvement';}
      else {status = 'Critical';}
      
      addText(`Status: ${status}`, 10);
      yPosition += 5;
    });
    yPosition += 5;

    // Strengths
    if (assessmentResult.strengths.length > 0) {
      checkPageBreak(30);
      addSectionTitle('Strengths', 14);
      assessmentResult.strengths.forEach(strength => {
        addText(`✓ ${strength}`, 10);
      });
      yPosition += 5;
    }

    // Weaknesses
    if (assessmentResult.weaknesses.length > 0) {
      checkPageBreak(30);
      addSectionTitle('Areas for Improvement', 14);
      assessmentResult.weaknesses.forEach(weakness => {
        addText(`⚠ ${weakness}`, 10);
      });
      yPosition += 5;
    }

    // Recommendations
    if (includeRecommendations && assessmentResult.recommendations.length > 0) {
      checkPageBreak(50);
      addSectionTitle('Recommendations', 16);
      
      assessmentResult.recommendations.forEach((rec: Recommendation, index: number) => {
        checkPageBreak(40);
        
        addText(`${index + 1}. ${rec.title}`, 12, true);
        addText(`Priority: ${rec.priority.toUpperCase()}`, 10);
        addText(rec.description, 10);
        yPosition += 3;
        
        if (rec.actionItems && rec.actionItems.length > 0) {
          addText('Action Items:', 10, true);
          rec.actionItems.forEach(item => {
            addText(`  • ${item}`, 9);
          });
        }
        yPosition += 5;
      });
    }

    // Next Steps
    checkPageBreak(30);
    addSectionTitle('Next Steps', 14);
    addText('1. Review the recommendations above and prioritize based on your family\'s needs', 10);
    addText('2. Start with high-priority recommendations for immediate impact', 10);
    addText('3. Use PandaGarde resources and tools to implement improvements', 10);
    addText('4. Schedule regular privacy check-ins to maintain and improve your practices', 10);
    addText('5. Re-assess your privacy practices in 3-6 months to track progress', 10);
    yPosition += 10;

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `PandaGarde Family Privacy Assessment Report - Page ${i} of ${pageCount}`,
        105,
        290,
        { align: 'center' }
      );
      doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        105,
        295,
        { align: 'center' }
      );
    }

    // Generate blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
  }

  /**
   * Download the report
   */
  async downloadReport(
    assessmentResult: AssessmentResult,
    personaResult?: PersonaDetectionResult,
    options: ReportOptions = {}
  ): Promise<void> {
    const blob = await this.generateReport(assessmentResult, personaResult, options);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `family-privacy-assessment-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const familyPrivacyReportGenerator = new FamilyPrivacyReportGenerator();

