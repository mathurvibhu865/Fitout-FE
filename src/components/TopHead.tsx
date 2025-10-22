import React from "react";

interface Column {
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
}

interface TableHeadProps {
  columns: Column[];
}

const TableHead: React.FC<TableHeadProps> = ({ columns }) => {
  return (
    <thead>
      <tr className="bg-gray-100 text-gray-700">
        {columns.map((col, idx) => {
          const alignClass =
            col.align === "center"
              ? "text-center"
              : col.align === "right"
              ? "text-right"
              : "text-left";
          return (
            <th
              key={idx}
              className={`p-3 border-b font-normal ${alignClass}`}
              style={{ width: col.width }}
            >
              {col.label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
