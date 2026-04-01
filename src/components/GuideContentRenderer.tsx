import React from 'react';
import { GuideContent, GuideCard, GuideHeading } from '../data/familyPrivacyGuide';

interface GuideContentRendererProps {
  content: GuideContent;
  index?: number;
}

export const GuideContentRenderer: React.FC<GuideContentRendererProps> = ({ content, index }) => {
  switch (content.type) {
    case 'paragraph':
      return (
        <p 
          className="mb-4 leading-relaxed" 
          style={{ color: 'var(--gray-700)' }}
        >
          {typeof content.content === 'string' ? content.content : ''}
        </p>
      );

    case 'list':
      if (Array.isArray(content.content)) {
        return (
          <ul className="mb-4 space-y-2 list-disc list-inside" style={{ color: 'var(--gray-700)' }}>
            {content.content.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        );
      }
      return null;

    case 'quote':
      return (
        <blockquote 
          className="my-6 pl-4 border-l-4 border-green-500 italic" 
          style={{ color: 'var(--gray-700)', borderColor: 'var(--primary)' }}
        >
          <p className="text-lg">
            {typeof content.content === 'string' ? content.content : ''}
          </p>
        </blockquote>
      );

    case 'card': {
      const card = content.content as GuideCard;
      return (
        <div 
          className="my-6 p-6 rounded-xl border" 
          style={{ 
            backgroundColor: 'var(--light)', 
            borderColor: 'var(--gray-200)' 
          }}
        >
          <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {card.title}
          </h4>
          <ul className="space-y-2">
            {card.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2" style={{ color: 'var(--gray-700)' }}>
                <span className="text-green-600 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    case 'heading': {
      const heading = content.content as GuideHeading;
      const HeadingTag = `h${heading.level}` as keyof JSX.IntrinsicElements;
      const headingClasses = {
        2: 'text-2xl font-bold mb-4 mt-8',
        3: 'text-xl font-semibold mb-3 mt-6',
        4: 'text-lg font-semibold mb-2 mt-4'
      };
      
      return (
        <HeadingTag 
          className={headingClasses[heading.level]}
          style={{ color: 'var(--primary)' }}
        >
          {heading.text}
        </HeadingTag>
      );
    }

    default:
      return null;
  }
};

export default GuideContentRenderer;

