import React from "react";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actions }) => {
  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <div>{actions}</div>
    </div>
  );
};

export default PageHeader;
