import { useState } from 'react';
import { Eye, EyeOff, Search } from 'lucide-react';

interface TextInputProps {
  label: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'url' | 'search' | 'time';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  minimum_length?: number;
  maximum_length?: number;
  regex?: string;
  searchIcon?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
  inlineLabel?: boolean;
  labelWidth?: string;
  inputWidth?: string; // ✅ New optional prop
}

const TextInput = ({
  label,
  required = false,
  disabled = false,
  type = 'text',
  value,
  onChange,
  name,
  minimum_length,
  maximum_length,
  regex,
  searchIcon,
  error,
  className = '',
  placeholder = '',
  inlineLabel = false,
  labelWidth = '150px',
  inputWidth // ✅ new
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => setShowPassword(!showPassword);

  return (
    <div className={`mb-4 ${className}`}>
      <div className={`${inlineLabel ? 'flex items-center gap-4' : ''}`}>
        {label && (
          <label
            className={`text-sm mb-1 ${inlineLabel ? 'mb-0' : 'block'}`}
            style={inlineLabel ? { width: labelWidth, minWidth: labelWidth } : {}}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div
          className="relative"
          style={{ width: inputWidth || '100%' }} // ✅ Apply input width if provided
        >
          <input
            name={name}
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            minLength={minimum_length}
            maxLength={maximum_length}
            pattern={regex}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md placeholder-[#878787] ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          {type === 'password' && (
            <button
              type="button"
              onClick={handleToggle}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {type === 'search' && searchIcon && (
            <Search className="absolute right-3 top-3 text-gray-400" size={18} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TextInput;
