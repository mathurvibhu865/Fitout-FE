import React, { type ReactNode } from "react";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";

export interface BreadcrumbItem {
  label: string | ReactNode;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  current?: string;
  onClick?: (item: BreadcrumbItem) => void;
  className?: string;
  showRootIcon?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronDoubleLeftIcon className="w-4 h-4 text-gray-400 mx-1" />,
  current,
  onClick,
  className = "text-sm text-gray-500",
  showRootIcon = true,
}) => {
  return (
    <nav className={`flex items-center ${className}`} aria-label="Breadcrumb">
      {/* Optional root icon before the first item */}
      {showRootIcon && (
        <ChevronDoubleLeftIcon className="w-4 h-4 text-gray-400 mr-1" />
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = current ? item.label === current : isLast;

        return (
          <span key={index} className="flex items-center">
            {index !== 0 && <span>{separator}</span>}
            {isCurrent ? (
              <span className="font-medium text-gray-900">{item.label}</span>
            ) : (
              <button
                onClick={() => onClick?.(item)}
                className="hover:underline focus:outline-none"
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
