import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const formatDate = (timestamp: any): string => {
  if (!timestamp) return "";

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, "EEEE, dd MMMM yyyy", { locale: idLocale });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const formatShortDate = (timestamp: any): string => {
  if (!timestamp) return "";

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, "dd MMM yyyy", { locale: idLocale });
  } catch (error) {
    console.error("Error formatting short date:", error);
    return "";
  }
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  if (!startDate || !endDate) return "";

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startFormatted = format(start, "dd MMM", { locale: idLocale });
    const endFormatted = format(end, "dd MMM yyyy", { locale: idLocale });

    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    console.error("Error formatting date range:", error);
    return "";
  }
};

export const isDateInRange = (date: Date, startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return false;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return date >= start && date <= end;
  } catch (error) {
    console.error("Error checking date range:", error);
    return false;
  }
};

export const getRelativeDate = (timestamp: any): string => {
  if (!timestamp) return "";

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu lalu`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} bulan lalu`;

    return `${Math.ceil(diffDays / 365)} tahun lalu`;
  } catch (error) {
    console.error("Error getting relative date:", error);
    return "";
  }
};
