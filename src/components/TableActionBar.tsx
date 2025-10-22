import React from "react";

interface TableActionBarProps {
  children?: React.ReactNode;
}

const TableActionBar: React.FC<TableActionBarProps> = ({ children }) => {
  return (
    <div className="flex justify-between items-center p-3 border-b bg-gray-50">
      <span className="text-gray-600 text-sm">Manage Records</span>
      <div className="flex space-x-2">{children}</div>
    </div>
  );
};

export default TableActionBar;
