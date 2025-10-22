import React, { useState } from "react";

export interface TopBarProps {
  buttons?: string[];
  onSearch?: (query: string) => void;
  onButtonClick?: (type: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ buttons = [], onSearch, onButtonClick }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div className="flex items-center justify-between space-x-4">
      <input
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Search..."
        className="border p-2 rounded flex-1"
      />
      {buttons.map((btn) => (
        <button
          key={btn}
          onClick={() => onButtonClick?.(btn)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {btn}
        </button>
      ))}
    </div>
  );
};

export default TopBar;
