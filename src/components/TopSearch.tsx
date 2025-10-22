import React from "react";
import { FiSearch } from "react-icons/fi";

interface TopSearchProps {
  onSearch: () => void; // toggle filter row
  onButtonClick: (type: string) => void; // called when a button is clicked
  buttons: string[]; // array of button labels
  children?: React.ReactNode; // inline inputs or other elements
}

const TopSearch: React.FC<TopSearchProps> = ({ onSearch, onButtonClick, buttons, children }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      {/* Left side: Search icon + inline children */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSearch}
          className="p-2 text-gray-600 hover:text-blue-600 transition"
        >
          <FiSearch size={20} />
        </button>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>

      {/* Right side: Buttons */}
      <div className="flex flex-wrap gap-4">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => onButtonClick(btn)}
            className="bg-white text-gray-700 px-3 py-2 rounded-md border border-gray-400 hover:border-blue-500 hover:text-blue-600 transition cursor-pointer"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopSearch;
