"use client";

import { useState, useEffect } from "react";
import { ProfilDesa } from "@/lib/profilDesaTypes";
import { getProfilDesa } from "@/lib/profilDesaService";

export const useProfilDesa = () => {
  const [profilDesa, setProfilDesa] = useState<ProfilDesa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfilDesa = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfilDesa();
      setProfilDesa(data);
    } catch (err) {
      console.error("Error fetching profil desa:", err);
      setError("Gagal memuat data profil desa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfilDesa();
  }, []);

  return {
    profilDesa,
    loading,
    error,
    refetch: fetchProfilDesa,
  };
};
