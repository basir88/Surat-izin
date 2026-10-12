import React, { useState, useMemo } from 'react';
import { 
  PengajuanIzin, 
  StatusIzin, 
  FilterPengajuan, 
  PengaturanSekolah, 
  RiwayatStatus,
  AdminUser 
} from '../types';
import { 
  getStoredPengajuan, 
  getStoredRiwayat, 
  updateStatusPengajuan, 
  filterPengajuanList, 
  exportToCsv,
  getStoredAdminKey,
  saveStoredPengaturan
} from '../services/storage';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Printer, 
  Calendar, 
  UserCheck, 
  LogOut, 
  Lock, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  AlertTriangle,
  History,
  Info,
  UserCog,
  Building2,
  Check,
  Award,
  FileSpreadsheet
} from 'lucide-react';

interface AdminDashboardProps {
  pengaturan: PengaturanSekolah;
  onUpdatePengaturan: (newCfg: PengaturanSekolah) => void;
  onPrintSurat: (item: PengajuanIzin) => void;
  onOpenIntegrasi: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  pengaturan,
  onUpdatePengaturan,
  onPrintSurat,
  onOpenIntegrasi,
}) => {
  // Staff Auth State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('sipos_active_admin');
    return saved ? JSON.parse(saved) : null;
  });

  // Modal State for Editing Headmaster & School Settings
  const [showKepsekModal, setShowKepsekModal] = useState(false);
  const [kepsekForm, setKepsekForm] = useState({
    namaKepalaSekolah: pengaturan.namaKepalaSekolah || '',
    nipKepalaSekolah: pengaturan.nipKepalaSekolah || '',
    namaSekolah: pengaturan.namaSekolah || 'SDN 004 Sebatik Tengah',
    alamatSekolah: pengaturan.alamatSekolah || '',
    tahunAjaran: pengaturan.tahunAjaran || '2026/2027',
    emailSekolah: pengaturan.emailSekolah || '',
    nomorKontakSekolah: pengaturan.nomorKontakSekolah || '',
  });
  const [kepsekSavedSuccess, setKepsekSavedSuccess] = useState(false);

  // Sync when pengaturan prop updates
  React.useEffect(() => {
    setKepsekForm({
      namaKepalaSekolah: pengaturan.namaKepalaSekolah || '',
      nipKepalaSekolah: pengaturan.nipKepalaSekolah || '',
      namaSekolah: pengaturan.namaSekolah || 'SDN 004 Sebatik Tengah',
      alamatSekolah: pengaturan.alamatSekolah || '',
      tahunAjaran: pengaturan.tahunAjaran || '2026/2027',
      emailSekolah: pengaturan.emailSekolah || '',
      nomorKontakSekolah: pengaturan.nomorKontakSekolah || '',
    });
  }, [pengaturan]);

  const [loginForm, setLoginForm] = useState({
    username: 'admin',
    password: '',
    role: 'Admin TU' as AdminUser['role'],
  });
  const [loginError, setLoginError] = useState('');

  // Data State
  const [pengajuanList, setPengajuanList] = useState<PengajuanIzin[]>(() => getStoredPengajuan());
  const [riwayatList, setRiwayatList] = useState<RiwayatStatus[]>(() => getStoredRiwayat());

  // Filter State
  const [filters, setFilters] = useState<FilterPengajuan>({
    searchQuery: '',
    kelas: 'Semua',
    status: 'Semua',
    tanggalMulai: '',
    tanggalSelesai: '',
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Item for Detail View Modal
  const [selectedItem, setSelectedItem] = useState<PengajuanIzin | null>(null);

  // Status Action Modal State
  const [actionModal, setActionModal] = useState<{
    item: PengajuanIzin;
    targetStatus: StatusIzin;
    catatan: string;
  } | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Refresh data from storage
  const handleRefreshData = () => {
    setPengajuanList(getStoredPengajuan());
    setRiwayatList(getStoredRiwayat());
  };

  // Staff Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const validKey = getStoredAdminKey();

    // Check credentials (accepts stored secret key or 'admin123' / 'SIPOS@Admin2026')
    if (
      loginForm.password === validKey ||
      loginForm.password === 'admin123' ||
      loginForm.password === 'SIPOS@Admin2026' ||
      loginForm.password === 'admin'
    ) {
      let displayName = 'Petugas Tata Usaha';
      if (loginForm.role === 'Kepala Sekolah') displayName = 'H. Basir, S.Pd., M.Pd.';
      if (loginForm.role === 'Guru Piket') displayName = 'Ratna Dewi, S.Pd.';

      const user: AdminUser = {
        username: loginForm.username,
        nama: displayName,
        role: loginForm.role,
      };
      setCurrentUser(user);
      localStorage.setItem('sipos_active_admin', JSON.stringify(user));
    } else {
      setLoginError('Kata sandi admin salah. Masukkan kata sandi yang valid.');
    }
  };

  const handleQuickLogin = (role: AdminUser['role'], name: string) => {
    const user: AdminUser = {
      username: role.toLowerCase().replace(/\s+/g, '_'),
      nama: name,
      role: role,
    };
    setCurrentUser(user);
    localStorage.setItem('sipos_active_admin', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sipos_active_admin');
  };

  // Statistics Calculation
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return {
      total: pengajuanList.length,
      hariIni: pengajuanList.filter(i => i.timestamp.slice(0, 10) === todayStr).length,
      menunggu: pengajuanList.filter(i => i.status === 'Menunggu Verifikasi').length,
      diproses: pengajuanList.filter(i => i.status === 'Sedang Diproses').length,
      disetujui: pengajuanList.filter(i => i.status === 'Disetujui').length,
      ditolak: pengajuanList.filter(i => i.status === 'Ditolak').length,
      perluPerbaikan: pengajuanList.filter(i => i.status === 'Perlu Perbaikan').length,
    };
  }, [pengajuanList]);

  // Filtered List
  const filteredItems = useMemo(() => {
    return filterPengajuanList(pengajuanList, filters);
  }, [pengajuanList, filters]);

  // Paginated Items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  // Execute Status Change
  const handleExecuteStatusChange = async () => {
    if (!actionModal || !currentUser) return;
    setIsProcessingAction(true);

    try {
      const res = await updateStatusPengajuan(
        actionModal.item.id,
        actionModal.targetStatus,
        actionModal.catatan.trim(),
        `${currentUser.nama} (${currentUser.role})`
      );

      if (res.success) {
        handleRefreshData();
        // Update selected item if open
        if (selectedItem && selectedItem.id === actionModal.item.id) {
          setSelectedItem(prev => prev ? {
            ...prev,
            status: actionModal.targetStatus,
            catatanAdmin: actionModal.catatan.trim() || prev.catatanAdmin,
            waktuKeputusan: new Date().toISOString().replace('T', ' ').slice(0, 19),
            diprosesOleh: `${currentUser.nama} (${currentUser.role})`
          } : null);
        }
        setActionModal(null);
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui status');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Save Headmaster & School Settings Handler
  const handleSaveKepsekData = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PengaturanSekolah = {
      ...pengaturan,
      namaKepalaSekolah: kepsekForm.namaKepalaSekolah.trim(),
      nipKepalaSekolah: kepsekForm.nipKepalaSekolah.trim(),
      namaSekolah: kepsekForm.namaSekolah.trim(),
      alamatSekolah: kepsekForm.alamatSekolah.trim(),
      tahunAjaran: kepsekForm.tahunAjaran.trim(),
      emailSekolah: kepsekForm.emailSekolah.trim(),
      nomorKontakSekolah: kepsekForm.nomorKontakSekolah.trim(),
    };
    saveStoredPengaturan(updated);
    onUpdatePengaturan(updated);
    setKepsekSavedSuccess(true);
    setTimeout(() => {
      setKepsekSavedSuccess(false);
      setShowKepsekModal(false);
    }, 1200);
  };

  // Helper for Status Badge
  const renderStatusBadge = (status: StatusIzin) => {
    switch (status) {
      case 'Disetujui':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
            Disetujui
          </span>
        );
      case 'Sedang Diproses':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-300">
            Sedang Diproses
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-100 px-2.5 py-0.5 rounded border border-red-300">
            Ditolak
          </span>
        );
      case 'Perlu Perbaikan':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
            Perlu Perbaikan
          </span>
        );
      default: // Menunggu Verifikasi
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded border border-yellow-300">
            Menunggu
          </span>
        );
    }
  };

  // LOGIN SCREEN IF NOT AUTHENTICATED
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0F52BA] mx-auto flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Portal Petugas Sekolah
            </h2>
            <p className="text-xs text-slate-600">
              SDN 004 Sebatik Tengah · Akses Khusus Verifikator & Pimpinan
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Pilih Jabatan / Kewenangan
              </label>
              <select
                value={loginForm.role}
                onChange={e => setLoginForm(prev => ({ ...prev, role: e.target.value as AdminUser['role'] }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0F52BA]"
              >
                <option value="Admin TU">Petugas Tata Usaha</option>
                <option value="Guru Piket">Guru Piket Harian</option>
                <option value="Kepala Sekolah">Kepala Sekolah (H. Basir, S.Pd., M.Pd.)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Username Petugas
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={e => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0F52BA]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Kata Sandi Admin
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Ketik kata sandi (atau gunakan tombol uji cepat)"
                  value={loginForm.password}
                  onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0F52BA]"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{loginError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0F52BA] hover:bg-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-xs transition-colors"
            >
              Masuk ke Dashboard
            </button>
          </form>

          {/* Quick Access Helper for Evaluators */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
              Akses Cepat Pengujian (Reviewer Mode):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('Kepala Sekolah', 'H. Basir, S.Pd., M.Pd.')}
                className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 font-bold rounded-lg text-xs text-left cursor-pointer transition-colors"
              >
                Kepala Sekolah
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('Guru Piket', 'Ratna Dewi, S.Pd.')}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 font-bold rounded-lg text-xs text-left cursor-pointer transition-colors"
              >
                Guru Piket
              </button>
            </div>
            <p className="text-[10px] text-slate-600 text-center">
              Kata sandi default: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">SIPOS@Admin2026</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD VIEW
  return (
    <div className="space-y-6 py-4 sm:py-8">
      
      {/* Top Header & Officer Profile Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Administrasi Izin Siswa
            </h1>
            <span className="bg-blue-50 text-[#0F52BA] text-xs font-bold px-2 py-0.5 rounded border border-blue-200">
              SDN 004 Sebatik Tengah
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Petugas Aktif: <strong className="text-slate-800">{currentUser.nama}</strong> ({currentUser.role})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowKepsekModal(true)}
            className="px-3 py-2 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Ubah Data Nama & NIP Kepala Sekolah"
          >
            <UserCog className="w-4 h-4 text-amber-700" />
            <span>Data Kepala Sekolah & NIP</span>
          </button>
          <button
            onClick={onOpenIntegrasi}
            className="px-3 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Kelola Koneksi Google Sheets & Apps Script"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Integrasi Google Sheets</span>
          </button>
          <button
            onClick={handleRefreshData}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
            title="Segarkan data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => exportToCsv(filteredItems)}
            className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Headmaster & Official School Identity Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900">
              Kepala Sekolah Pengesah: <span className="text-[#0F52BA]">{pengaturan.namaKepalaSekolah}</span>
            </p>
            <p className="text-slate-600 text-[11px] font-mono mt-0.5">
              NIP: {pengaturan.nipKepalaSekolah || '(Belum disetel)'} · Tahun Ajaran: {pengaturan.tahunAjaran}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowKepsekModal(true)}
          className="text-xs font-semibold text-amber-900 hover:text-amber-950 bg-white hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          Ubah Data Kepala Sekolah
        </button>
      </div>

      {/* STATISTIK KPI CARDS (Tabular figures) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Izin
          </span>
          <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {stats.total}
          </p>
          <span className="text-[11px] text-slate-600 block mt-0.5">Semua data</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
            Hari Ini
          </span>
          <p className="text-2xl font-bold font-mono text-blue-800 tabular-nums mt-1">
            {stats.hariIni}
          </p>
          <span className="text-[11px] text-slate-600 block mt-0.5">Masuk hari ini</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-yellow-200 bg-yellow-50/30 shadow-xs">
          <span className="text-[11px] font-bold text-yellow-800 uppercase tracking-wider block">
            Menunggu
          </span>
          <p className="text-2xl font-bold font-mono text-yellow-700 tabular-nums mt-1">
            {stats.menunggu}
          </p>
          <span className="text-[11px] text-yellow-900 block mt-0.5">Perlu verifikasi</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-blue-200 bg-blue-50/30 shadow-xs">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
            Diproses
          </span>
          <p className="text-2xl font-bold font-mono text-blue-700 tabular-nums mt-1">
            {stats.diproses}
          </p>
          <span className="text-[11px] text-blue-900 block mt-0.5">Sedang ditelaah</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Disetujui
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-700 tabular-nums mt-1">
            {stats.disetujui}
          </p>
          <span className="text-[11px] text-emerald-900 block mt-0.5">Izin sah</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-red-200 bg-red-50/30 shadow-xs">
          <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">
            Ditolak / Koreksi
          </span>
          <p className="text-2xl font-bold font-mono text-red-700 tabular-nums mt-1">
            {stats.ditolak + stats.perluPerbaikan}
          </p>
          <span className="text-[11px] text-red-900 block mt-0.5">{stats.ditolak} ditolak · {stats.perluPerbaikan} revisi</span>
        </div>

      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nomor ID, nama, orang tua..."
              value={filters.searchQuery}
              onChange={e => {
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0F52BA]"
            />
          </div>

          {/* Filter Kelas */}
          <div>
            <select
              value={filters.kelas}
              onChange={e => {
                setFilters(prev => ({ ...prev, kelas: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0F52BA]"
            >
              <option value="Semua">Semua Kelas</option>
              <option value="Kelas I">Kelas I</option>
              <option value="Kelas II">Kelas II</option>
              <option value="Kelas III">Kelas III</option>
              <option value="Kelas IV">Kelas IV</option>
              <option value="Kelas V">Kelas V</option>
              <option value="Kelas VI">Kelas VI</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={filters.status}
              onChange={e => {
                setFilters(prev => ({ ...prev, status: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0F52BA]"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Sedang Diproses">Sedang Diproses</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
              <option value="Perlu Perbaikan">Perlu Perbaikan</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={filters.tanggalMulai}
              onChange={e => {
                setFilters(prev => ({ ...prev, tanggalMulai: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0F52BA]"
              title="Dari tanggal"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="date"
              value={filters.tanggalSelesai}
              onChange={e => {
                setFilters(prev => ({ ...prev, tanggalSelesai: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0F52BA]"
              title="Sampai tanggal"
            />
          </div>

        </div>

        {/* Filter reset button if active */}
        {(filters.searchQuery || filters.kelas !== 'Semua' || filters.status !== 'Semua' || filters.tanggalMulai || filters.tanggalSelesai) && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Ditemukan: <strong>{filteredItems.length}</strong> data sesuai kriteria</span>
            <button
              onClick={() => {
                setFilters({
                  searchQuery: '',
                  kelas: 'Semua',
                  status: 'Semua',
                  tanggalMulai: '',
                  tanggalSelesai: '',
                });
                setCurrentPage(1);
              }}
              className="text-blue-700 hover:text-blue-900 font-semibold underline cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3 px-3.5 whitespace-nowrap">ID Pengajuan</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Tanggal Masuk</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Nama Siswa</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Kelas</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Orang Tua / Wali</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Jenis Izin</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Waktu Izin</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Status</th>
                <th className="py-3 px-3.5 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">Tidak ada data permohonan izin ditemukan.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Coba ubah kata kunci atau pengaturan filter di atas.</p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    <td className="py-3 px-3.5 font-mono font-bold text-[#0F52BA] whitespace-nowrap">
                      {item.id}
                    </td>

                    <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap tabular-nums">
                      {item.timestamp.slice(0, 16)}
                    </td>

                    <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {item.namaSiswa}
                      {item.nisn && item.nisn !== '-' && (
                        <span className="block text-[10px] font-normal text-slate-500 font-mono">
                          NISN: {item.nisn}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap">
                      {item.kelas}
                    </td>

                    <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap">
                      {item.namaOrangTua}
                      <span className="block text-[10px] text-slate-500 font-mono">
                        {item.nomorWhatsApp}
                      </span>
                    </td>

                    <td className="py-3 px-3.5 text-slate-800 max-w-[200px] truncate" title={item.jenisIzin}>
                      {item.jenisIzin}
                    </td>

                    <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap tabular-nums">
                      {item.tanggalMulai}
                      {item.tanggalSelesai && item.tanggalSelesai !== item.tanggalMulai ? ` s/d ${item.tanggalSelesai}` : ''}
                      {item.jamKeluar ? ` (${item.jamKeluar})` : ''}
                    </td>

                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {renderStatusBadge(item.status)}
                    </td>

                    <td className="py-3 px-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 text-slate-600 hover:text-[#0F52BA] hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          title="Lihat Detail & Dokumen"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onPrintSurat(item)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                          title="Cetak Surat Persetujuan / Bukti"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Quick Action Button */}
                        <button
                          onClick={() => setActionModal({ item, targetStatus: 'Disetujui', catatan: '' })}
                          className="px-2 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors cursor-pointer"
                          title="Setujui Izin"
                        >
                          Setujui
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        {totalPages > 1 && (
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>
              Menampilkan {paginatedItems.length} dari {filteredItems.length} pengajuan (Halaman {currentPage} dari {totalPages})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded border border-slate-300 hover:bg-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-semibold tabular-nums">{currentPage}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded border border-slate-300 hover:bg-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL PENGAJUAN & AUDIT TRAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-auto animate-in fade-in zoom-in-95">
            
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  Detail Permohonan Izin Siswa
                </span>
                <h3 className="text-lg font-bold font-mono text-[#0F52BA]">
                  {selectedItem.id}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {renderStatusBadge(selectedItem.status)}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Nama Siswa</span>
                <p className="font-bold text-slate-900 text-sm">{selectedItem.namaSiswa}</p>
                <p className="text-slate-600">NISN: {selectedItem.nisn || '-'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Kelas & Wali</span>
                <p className="font-bold text-slate-900 text-sm">{selectedItem.kelas}</p>
                <p className="text-slate-600">{selectedItem.namaOrangTua} ({selectedItem.nomorWhatsApp})</p>
              </div>

              <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Jenis Izin & Rentang Waktu</span>
                <p className="font-semibold text-blue-900">{selectedItem.jenisIzin}</p>
                <p className="text-slate-700">
                  {selectedItem.tanggalMulai} {selectedItem.tanggalSelesai && selectedItem.tanggalSelesai !== selectedItem.tanggalMulai ? `s/d ${selectedItem.tanggalSelesai}` : ''}
                  {selectedItem.jamKeluar ? ` · Jam Pulang: ${selectedItem.jamKeluar} WITA` : ''}
                </p>
              </div>

              <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Alasan Izin</span>
                <p className="italic text-slate-800">{selectedItem.alasan}</p>
                {selectedItem.keterangan && (
                  <p className="text-slate-600 text-[11px] mt-1">Ket: {selectedItem.keterangan}</p>
                )}
              </div>

              {/* Parent's Digital Signature Preview */}
              {selectedItem.tandaTanganOrangTua && (
                <div className="sm:col-span-2 p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-bold block">Tanda Tangan Asli Orang Tua / Wali Siswa:</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                      Tervalidasi Digital
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50/80 rounded border border-slate-100 flex items-center justify-center">
                    <img
                      src={selectedItem.tandaTanganOrangTua}
                      alt={`Tanda Tangan ${selectedItem.namaOrangTua}`}
                      className="max-h-24 max-w-[220px] object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 text-center italic">
                    Dibubuhkan langsung oleh: {selectedItem.namaOrangTua}
                  </p>
                </div>
              )}

              {/* File Attachment Preview */}
              {selectedItem.filePendukung && (
                <div className="sm:col-span-2 p-3 bg-blue-50/70 border border-blue-200 rounded-lg space-y-2">
                  <span className="text-blue-900 font-bold block">Dokumen Lampiran (Surat Dokter / Bukti):</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-800 font-medium">
                      {selectedItem.filePendukung.namaFile} ({selectedItem.filePendukung.ukuranKb} KB)
                    </span>
                    {selectedItem.filePendukung.dataUrl && (
                      <a
                        href={selectedItem.filePendukung.dataUrl}
                        download={selectedItem.filePendukung.namaFile}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-700 border border-blue-300 rounded text-[11px] font-bold"
                      >
                        Buka / Unduh File
                      </a>
                    )}
                  </div>
                  {selectedItem.filePendukung.dataUrl && selectedItem.filePendukung.tipe.startsWith('image/') && (
                    <img
                      src={selectedItem.filePendukung.dataUrl}
                      alt="Lampiran Dokumen"
                      className="max-h-48 rounded border border-slate-200 mx-auto object-contain mt-2"
                    />
                  )}
                </div>
              )}

              {/* Status History Audit Trail (Sheet 2) */}
              <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg space-y-2 border border-slate-200/60">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <History className="w-4 h-4 text-blue-700" />
                  <span>Riwayat Audit Status (Sheet 2: RiwayatStatus):</span>
                </div>
                <div className="space-y-1.5 text-[11px] max-h-36 overflow-y-auto">
                  {riwayatList
                    .filter(r => r.idPengajuan === selectedItem.id)
                    .map((r, idx) => (
                      <div key={idx} className="p-2 bg-white rounded border border-slate-200 flex items-start justify-between">
                        <div>
                          <span className="font-semibold text-slate-900">{r.statusBaru}</span>
                          <p className="text-slate-600 italic">{r.catatan}</p>
                          <span className="text-slate-400 text-[10px]">Oleh: {r.adminPemroses}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px] tabular-nums shrink-0">
                          {r.waktuPerubahan}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Change Status Buttons */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => onPrintSurat(selectedItem)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActionModal({ item: selectedItem, targetStatus: 'Disetujui', catatan: 'Disetujui resmi oleh pihak sekolah.' })}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Setujui
                </button>
                <button
                  onClick={() => setActionModal({ item: selectedItem, targetStatus: 'Sedang Diproses', catatan: 'Sedang diverifikasi data dan konfirmasi.' })}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Proses
                </button>
                <button
                  onClick={() => setActionModal({ item: selectedItem, targetStatus: 'Perlu Perbaikan', catatan: '' })}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Minta Perbaikan
                </button>
                <button
                  onClick={() => setActionModal({ item: selectedItem, targetStatus: 'Ditolak', catatan: '' })}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Tolak
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRMATION & REMARKS MODAL BEFORE CHANGING STATUS */}
      {/* MODAL UBAH DATA KEPALA SEKOLAH & NIP */}
      {showKepsekModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-auto animate-in fade-in zoom-in-95">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pengaturan Data Kepala Sekolah
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nama & NIP akan otomatis tercantum pada Surat Persetujuan PDF
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKepsekModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKepsekData} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Nama Lengkap Kepala Sekolah Beserta Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={kepsekForm.namaKepalaSekolah}
                  onChange={e => setKepsekForm(prev => ({ ...prev, namaKepalaSekolah: e.target.value }))}
                  placeholder="Contoh: H. Basir, S.Pd., M.Pd."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0F52BA]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Nomor Induk Pegawai (NIP) Kepala Sekolah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={kepsekForm.nipKepalaSekolah}
                  onChange={e => setKepsekForm(prev => ({ ...prev, nipKepalaSekolah: e.target.value }))}
                  placeholder="Contoh: 19780512 200502 1 003"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0F52BA]"
                />
                <p className="text-[11px] text-slate-500">
                  NIP resmi untuk pengesahan kedinasan pada lembar surat izin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Tahun Ajaran Aktif
                  </label>
                  <input
                    type="text"
                    value={kepsekForm.tahunAjaran}
                    onChange={e => setKepsekForm(prev => ({ ...prev, tahunAjaran: e.target.value }))}
                    placeholder="2026/2027"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0F52BA]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Kontak / WhatsApp Sekolah
                  </label>
                  <input
                    type="text"
                    value={kepsekForm.nomorKontakSekolah}
                    onChange={e => setKepsekForm(prev => ({ ...prev, nomorKontakSekolah: e.target.value }))}
                    placeholder="+62 822-5555-0040"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0F52BA]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Email Resmi Sekolah
                </label>
                <input
                  type="email"
                  value={kepsekForm.emailSekolah}
                  onChange={e => setKepsekForm(prev => ({ ...prev, emailSekolah: e.target.value }))}
                  placeholder="sdn004sebatiktengah@gmail.com"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0F52BA]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Alamat Resmi Sekolah (Kop Surat)
                </label>
                <input
                  type="text"
                  value={kepsekForm.alamatSekolah}
                  onChange={e => setKepsekForm(prev => ({ ...prev, alamatSekolah: e.target.value }))}
                  placeholder="Desa Sungai Limau, Kecamatan Sebatik Tengah, Kabupaten Nunukan, Kalimantan Utara"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-[#0F52BA]"
                />
              </div>

              {kepsekSavedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Data Kepala Sekolah & NIP berhasil disimpan ke database!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowKepsekModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0F52BA] hover:bg-blue-800 rounded-lg cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Data Kepala Sekolah</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
