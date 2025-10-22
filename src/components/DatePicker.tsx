interface DatePickerProps {
  label: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'date' | 'datetime-local' | 'month' | 'time';
  minDate?: string | Date;
  maxDate?: string | Date;
  value: string | Date;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

const DatePicker = ({
  label,
  name,
  required = false,
  disabled = false,
  type = 'date',
  minDate,
  maxDate,
  value,
  onChange,
  error,
  className = '',
}: DatePickerProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        type={type}
        name={name}
        min={minDate instanceof Date ? minDate.toISOString().split('T')[0] : minDate}
        max={maxDate instanceof Date ? maxDate.toISOString().split('T')[0] : maxDate}
        value={value instanceof Date ? value.toISOString().split('T')[0] : value || ''}
        onChange={onChange}
        disabled={disabled}
        className={`px-3 py-2 border rounded-md transition-colors
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-80' : 'bg-white'}
          ${className}
        `}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DatePicker;