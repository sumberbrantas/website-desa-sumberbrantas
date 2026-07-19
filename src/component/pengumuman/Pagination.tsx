import { FC } from "react";

interface PaginationProps {
  mounted: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ mounted, currentPage, totalPages, onPageChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={`flex items-center justify-center gap-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        «
      </button>

      <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        ‹
      </button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-colors ${currentPage === page ? "bg-[#1B3A6D] text-white" : "text-gray-700 hover:bg-gray-100"}`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ›
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        »
      </button>

      <div className="flex items-center gap-2 ml-4">
        <span className="text-sm text-gray-600">Page</span>
        <input type="number" min="1" max={totalPages} value={currentPage} onChange={handleInputChange} className="w-12 h-8 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1B3A6D]" />
        <span className="text-sm text-gray-600">of {totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;
