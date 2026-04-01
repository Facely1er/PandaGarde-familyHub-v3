import jsPDF from 'jspdf';

export interface CertificateData {
  recipientName: string;
  achievement: string;
  date: string;
  familyName?: string;
  score?: number;
  totalActivities?: number;
  completedActivities?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirements: {
    type: 'activities' | 'score' | 'time' | 'streak';
    value: number;
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_activity',
    name: 'Privacy Explorer',
    description: 'Completed your first privacy activity',
    icon: '🌟',
    color: '#10B981',
    requirements: { type: 'activities', value: 1 }
  },
  {
    id: 'getting_started',
    name: 'Privacy Learner',
    description: 'Completed 3 privacy activities',
    icon: '📚',
    color: '#3B82F6',
    requirements: { type: 'activities', value: 3 }
  },
  {
    id: 'privacy_champion',
    name: 'Privacy Champion',
    description: 'Completed 6 privacy activities',
    icon: '🏆',
    color: '#F59E0B',
    requirements: { type: 'activities', value: 6 }
  },
  {
    id: 'dedicated_learner',
    name: 'Dedicated Learner',
    description: 'Spent 60+ minutes learning about privacy',
    icon: '⏰',
    color: '#8B5CF6',
    requirements: { type: 'time', value: 60 }
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score Master',
    description: 'Achieved perfect scores on all activities',
    icon: '💯',
    color: '#EF4444',
    requirements: { type: 'score', value: 100 }
  }
];

export class CertificateService {
  static async generateCertificate(certificateData: CertificateData): Promise<Blob> {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Child-friendly gradient background
    pdf.setFillColor(46, 125, 50); // Darker green
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add decorative border pattern
    pdf.setFillColor(76, 175, 80); // Lighter green
    pdf.rect(0, 0, pageWidth, 15, 'F'); // Top border
    pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F'); // Bottom border
    pdf.rect(0, 0, 15, pageHeight, 'F'); // Left border
    pdf.rect(pageWidth - 15, 0, 15, pageHeight, 'F'); // Right border

    // White content area with rounded corners
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(25, 25, pageWidth - 50, pageHeight - 50, 15, 15, 'F');

    // Decorative border with child-friendly colors
    pdf.setDrawColor(255, 193, 7); // Gold
    pdf.setLineWidth(4);
    pdf.roundedRect(25, 25, pageWidth - 50, pageHeight - 50, 15, 15, 'S');
    
    // Inner decorative border
    pdf.setDrawColor(76, 175, 80); // Green
    pdf.setLineWidth(2);
    pdf.roundedRect(30, 30, pageWidth - 60, pageHeight - 60, 10, 10, 'S');

    // Decorative elements - stars and sparkles
    pdf.setFillColor(255, 193, 7); // Gold
    pdf.circle(50, 50, 3, 'F'); // Top left star
    pdf.circle(pageWidth - 50, 50, 3, 'F'); // Top right star
    pdf.circle(50, pageHeight - 50, 3, 'F'); // Bottom left star
    pdf.circle(pageWidth - 50, pageHeight - 50, 3, 'F'); // Bottom right star
    
    // Panda logo area
    pdf.setFillColor(46, 125, 50);
    pdf.circle(pageWidth / 2, 45, 8, 'F');
    pdf.setFillColor(255, 255, 255);
    pdf.circle(pageWidth / 2, 45, 6, 'F');
    pdf.setTextColor(46, 125, 50);
    pdf.setFontSize(16);
    pdf.text('🐼', pageWidth / 2, 50, { align: 'center' });

    // Title with child-friendly styling
    pdf.setFontSize(32);
    pdf.setTextColor(46, 125, 50); // Dark green
    pdf.setFont('helvetica', 'bold');
    pdf.text('🌟 CERTIFICATE OF ACHIEVEMENT 🌟', pageWidth / 2, 70, { align: 'center' });

    // Subtitle with emoji
    pdf.setFontSize(16);
    pdf.setTextColor(75, 85, 99);
    pdf.setFont('helvetica', 'normal');
    pdf.text('🎓 Privacy Education Excellence 🎓', pageWidth / 2, 85, { align: 'center' });

    // Achievement icon and name with more visual appeal
    pdf.setFontSize(28);
    pdf.setTextColor(255, 193, 7); // Gold
    pdf.setFont('helvetica', 'bold');
    pdf.text('🏆', pageWidth / 2, 110, { align: 'center' });
    pdf.text(certificateData.achievement, pageWidth / 2, 130, { align: 'center' });

    // This certifies that with decorative line
    pdf.setDrawColor(255, 193, 7); // Gold
    pdf.setLineWidth(2);
    pdf.line(pageWidth / 2 - 40, 155, pageWidth / 2 + 40, 155);
    
    pdf.setFontSize(16);
    pdf.setTextColor(75, 85, 99);
    pdf.setFont('helvetica', 'normal');
    pdf.text('✨ This certifies that ✨', pageWidth / 2, 160, { align: 'center' });

    // Recipient name with special styling
    pdf.setFontSize(32);
    pdf.setTextColor(46, 125, 50); // Dark green
    pdf.setFont('helvetica', 'bold');
    pdf.text(certificateData.recipientName, pageWidth / 2, 185, { align: 'center' });
    
    // Decorative line under name
    pdf.setDrawColor(255, 193, 7); // Gold
    pdf.setLineWidth(2);
    pdf.line(pageWidth / 2 - 60, 190, pageWidth / 2 + 60, 190);

    // Achievement details with emojis
    pdf.setFontSize(16);
    pdf.setTextColor(75, 85, 99);
    pdf.setFont('helvetica', 'normal');
    
    let achievementText = '🎉 has successfully completed privacy education activities 🎉';
    if (certificateData.completedActivities && certificateData.totalActivities) {
      achievementText = `🎯 has completed ${certificateData.completedActivities} out of ${certificateData.totalActivities} privacy education activities 🎯`;
    }
    if (certificateData.score) {
      achievementText += ` with an amazing score of ${certificateData.score}%! 🌟`;
    }
    
    pdf.text(achievementText, pageWidth / 2, 210, { align: 'center' });

    // Decorative elements around achievement text
    pdf.setFillColor(255, 193, 7); // Gold
    pdf.circle(pageWidth / 2 - 80, 210, 2, 'F');
    pdf.circle(pageWidth / 2 + 80, 210, 2, 'F');

    // Date with special styling
    pdf.setFontSize(14);
    pdf.setTextColor(46, 125, 50); // Dark green
    pdf.setFont('helvetica', 'bold');
    pdf.text(`📅 Awarded on ${certificateData.date} 📅`, pageWidth / 2, 240, { align: 'center' });

    // Family name if provided
    if (certificateData.familyName) {
      pdf.setFontSize(12);
      pdf.setTextColor(75, 85, 99);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`👨‍👩‍👧‍👦 Family: ${certificateData.familyName} 👨‍👩‍👧‍👦`, pageWidth / 2, 255, { align: 'center' });
    }

    // Footer with panda branding
    pdf.setFontSize(12);
    pdf.setTextColor(46, 125, 50);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🐼 PandaGarde Privacy Education Platform 🐼', pageWidth / 2, 270, { align: 'center' });
    
    // Bottom decorative stars
    pdf.setFillColor(255, 193, 7); // Gold
    for (let i = 0; i < 5; i++) {
      const x = 60 + (i * 30);
      pdf.circle(x, pageHeight - 30, 2, 'F');
    }

    return pdf.output('blob');
  }

  static async generateAchievementBadge(achievement: Achievement, recipientName: string): Promise<Blob> {
    const pdf = new jsPDF('portrait', 'mm', [100, 100]);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Child-friendly background with gradient effect
    pdf.setFillColor(achievement.color);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add decorative border
    pdf.setFillColor(255, 255, 255);
    pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, 'F');
    
    // Inner colored border
    pdf.setDrawColor(achievement.color);
    pdf.setLineWidth(3);
    pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, 'S');

    // White circle for content with decorative elements
    pdf.setFillColor(255, 255, 255);
    pdf.circle(pageWidth / 2, pageHeight / 2, 35, 'F');
    
    // Decorative stars around the circle
    pdf.setFillColor(255, 193, 7); // Gold
    pdf.circle(pageWidth / 2 - 25, pageHeight / 2 - 25, 2, 'F'); // Top left
    pdf.circle(pageWidth / 2 + 25, pageHeight / 2 - 25, 2, 'F'); // Top right
    pdf.circle(pageWidth / 2 - 25, pageHeight / 2 + 25, 2, 'F'); // Bottom left
    pdf.circle(pageWidth / 2 + 25, pageHeight / 2 + 25, 2, 'F'); // Bottom right

    // Achievement icon with larger size
    pdf.setFontSize(32);
    pdf.setTextColor(achievement.color);
    pdf.text(achievement.icon, pageWidth / 2, pageHeight / 2 - 8, { align: 'center' });

    // Achievement name with better styling
    pdf.setFontSize(10);
    pdf.setTextColor(achievement.color);
    pdf.setFont('helvetica', 'bold');
    pdf.text(achievement.name, pageWidth / 2, pageHeight / 2 + 8, { align: 'center' });

    // Recipient name with emoji
    pdf.setFontSize(8);
    pdf.setTextColor(75, 85, 99);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`🌟 ${recipientName} 🌟`, pageWidth / 2, pageHeight / 2 + 18, { align: 'center' });
    
    // Bottom decorative text
    pdf.setFontSize(6);
    pdf.setTextColor(achievement.color);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🏆 ACHIEVEMENT BADGE 🏆', pageWidth / 2, pageHeight / 2 + 28, { align: 'center' });

    return pdf.output('blob');
  }

  static downloadCertificate(certificateData: CertificateData, filename?: string): void {
    this.generateCertificate(certificateData).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `privacy-certificate-${certificateData.recipientName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  static downloadAchievementBadge(achievement: Achievement, recipientName: string): void {
    this.generateAchievementBadge(achievement, recipientName).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `achievement-${achievement.id}-${recipientName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  static checkAchievements(progress: { completedActivities: number; activityDetails: Record<string, { score?: number }> }): Achievement[] {
    const earnedAchievements: Achievement[] = [];
    
    for (const achievement of ACHIEVEMENTS) {
      let earned = false;
      
      switch (achievement.requirements.type) {
        case 'activities':
          earned = progress.completedActivities >= achievement.requirements.value;
          break;
        case 'score': {
          const avgScore = Object.values(progress.activityDetails)
            .filter((activity) => activity.score !== undefined)
            .reduce((sum: number, activity) => sum + (activity.score || 0), 0) / 
            Object.values(progress.activityDetails).filter((activity) => activity.score !== undefined).length;
          earned = avgScore >= achievement.requirements.value;
          break;
        }
        case 'time':
          earned = progress.totalTimeSpent >= achievement.requirements.value;
          break;
        case 'streak':
          // Implement streak logic if needed
          earned = false;
          break;
      }
      
      if (earned && !progress.achievements.includes(achievement.id)) {
        earnedAchievements.push(achievement);
      }
    }
    
    return earnedAchievements;
  }
}