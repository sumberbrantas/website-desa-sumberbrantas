/**
 * ProfilDesaService - CRUD untuk Profil Desa
 * Menggunakan Firestore untuk storage dan localStorage untuk mock data
 */

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, useMockData } from "./firebase";
import { mockProfilDesa, mockUpdateProfilDesa } from "./mockDataProfilDesa";
import { ProfilDesa } from "./profilDesaTypes";

const PROFIL_DESA_DOC = "profil_desa";

// Default profil desa
export const DEFAULT_PROFIL_DESA: ProfilDesa = {
  judulHalaman: "Profil Desa Sumberbrantas",
  subJudul: "Kecamatan Bumiaji, Kota Batu, Jawa Timur",
  visi: {
    text: "Terwujudnya masyarakat adil, makmur, dan sejahtera melalui peningkatan kualitas sumber daya manusia yang terdidik, maju, aman dengan didukung pengembangan ekonomi berbasis sumber daya alam.",
  },
  misi: [
    { id: "m1", text: "Ikut melaksanakan/mengamalkan ajaran agama dalam kehidupan bermasyarakat berbangsa berbangsa dan bernegara sebagai wujud peningkatan keimanan dan ketaqwaan kepada Tuhan Yang Maha Esa.", order: 1 },
    { id: "m2", text: "Mewujudkan dan mendorong terjadinya usaha-usaha kerukunan antar dan intern warga masyarakat yang disebabkan karena adanya perbedaan agama, keyakinan, organisasi, dan lainnya dalam suasana saling menghargai dan menghormati.", order: 2 },
    { id: "m3", text: "Mengembangkan kehidupan masyarakat untuk terwujudnya tatanan masyarakat yang taat kepada peraturan perundang-undangan dalam rangka meningkatkan kehidupan masyarakat yang aman, tertib, tentram dan damai serta meningkatkan persatuan dan kesatuan dalam wadah negara kesatuan Republik Indonesia.", order: 3 },
    { id: "m4", text: "Terwujudnya peningkatan kualitas kehidupan masyarakat yang ditandai terpenuhinya kebutuhan pangan, sandang, papan, kesehatan, pendidikan, dan lapangan kerja.", order: 4 },
    { id: "m5", text: "Membangun dan meningkatkan hasil pertanian dengan jalan penataan pengairan, perbaikan jalan sawah jalan usaha tani, pemupukan, dan pola tanam yang baik.", order: 5 },
    { id: "m6", text: "Pengembangan sektor pertanian dan perdagangan yang berorientasi pada mekanisme pasar.", order: 6 },
    { id: "m7", text: "Menumbuhkembangkan usaha kecil dan menengah.", order: 7 },
    { id: "m8", text: "Pemberdayaan ekonomi masyarakat khususnya UMKM (Usaha Kecil Menengah dan Mikro) yang berdaya saing tinggi.", order: 8 },
    { id: "m9", text: "Membangun dan mendorong usaha-usaha untuk pengembangan dan optimalisasi sektor pertanian, perkebunan, peternakan, dan perikanan, baik tahap produksi maupun tahap pengolahan hasilnya.", order: 9 },
    { id: "m10", text: "Meningkatkan kemajuan dan kemandirian melalui penyelenggaraan otonomi desa yang bertanggung jawab dan didukung dengan penyelengaraan pemerintahan yang bersih, transparan dan profesional.", order: 10 },
  ],
  googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15802.794855555!2d112.5825!3d-8.1825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78f7c123456789%3A0x123456789abcdef!2sNgebruk%2C%20Sumberpucung%2C%20Malang%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid",
  batasWilayah: [
    { arah: "Utara", wilayah: "Kecamatan Kromengan" },
    { arah: "Timur", wilayah: "Kecamatan Kepanjen" },
    { arah: "Selatan", wilayah: "Desa Ternyang, Senggreng dan Sambigede" },
    { arah: "Barat", wilayah: "Desa Jatiguwi" },
  ],
  statistik: {
    luasDesa: "505,275",
    jumlahPenduduk: "7.847",
    jarakKeKecamatan: "5",
    jarakKeKabupaten: "25",
  },
  penggunaanLahan: [
    { id: "pl1", jenis: "Sawah", luas: "214,167 Ha", icon: "🌾" },
    { id: "pl2", jenis: "Tanah Tegal", luas: "40,585 Ha", icon: "🌱" },
    { id: "pl3", jenis: "Pemukiman", luas: "109,497 Ha", icon: "🏘️" },
    { id: "pl4", jenis: "Hutan Jati", luas: "125,250 Ha", icon: "🌳" },
    { id: "pl5", jenis: "Makam", luas: "1,050 Ha", icon: "⛪" },
    { id: "pl6", jenis: "Lain-lain", luas: "14,276 Ha", icon: "📍" },
  ],
  dataDusun: [
    { id: "d1", dusun: "Kebonsari", rt: 12, rw: 2, penduduk: 2185, kk: 695 },
    { id: "d2", dusun: "Krajan", rt: 14, rw: 2, penduduk: 3302, kk: 1000 },
    { id: "d3", dusun: "Mbodo", rt: 13, rw: 2, penduduk: 2360, kk: 748 },
  ],
  dataAgama: [
    { id: "a1", agama: "Islam", total: 7773, persentase: "99.1%" },
    { id: "a2", agama: "Kristen", total: 46, persentase: "0.6%" },
    { id: "a3", agama: "Katholik", total: 28, persentase: "0.4%" },
    { id: "a4", agama: "Budha", total: 2, persentase: "0.03%" },
  ],
  mataPencaharian: [
    { id: "mp1", jenis: "Buruh Tani", jumlah: 1298, icon: "🌾" },
    { id: "mp2", jenis: "Petani", jumlah: 817, icon: "👨‍🌾" },
    { id: "mp3", jenis: "Swasta", jumlah: 614, icon: "💼" },
    { id: "mp4", jenis: "Wiraswasta", jumlah: 489, icon: "🏪" },
    { id: "mp5", jenis: "Tukang Bangunan", jumlah: 192, icon: "🔨" },
    { id: "mp6", jenis: "Lainnya", jumlah: 175, icon: "👥" },
  ],
};

/**
 * Ambil data profil desa
 */
export const getProfilDesa = async (): Promise<ProfilDesa> => {
  if (useMockData) {
    return mockProfilDesa;
  }

  try {
    if (!db) {
      return DEFAULT_PROFIL_DESA;
    }
    const docRef = doc(db, "profil_desa", PROFIL_DESA_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...DEFAULT_PROFIL_DESA,
        ...docSnap.data(),
      } as ProfilDesa;
    } else {
      // Buat default jika belum ada
      await setDoc(docRef, DEFAULT_PROFIL_DESA);
      return DEFAULT_PROFIL_DESA;
    }
  } catch (error) {
    console.error("Error getting profil desa:", error);
    return DEFAULT_PROFIL_DESA;
  }
};

/**
 * Update data profil desa
 */
export const updateProfilDesa = async (data: Partial<ProfilDesa>): Promise<ProfilDesa> => {
  if (useMockData) {
    return mockUpdateProfilDesa(data);
  }

  try {
    if (!db) {
      throw new Error("Firebase not configured");
    }
    const docRef = doc(db, "profil_desa", PROFIL_DESA_DOC);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const newData = { ...DEFAULT_PROFIL_DESA, ...data };
      await setDoc(docRef, newData);
      return newData as ProfilDesa;
    }

    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });

    const updatedSnap = await getDoc(docRef);
    return {
      ...DEFAULT_PROFIL_DESA,
      ...updatedSnap.data(),
    } as ProfilDesa;
  } catch (error) {
    console.error("Error updating profil desa:", error);
    throw new Error("Gagal menyimpan profil desa");
  }
};

/**
 * Reset profil desa ke default
 */
export const resetProfilDesa = async (): Promise<ProfilDesa> => {
  return updateProfilDesa(DEFAULT_PROFIL_DESA);
};
