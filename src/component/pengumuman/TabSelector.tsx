import { FC } from "react";
import Link from "next/link";

interface TabSelectorProps {
  mounted: boolean;
}

const TabSelector: FC<TabSelectorProps> = ({ mounted }) => {
  return (
    <div className={`mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-1 shadow-sm">
          <Link href="/berita">
            <button className="px-8 py-3 rounded-md font-medium text-sm transition-all duration-200 text-gray-600 hover:text-gray-900">
              Berita
            </button>
          </Link>
          <button className="px-8 py-3 rounded-md font-medium text-sm transition-all duration-200 bg-[#1B3A6D] text-white shadow-sm">
            Pengumuman
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabSelector;
