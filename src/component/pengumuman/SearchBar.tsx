import { FC } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  mounted: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ mounted, searchTerm, onSearchChange }) => {
  return (
    <div className={`text-center mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
      <div className="max-w-md mx-auto relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari"
          className="form-input w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent text-black smooth-transition"
        />
      </div>
    </div>
  );
};

export default SearchBar;
