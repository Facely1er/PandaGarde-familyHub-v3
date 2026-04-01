import React from 'react';
import { translateToPlainLanguage, translateText } from '../../utils/plainLanguage';

interface PlainLanguageHelperProps {
  term?: string;
  text?: string;
  children?: React.ReactNode;
}

/**
 * Component to automatically translate technical terms to plain language
 */
const PlainLanguageHelper: React.FC<PlainLanguageHelperProps> = ({ 
  term, 
  text, 
  children 
}) => {
  if (term) {
    return <>{translateToPlainLanguage(term)}</>;
  }
  
  if (text) {
    return <>{translateText(text)}</>;
  }
  
  if (children && typeof children === 'string') {
    return <>{translateText(children)}</>;
  }
  
  return <>{children}</>;
};

export default PlainLanguageHelper;

