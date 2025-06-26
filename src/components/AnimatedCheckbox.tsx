
import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedCheckbox = ({ checked, onChange, size = 'md' }: AnimatedCheckboxProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onChange(!checked);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]} 
        border-2 rounded-lg transition-all duration-300 flex items-center justify-center
        ${checked 
          ? 'bg-green-500 border-green-500 scale-110' 
          : 'bg-white border-gray-300 hover:border-gray-400'
        }
        ${isAnimating ? 'animate-bounce' : ''}
      `}
    >
      {checked && (
        <Check 
          className={`${iconSizes[size]} text-white transition-all duration-200 ${
            isAnimating ? 'scale-125' : ''
          }`} 
        />
      )}
    </button>
  );
};

export default AnimatedCheckbox;
