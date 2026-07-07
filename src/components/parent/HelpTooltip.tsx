import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  children?: React.ReactNode;
}

const positionClasses = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
};

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-x-transparent border-b-transparent border-t-gray-700',
  bottom: 'bottom-full left-1/2 -translate-y-0 border-x-transparent border-t-transparent border-b-gray-700',
  left: 'left-full top-1/2 -translate-y-1/2 border-y-transparent border-r-transparent border-l-gray-700',
  right: 'right-full top-1/2 -translate-y-1/2 border-y-transparent border-l-transparent border-r-gray-700',
};

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  title,
  position = 'top',
  trigger = 'hover',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    if (trigger === 'hover') setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') setIsVisible(!isVisible);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children || (
        <HelpCircle
          size={16}
          className="cursor-pointer align-middle text-gray-500 dark:text-gray-400"
          aria-hidden
        />
      )}

      {isVisible && (
        <div
          className={`absolute z-[1000] min-w-[200px] max-w-[300px] rounded-lg bg-gray-700 p-3 text-sm leading-relaxed text-white shadow-lg dark:bg-gray-800 ${positionClasses[position]} ${trigger === 'click' ? 'pointer-events-auto' : 'pointer-events-none'}`}
          role="tooltip"
        >
          {trigger === 'click' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              className="absolute right-2 top-2 rounded p-0.5 text-white hover:bg-white/10"
              aria-label="Close tooltip"
            >
              <X size={14} />
            </button>
          )}

          {title && <div className="mb-2 pr-4 text-[0.9375rem] font-semibold">{title}</div>}

          <div>{content}</div>

          <div
            className={`absolute h-0 w-0 border-[6px] border-transparent ${arrowClasses[position]}`}
            aria-hidden
          />
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;
