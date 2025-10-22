import React from 'react';

interface SelectProps {
  required?: boolean;
  label?: string;
  disabled?: boolean;
  options: Array<string | { value: string; label: string }>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  placeholder?: string;
  error?: string;
  className?: string;
  inlineLabel?: boolean;
  labelWidth?: string;
  inputWidth?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  name,
  options,
  disabled = false,
  error,
  className,
  inlineLabel = false,
  labelWidth = '150px',
  inputWidth,
}) => {
  const defaultClassName = `w-full px-3 py-2 border rounded-md text-[#878787] ${
    error ? 'border-red-500' : 'border-gray-300'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

  return (
    <div className="mb-4">
      <div className={inlineLabel ? 'flex items-center gap-4' : ''}>
        {label && (
          <label
            htmlFor={name}
            className={`${inlineLabel ? 'mb-0' : 'block mb-1'} text-sm`}
            style={inlineLabel ? { width: labelWidth, minWidth: labelWidth } : {}}
          >
            {label}
          </label>
        )}

        <div style={{ width: inputWidth || '100%' }}>
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={className || defaultClassName}
          >
            {options.map((opt) => {
              const optionValue = typeof opt === 'string' ? opt : opt.value;
              const optionLabel = typeof opt === 'string' ? opt : opt.label;

              return (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;