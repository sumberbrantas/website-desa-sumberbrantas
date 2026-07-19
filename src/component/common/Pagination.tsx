import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  loading?: boolean;
  className?: string;
  onItemsPerPageChange?: (newItemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, loading = false, className = "", onItemsPerPageChange, itemsPerPageOptions = [5, 10, 25, 50, 100] }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-6 border-t smooth-transition ${className}`} style={{ backgroundColor: "var(--background-alt)", borderColor: "var(--border)" }}>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="text-sm" style={{ color: "var(--foreground)" }}>
          Menampilkan <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> dari <span className="font-medium">{totalItems}</span> data
        </div>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: "var(--foreground)" }}>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 text-sm rounded input-earth focus:outline-none focus:ring-2"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <nav className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: "var(--foreground)", backgroundColor: "white", borderColor: "var(--border)" }}
        >
          <FiChevronLeft size={16} />
          Previous
        </button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-sm" style={{ color: "var(--text-muted)" }}>...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentPage === page ? "text-white" : "border smooth-transition"
                  }`}
                  style={currentPage === page ? { backgroundColor: "var(--primary)", color: "white" } : { backgroundColor: "white", color: "var(--foreground)", borderColor: "var(--border)" }}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: "var(--foreground)", backgroundColor: "white", borderColor: "var(--border)" }}
        >
          Next
          <FiChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
