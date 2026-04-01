import jsPDF from 'jspdf';
import type { FootprintAnalysis } from './footprintAnalyzer';
import type { DfaScoreResult } from './dfaScoreEngine';

export const downloadDfaExecutiveSummary = (analysis: FootprintAnalysis, score: DfaScoreResult): void => {
  const doc = new jsPDF();
  let y = 20;
  const line = (text: string, size = 11, bold = false): void => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, 20, y);
    y += lines.length * 6 + 4;
  };

  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 210, 36, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PandaGarde DFA Executive Summary', 20, 22);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated ${new Date().toLocaleString()}`, 20, 30);

  doc.setTextColor(15, 23, 42);
  y = 48;
  line(`${score.tier === 'advanced' ? 'Advanced' : 'Basic'} DFA score: ${score.score}/100`, 16, true);
  line(`Risk level: ${score.level}`, 12, true);
  line(score.executiveSummary);

  line('Snapshot', 13, true);
  line(`Services analyzed: ${analysis.totalServices}`);
  line(`Family profiles in scope: ${analysis.totalMembers || 1}`);
  line(`Average service exposure: ${analysis.averageExposureIndex}/100`);
  line(`Privacy posture score: ${score.privacyScore}/100`);

  line('Top score drivers', 13, true);
  score.breakdown.forEach((item) => line(`• ${item.label}: ${item.value}/100 — ${item.description}`));

  line('Priority categories', 13, true);
  if (score.flags.length === 0) {
    line('• No major DFA flags were triggered in this run.');
  } else {
    score.flags.forEach((flag) => line(`• ${flag.label}`));
  }

  line('Immediate next steps', 13, true);
  const topRecommendations = analysis.recommendations.slice(0, 4);
  if (topRecommendations.length === 0) {
    line('• Review privacy settings on higher-exposure services and continue into the assessment phase.');
  } else {
    topRecommendations.forEach((rec) => line(`• ${rec.title}: ${rec.actionItems[0] || rec.description}`));
  }

  doc.save(`pandagarde-dfa-${score.tier}-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
};
