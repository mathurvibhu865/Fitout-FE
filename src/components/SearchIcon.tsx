import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchIconProps {
  onClick: () => void;
  className?: string; // <-- ADD THIS LINE
}

const SearchIcon: React.FC<SearchIconProps> = ({ onClick, className }) => (
  <button onClick={onClick} className={className}>
    <FiSearch />
  </button>
);

export default SearchIcon;
