import { useState, useEffect } from "react";
import { useActiveAnnouncements } from "@/hooks/useAnnouncements";
import usePageVisitor from "@/hooks/usePageVisitor";

export const usePengumuman = () => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { announcements, loading, error, refetch } = useActiveAnnouncements();

  usePageVisitor("Pengumuman");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredAnnouncements = announcements.filter((announcement) => announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) || announcement.content.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const currentAnnouncements = filteredAnnouncements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return {
    mounted,
    searchTerm,
    currentPage,
    totalPages,
    currentAnnouncements,
    itemsPerPage,
    filteredAnnouncements,
    loading,
    error,
    refetch,
    handlePageChange,
    handleSearchChange,
    handleItemsPerPageChange,
  };
};
