import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)} // ✅ important!
      />
      <div
        className={`w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`h-5 w-5 bg-white rounded-full shadow transform transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
    </label>
  );
};
    

export default ToggleSwitch;