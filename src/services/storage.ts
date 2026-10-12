import { PengajuanIzin, RiwayatStatus, PengaturanSekolah, StatusIzin, FilterPengajuan } from '../types';

const STORAGE_KEY_PENGAJUAN = 'sipos_sdn004_pengajuan_v1';
const STORAGE_KEY_RIWAYAT = 'sipos_sdn004_riwayat_v1';
const STORAGE_KEY_CONFIG = 'sipos_sdn004_config_v1';
const STORAGE_KEY_GAS_URL = 'sipos_sdn004_gas_url_v1';
const STORAGE_KEY_ADMIN_KEY = 'sipos_sdn004_admin_key_v1';

// Initial school configuration
export const DEFAULT_PENGATURAN: PengaturanSekolah = {
  namaSekolah: 'SDN 004 Sebatik Tengah',
  alamatSekolah: 'Desa Sungai Limau, Kecamatan Sebatik Tengah, Kabupaten Nunukan, Kalimantan Utara',
  namaKepalaSekolah: 'H. Basir, S.Pd., M.Pd.',
  nipKepalaSekolah: '19780512 200502 1 003',
  emailSekolah: 'sdn004sebatiktengah@gmail.com',
  nomorKontakSekolah: '+62 822-5555-0040',
  tahunAjaran: '2026/2027',
  zonaWaktu: 'Asia/Makassar (WITA)',
  gasWebAppUrl: '',
};

// Initial realistic seed records for SDN 004 Sebatik Tengah
const INITIAL_PENGAJUAN: PengajuanIzin[] = [
  {
    id: 'IZIN-202610-0021',
    timestamp: '2026-10-10 07:15:30',
    namaSiswa: 'Muhammad Ridho Pratama',
    nisn: '0129482910',
    kelas: 'Kelas IV',
    namaOrangTua: 'H. Suryadi',
    nomorWhatsApp: '081254332190',
    jenisIzin: 'Izin tidak masuk sekolah karena sakit',
    tanggalMulai: '2026-10-10',
    tanggalSelesai: '2026-10-12',
    alasan: 'Demam tinggi dan flu, disarankan dokter istirahat di rumah.',
    keterangan: 'Surat dokter terlampir dari Puskesmas Aji Kuning',
    status: 'Disetujui',
    catatanAdmin: 'Disetujui. Semoga lekas sembuh dan bisa belajar kembali.',
    waktuKeputusan: '2026-10-10 07:45:12',
    diprosesOleh: 'Basir, S.Pd. (Kepala Sekolah)',
    tokenVerifikasiHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    tokenVerifikasiPlain: '123456',
    tandaTanganOrangTua: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"><path d="M20 50 Q 50 15, 70 45 T 120 40 T 170 35 M 25 65 Q 90 55, 175 60" fill="none" stroke="%230F52BA" stroke-width="3" stroke-linecap="round"/></svg>',
  },
  {
    id: 'IZIN-202610-0022',
    timestamp: '2026-10-11 06:40:15',
    namaSiswa: 'Nur Aisyah Humaira',
    nisn: '0148821903',
    kelas: 'Kelas II',
    namaOrangTua: 'Fatimah Az-Zahra',
    nomorWhatsApp: '082198776654',
    jenisIzin: 'Izin tidak masuk sekolah karena keperluan keluarga',
    tanggalMulai: '2026-10-11',
    tanggalSelesai: '2026-10-11',
    alasan: 'Menghadiri acara pernikahan keluarga di Nunukan.',
    keterangan: 'Akan mengejar ketertinggalan pelajaran bersama wali kelas.',
    status: 'Sedang Diproses',
    catatanAdmin: 'Sedang diverifikasi oleh guru piket.',
    waktuKeputusan: '2026-10-11 07:10:00',
    diprosesOleh: 'Ratna Dewi, S.Pd. (Guru Piket)',
    tokenVerifikasiHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    tokenVerifikasiPlain: '654321',
  },
  {
    id: 'IZIN-202610-0023',
    timestamp: '2026-10-11 07:30:20',
    namaSiswa: 'Ahmad Al-Fatih',
    nisn: '0112948271',
    kelas: 'Kelas V',
    namaOrangTua: 'Kaharuddin',
    nomorWhatsApp: '085244119988',
    jenisIzin: 'Izin meninggalkan sekolah sebelum jam pulang',
    tanggalMulai: '2026-10-11',
    tanggalSelesai: '2026-10-11',
    jamKeluar: '10:30',
    alasan: 'Pemeriksaan gigi berkala di Rumah Sakit Pratama Sebatik.',
    keterangan: 'Dijemput langsung oleh ayah kandung di gerbang sekolah.',
    status: 'Menunggu Verifikasi',
    catatanAdmin: '',
    tokenVerifikasiHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    tokenVerifikasiPlain: '889900',
  },
  {
    id: 'IZIN-202610-0024',
    timestamp: '2026-10-09 08:20:00',
    namaSiswa: 'Siti Sarah Azzahra',
    nisn: '0139981240',
    kelas: 'Kelas III',
    namaOrangTua: 'Baharuddin',
    nomorWhatsApp: '081344556677',
    jenisIzin: 'Izin mengikuti kegiatan di luar sekolah',
    tanggalMulai: '2026-10-09',
    tanggalSelesai: '2026-10-09',
    alasan: 'Mewakili kecamatan dalam lomba tahfidz Qur an tingkat kabupaten.',
    keterangan: 'Surat rekomendasi KUA Sebatik Tengah dilampirkan.',
    status: 'Disetujui',
    catatanAdmin: 'Disetujui resmi. Selamat berjuang mengharumkan nama sekolah.',
    waktuKeputusan: '2026-10-09 09:00:00',
    diprosesOleh: 'H. Basir, S.Pd., M.Pd.',
    tokenVerifikasiHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    tokenVerifikasiPlain: '112233',
  },
  {
    id: 'IZIN-202610-0025',
    timestamp: '2026-10-08 09:12:45',
    namaSiswa: 'Dimas Bagus Saputra',
    nisn: '0102938475',
    kelas: 'Kelas VI',
    namaOrangTua: 'Tri Santoso',
    nomorWhatsApp: '082211993344',
    jenisIzin: 'Izin tidak masuk sekolah karena keperluan keluarga',
    tanggalMulai: '2026-10-08',
    tanggalSelesai: '2026-10-08',
    alasan: 'Tidak masuk tanpa rincian alasan jelas.',
    keterangan: '',
    status: 'Perlu Perbaikan',
    catatanAdmin: 'Mohon lengkapi alasan permohonan izin secara jelas dan dapat dipertanggungjawabkan.',
    waktuKeputusan: '2026-10-08 10:15:00',
    diprosesOleh: 'Ratna Dewi, S.Pd. (Guru Piket)',
    tokenVerifikasiHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    tokenVerifikasiPlain: '334455',
  }
];

const INITIAL_RIWAYAT: RiwayatStatus[] = [
  {
    idRiwayat: 'RWY-001',
    idPengajuan: 'IZIN-202610-0021',
    statusSebelumnya: '-',
    statusBaru: 'Menunggu Verifikasi',
    catatan: 'Pengajuan izin dibuat oleh orang tua',
    waktuPerubahan: '2026-10-10 07:15:30',
    adminPemroses: 'Sistem (Orang Tua)',
  },
  {
    idRiwayat: 'RWY-002',
    idPengajuan: 'IZIN-202610-0021',
    statusSebelumnya: 'Menunggu Verifikasi',
    statusBaru: 'Disetujui',
    catatan: 'Disetujui. Surat dokter valid.',
    waktuPerubahan: '2026-10-10 07:45:12',
    adminPemroses: 'Basir, S.Pd. (Kepala Sekolah)',
  },
  {
    idRiwayat: 'RWY-003',
    idPengajuan: 'IZIN-202610-0022',
    statusSebelumnya: '-',
    statusBaru: 'Menunggu Verifikasi',
    catatan: 'Pengajuan izin dibuat oleh orang tua',
    waktuPerubahan: '2026-10-11 06:40:15',
    adminPemroses: 'Sistem (Orang Tua)',
  },
  {
    idRiwayat: 'RWY-004',
    idPengajuan: 'IZIN-202610-0022',
    statusSebelumnya: 'Menunggu Verifikasi',
    statusBaru: 'Sedang Diproses',
    catatan: 'Sedang diverifikasi oleh guru piket',
    waktuPerubahan: '2026-10-11 07:10:00',
    adminPemroses: 'Ratna Dewi, S.Pd. (Guru Piket)',
  },
];

// Helper SHA-256 for browser
export async function hashString(str: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback simple hash for older environments
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
}

// Generate unique ID: IZIN-YYYYMM-XXXX
export function generateIdPengajuan(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `IZIN-${year}${month}-${randomNum}`;
}

// Generate 6-digit PIN token
export function generateVerificationPin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Storage Accessors
export function getStoredPengajuan(): PengajuanIzin[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PENGAJUAN);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PENGAJUAN, JSON.stringify(INITIAL_PENGAJUAN));
      return INITIAL_PENGAJUAN;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PENGAJUAN;
  }
}

export function saveStoredPengajuan(items: PengajuanIzin[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PENGAJUAN, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save pengajuan to localStorage', e);
  }
}

export function getStoredRiwayat(): RiwayatStatus[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RIWAYAT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_RIWAYAT, JSON.stringify(INITIAL_RIWAYAT));
      return INITIAL_RIWAYAT;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RIWAYAT;
  }
}

export function saveStoredRiwayat(items: RiwayatStatus[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RIWAYAT, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save riwayat to localStorage', e);
  }
}

export function getStoredPengaturan(): PengaturanSekolah {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) {
      return DEFAULT_PENGATURAN;
    }
    return { ...DEFAULT_PENGATURAN, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PENGATURAN;
  }
}

export function saveStoredPengaturan(cfg: PengaturanSekolah): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(cfg));
  } catch (e) {
    console.error('Failed to save config to localStorage', e);
  }
}

export function getGasWebAppUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_GAS_URL) || '';
  } catch {
    return '';
  }
}

export function saveGasWebAppUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_GAS_URL, url.trim());
  } catch (e) {
    console.error('Failed to save GAS Web App URL', e);
  }
}

export function getStoredAdminKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_ADMIN_KEY) || 'SIPOS@Admin2026';
  } catch {
    return 'SIPOS@Admin2026';
  }
}

export function saveStoredAdminKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_KEY, key.trim());
  } catch (e) {
    console.error('Failed to save admin key', e);
  }
}

// Check GAS Connection
export async function testGasConnection(url: string): Promise<{ success: boolean; message: string }> {
  if (!url || !url.startsWith('https://script.google.com')) {
    return { success: false, message: 'URL Google Apps Script harus diawali dengan https://script.google.com/macros/s/...' };
  }
  try {
    const targetUrl = `${url}?action=ping`;
    const res = await fetch(targetUrl, { method: 'GET', mode: 'cors' });
    const data = await res.json();
    if (data.success) {
      return { success: true, message: data.message || 'Koneksi ke Google Apps Script berhasil!' };
    }
    return { success: false, message: data.message || 'Koneksi gagal mendapatkan respon valid.' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Gagal menghubungi endpoint: ${errorMsg}. Pastikan Web App dideploy dengan 'Who has access: Anyone'.`
    };
  }
}

// Submit Pengajuan (Hybrid: Local DB + GAS sync)
export async function submitPengajuanIzin(
  data: Omit<PengajuanIzin, 'id' | 'timestamp' | 'status' | 'tokenVerifikasiHash'>
): Promise<{ success: boolean; message: string; data?: PengajuanIzin }> {
  const id = generateIdPengajuan();
  const plainToken = generateVerificationPin();
  const tokenHash = await hashString(plainToken);

  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);

  const newPengajuan: PengajuanIzin = {
    ...data,
    id,
    timestamp,
    status: 'Menunggu Verifikasi',
    catatanAdmin: '',
    tokenVerifikasiHash: tokenHash,
    tokenVerifikasiPlain: plainToken,
  };

  // 1. Save to Local DB immediately
  const existing = getStoredPengajuan();
  const updated = [newPengajuan, ...existing];
  saveStoredPengajuan(updated);

  // 2. Add riwayat
  const riwayatList = getStoredRiwayat();
  const newRiwayat: RiwayatStatus = {
    idRiwayat: `RWY-${Math.random().toString(36).substring(2, 9)}`,
    idPengajuan: id,
    statusSebelumnya: '-',
    statusBaru: 'Menunggu Verifikasi',
    catatan: 'Permohonan izin baru diajukan oleh orang tua/wali',
    waktuPerubahan: timestamp,
    adminPemroses: 'Sistem (Orang Tua)',
  };
  saveStoredRiwayat([newRiwayat, ...riwayatList]);

  // 3. Sync to Google Apps Script if URL configured
  const gasUrl = getGasWebAppUrl();
  let syncMsg = '';
  if (gasUrl) {
    try {
      await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'submitPengajuan',
          data: newPengajuan,
        }),
      });
      syncMsg = ' & tersinkronisasi ke Google Sheets SDN 004 Sebatik Tengah.';
    } catch (e) {
      console.warn('Sync to Google Sheets failed or redirected', e);
      syncMsg = ' (Data tersimpan di antrian lokal & siap disinkronkan ke Sheets).';
    }
  }

  return {
    success: true,
    message: `Permohonan izin berhasil dikirimkan${syncMsg}`,
    data: newPengajuan,
  };
}

// Cek Status Pengajuan (Secure Lookup with ID + PIN Token)
export async function checkStatusPengajuan(
  id: string,
  token: string
): Promise<{ success: boolean; message: string; data?: PengajuanIzin }> {
  const cleanId = id.trim().toUpperCase();
  const cleanToken = token.trim();

  if (!cleanId || !cleanToken) {
    return { success: false, message: 'Nomor Pengajuan dan Kode PIN Verifikasi wajib diisi.' };
  }

  // 1. Check Local DB
  const list = getStoredPengajuan();
  const found = list.find(item => item.id.toUpperCase() === cleanId);

  const inputHash = await hashString(cleanToken);

  if (found) {
    const isTokenValid = 
      found.tokenVerifikasiPlain === cleanToken || 
      found.tokenVerifikasiHash === inputHash ||
      found.tokenVerifikasiHash === cleanToken;

    if (!isTokenValid) {
      return {
        success: false,
        message: 'Kode PIN verifikasi tidak cocok. Mohon periksa kembali bukti pendaftaran yang Anda peroleh.',
      };
    }

    return {
      success: true,
      message: 'Data pengajuan izin berhasil ditemukan.',
      data: found,
    };
  }

  // 2. Fallback check to Google Apps Script if configured
  const gasUrl = getGasWebAppUrl();
  if (gasUrl) {
    try {
      const res = await fetch(`${gasUrl}?action=cekStatus&id=${encodeURIComponent(cleanId)}&token=${encodeURIComponent(cleanToken)}`);
      const gasData = await res.json();
      if (gasData.success && gasData.data) {
        return { success: true, message: 'Data ditemukan dari Google Sheets.', data: gasData.data };
      }
    } catch (e) {
      console.warn('GAS check failed', e);
    }
  }

  return {
    success: false,
    message: `Nomor pengajuan ${cleanId} tidak ditemukan di sistem. Pastikan format nomor benar (contoh: IZIN-202610-0021).`,
  };
}

// Admin: Update Status Pengajuan
export async function updateStatusPengajuan(
  id: string,
  statusBaru: StatusIzin,
  catatanAdmin: string,
  adminNama: string
): Promise<{ success: boolean; message: string }> {
  const list = getStoredPengajuan();
  const idx = list.findIndex(i => i.id === id);

  if (idx === -1) {
    return { success: false, message: 'Pengajuan tidak ditemukan.' };
  }

  const oldStatus = list[idx].status;
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);

  list[idx] = {
    ...list[idx],
    status: statusBaru,
    catatanAdmin: catatanAdmin || list[idx].catatanAdmin,
    waktuKeputusan: timestamp,
    diprosesOleh: adminNama,
  };
  saveStoredPengajuan(list);

  // Record history
  const riwayatList = getStoredRiwayat();
  const newRiwayat: RiwayatStatus = {
    idRiwayat: `RWY-${Math.random().toString(36).substring(2, 9)}`,
    idPengajuan: id,
    statusSebelumnya: oldStatus,
    statusBaru: statusBaru,
    catatan: catatanAdmin || `Status diubah menjadi ${statusBaru}`,
    waktuPerubahan: timestamp,
    adminPemroses: adminNama,
  };
  saveStoredRiwayat([newRiwayat, ...riwayatList]);

  // Sync with GAS
  const gasUrl = getGasWebAppUrl();
  const adminKey = getStoredAdminKey();
  if (gasUrl) {
    try {
      await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateStatus',
          adminToken: adminKey,
          id,
          status: statusBaru,
          catatan: catatanAdmin,
          adminNama,
        }),
      });
    } catch (e) {
      console.warn('GAS update failed or redirected', e);
    }
  }

  return {
    success: true,
    message: `Status permohonan ${id} berhasil diperbarui menjadi ${statusBaru}.`,
  };
}

// Filter pengajuan
export function filterPengajuanList(
  items: PengajuanIzin[],
  filters: FilterPengajuan
): PengajuanIzin[] {
  return items.filter(item => {
    // Search query: match ID, nama siswa, nama orang tua, or NISN
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.namaSiswa.toLowerCase().includes(q) ||
        item.namaOrangTua.toLowerCase().includes(q) ||
        item.nisn.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Kelas
    if (filters.kelas && filters.kelas !== 'Semua') {
      if (item.kelas !== filters.kelas) return false;
    }

    // Status
    if (filters.status && filters.status !== 'Semua') {
      if (item.status !== filters.status) return false;
    }

    // Tanggal
    if (filters.tanggalMulai) {
      if (item.tanggalMulai < filters.tanggalMulai) return false;
    }
    if (filters.tanggalSelesai) {
      if (item.tanggalMulai > filters.tanggalSelesai) return false;
    }

    return true;
  });
}

// Export to CSV formatted for Google Sheets
export function exportToCsv(items: PengajuanIzin[]): void {
  const headers = [
    'ID_Pengajuan',
    'Timestamp',
    'Nama_Siswa',
    'NISN',
    'Kelas',
    'Nama_Orang_Tua',
    'Nomor_WhatsApp',
    'Jenis_Izin',
    'Tanggal_Mulai',
    'Tanggal_Selesai',
    'Jam_Keluar',
    'Alasan',
    'Keterangan',
    'File_Pendukung',
    'Status',
    'Catatan_Admin',
    'Waktu_Keputusan',
    'Diproses_Oleh',
  ];

  const rows = items.map(i => [
    `"${i.id}"`,
    `"${i.timestamp}"`,
    `"${i.namaSiswa.replace(/"/g, '""')}"`,
    `"${i.nisn}"`,
    `"${i.kelas}"`,
    `"${i.namaOrangTua.replace(/"/g, '""')}"`,
    `"${i.nomorWhatsApp}"`,
    `"${i.jenisIzin}"`,
    `"${i.tanggalMulai}"`,
    `"${i.tanggalSelesai}"`,
    `"${i.jamKeluar || '-'}"`,
    `"${(i.alasan || '').replace(/"/g, '""')}"`,
    `"${(i.keterangan || '').replace(/"/g, '""')}"`,
    `"${i.filePendukung?.namaFile || '-'}"`,
    `"${i.status}"`,
    `"${(i.catatanAdmin || '-').replace(/"/g, '""')}"`,
    `"${i.waktuKeputusan || '-'}"`,
    `"${i.diprosesOleh || '-'}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `rekap_izin_sdn004_sebatik_tengah_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
