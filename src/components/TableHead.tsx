import React from "react";

interface Column {
  label: string;
  align?: "left" | "center" | "right";
}

interface TableHeadProps {
  columns: Column[];
}

const TableHead: React.FC<TableHeadProps> = ({ columns }) => {
  return (
    <thead className="bg-gray-100">
      <tr>
        {columns.map((col, idx) => (
          <th
            key={idx}
            className={`px-4 py-3 text-sm font-semibold text-gray-700 border-b ${
              col.align === "center"
                ? "text-center"
                : col.align === "right"
                ? "text-right"
                : "text-left"
            }`}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
