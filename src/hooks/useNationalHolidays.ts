"use client";

import { useState, useEffect } from "react";

export interface NationalHoliday {
  id: string;
  name: string;
  date: string;
  description?: string;
  type: "national" | "religious" | "regional";
  isToday: boolean;
  isUpcoming: boolean;
  daysFromToday: number;
}

interface HolidayAPIResponse {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

export const useNationalHolidays = () => {
  const [holidays, setHolidays] = useState<NationalHoliday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentYear = () => new Date().getFullYear();

  const calculateDaysFromToday = (holidayDate: string): number => {
    const today = new Date();
    const holiday = new Date(holidayDate);
    const diffTime = holiday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isToday = (holidayDate: string): boolean => {
    const today = new Date();
    const holiday = new Date(holidayDate);
    return today.toDateString() === holiday.toDateString();
  };

  const isUpcoming = (holidayDate: string): boolean => {
    const daysFromToday = calculateDaysFromToday(holidayDate);
    return daysFromToday >= 0;
  };

  const formatHolidayData = (apiData: HolidayAPIResponse[]): NationalHoliday[] => {
    return apiData
      .map((holiday, index) => ({
        id: `holiday-${index}`,
        name: holiday.localName || holiday.name,
        date: holiday.date,
        description: holiday.name !== holiday.localName ? holiday.name : undefined,
        type: holiday.types.includes("Public") ? ("national" as const) : holiday.types.includes("Religious") ? ("religious" as const) : ("regional" as const),
        isToday: isToday(holiday.date),
        isUpcoming: isUpcoming(holiday.date),
        daysFromToday: calculateDaysFromToday(holiday.date),
      }))
      .filter((holiday) => holiday.isUpcoming || holiday.isToday)
      .sort((a, b) => a.daysFromToday - b.daysFromToday);
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentYear = getCurrentYear();

        const currentYearResponse = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/ID`);

        if (!currentYearResponse.ok) {
          throw new Error(`HTTP error! status: ${currentYearResponse.status}`);
        }

        const currentYearData: HolidayAPIResponse[] = await currentYearResponse.json();
        let formattedHolidays = formatHolidayData(currentYearData);

        if (formattedHolidays.length < 3) {
          try {
            const nextYear = currentYear + 1;
            const nextYearResponse = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${nextYear}/ID`);

            if (nextYearResponse.ok) {
              const nextYearData: HolidayAPIResponse[] = await nextYearResponse.json();
              const nextYearHolidays = formatHolidayData(nextYearData);

              const combinedHolidays = [...formattedHolidays, ...nextYearHolidays].sort((a, b) => a.daysFromToday - b.daysFromToday);

              formattedHolidays = combinedHolidays;
            }
          } catch (nextYearError) {
            console.warn("Failed to fetch next year holidays:", nextYearError);
          }
        }

        setHolidays(formattedHolidays.slice(0, 3));
      } catch (err) {
        console.error("Error fetching national holidays:", err);
        setError("Gagal mengambil data hari besar nasional");

        setHolidays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  const getTodayHolidays = () => holidays.filter((holiday) => holiday.isToday);
  const getUpcomingHolidays = () => holidays.filter((holiday) => !holiday.isToday && holiday.isUpcoming);

  return {
    holidays,
    loading,
    error,
    getTodayHolidays,
    getUpcomingHolidays,
    refetch: () => {
      setLoading(true);
      setHolidays([]);
    },
  };
};

