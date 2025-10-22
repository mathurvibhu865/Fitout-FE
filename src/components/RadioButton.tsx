// RadioButton.tsx
import React from 'react';

interface RadioButtonProps {
  label?: string;
  name: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  layout?: 'horizontal' | 'vertical';
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  layout = 'vertical'
}) => {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div className={`flex ${layout === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2'}`}>
        {options.map(option => (
          <div key={option} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option}`}
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label 
              htmlFor={`${name}-${option}`}
              className="ml-1.5 text-xs font-medium text-gray-700"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioButton;