export type StatusIzin = 
  | 'Menunggu Verifikasi'
  | 'Sedang Diproses'
  | 'Disetujui'
  | 'Ditolak'
  | 'Perlu Perbaikan';

export type JenisIzin =
  | 'Izin tidak masuk sekolah karena sakit'
  | 'Izin tidak masuk sekolah karena keperluan keluarga'
  | 'Izin tidak masuk sekolah karena keperluan mendesak'
  | 'Izin meninggalkan sekolah sebelum jam pulang'
  | 'Izin mengikuti kegiatan di luar sekolah'
  | 'Jenis izin lainnya';

export interface PengajuanIzin {
  id: string; // ID_Pengajuan, e.g. IZIN-202610-0012
  timestamp: string; // ISO datetime
  namaSiswa: string;
  nisn: string;
  kelas: string; // e.g. Kelas I, Kelas II, dst
  namaOrangTua: string;
  nomorWhatsApp: string;
  jenisIzin: JenisIzin;
  jenisIzinLainnya?: string;
  tanggalMulai: string; // YYYY-MM-DD
  tanggalSelesai: string; // YYYY-MM-DD
  jamKeluar?: string; // HH:mm
  alasan: string;
  keterangan?: string;
  filePendukung?: {
    namaFile: string;
    tipe: string;
    ukuranKb: number;
    dataUrl?: string; // base64 preview
  };
  tandaTanganOrangTua?: string; // base64 PNG signature of parent/guardian
  status: StatusIzin;
  catatanAdmin?: string;
  waktuKeputusan?: string;
  diprosesOleh?: string;
  tokenVerifikasiHash: string; // SHA-256 or salt token for secure lookups
  tokenVerifikasiPlain?: string; // 6-digit PIN shown only on creation receipt
}

export interface RiwayatStatus {
  idRiwayat: string;
  idPengajuan: string;
  statusSebelumnya: string;
  statusBaru: StatusIzin;
  catatan: string;
  waktuPerubahan: string;
  adminPemroses: string;
}

export interface PengaturanSekolah {
  namaSekolah: string;
  alamatSekolah: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  emailSekolah: string;
  nomorKontakSekolah: string;
  tahunAjaran: string;
  zonaWaktu: string;
  gasWebAppUrl?: string;
}

export interface FilterPengajuan {
  searchQuery: string;
  kelas: string;
  status: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
}

export interface AdminUser {
  username: string;
  nama: string;
  role: 'Admin TU' | 'Kepala Sekolah' | 'Guru Piket';
}
