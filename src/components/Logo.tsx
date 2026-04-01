import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'auto', showText = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    auto: ''
  };

  // When size is 'auto', render just the image to fill its parent container
  if (size === 'auto' && !showText) {
    return (
      <img 
        src="/LogoPandagarde.png" 
        alt="PandaGarde Logo" 
        className={`w-full h-full object-contain ${className}`}
      />
    );
  }

  return (
    <div className={`logo-icon flex items-center gap-2 ${className}`}>
      <img 
        src="/LogoPandagarde.png" 
        alt="PandaGarde Logo" 
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <span className="font-bold text-lg">PandaGarde</span>
      )}
    </div>
  );
};

export default Logo;