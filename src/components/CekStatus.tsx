import React, { useState, useEffect } from 'react';
import { PengajuanIzin, StatusIzin } from '../types';
import { checkStatusPengajuan } from '../services/storage';
import { 
  Search, 
  Key, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Printer, 
  ArrowLeft, 
  Calendar, 
  User, 
  Building, 
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';

interface CekStatusProps {
  initialId?: string;
  initialToken?: string;
  onBackToHome: () => void;
  onPrintSurat: (item: PengajuanIzin) => void;
}

export const CekStatus: React.FC<CekStatusProps> = ({
  initialId = '',
  initialToken = '',
  onBackToHome,
  onPrintSurat,
}) => {
  const [idPengajuan, setIdPengajuan] = useState(initialId);
  const [tokenVerifikasi, setTokenVerifikasi] = useState(initialToken);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<PengajuanIzin | null>(null);

  // If initial props provided, automatically perform lookup
  useEffect(() => {
    if (initialId && initialToken) {
      handleSearch(initialId, initialToken);
    }
  }, [initialId, initialToken]);

  const handleSearch = async (targetId: string, targetToken: string) => {
    setErrorMessage('');
    if (!targetId.trim()) {
      setErrorMessage('Nomor Pengajuan wajib diisi.');
      return;
    }
    if (!targetToken.trim()) {
      setErrorMessage('Kode PIN Verifikasi wajib diisi untuk keamanan data siswa.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await checkStatusPengajuan(targetId, targetToken);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setResult(null);
        setErrorMessage(res.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi kesalahan saat memeriksa database.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(idPengajuan, tokenVerifikasi);
  };

  // Helper for Status Badge styling
  const renderStatusBadge = (status: StatusIzin) => {
    switch (status) {
      case 'Disetujui':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Disetujui</span>
          </div>
        );
      case 'Sedang Diproses':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold border border-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Sedang Diproses</span>
          </div>
        );
      case 'Ditolak':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-100 text-red-800 text-xs font-bold border border-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Ditolak</span>
          </div>
        );
      case 'Perlu Perbaikan':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Perlu Perbaikan</span>
          </div>
        );
      default: // Menunggu Verifikasi
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-yellow-100 text-yellow-800 text-xs font-bold border border-yellow-300">
            <Clock className="w-3.5 h-3.5 text-yellow-600" />
            <span>Menunggu Verifikasi</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-8">
      
      {/* Header bar */}
      <div className="space-y-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0F52BA] transition-colors cursor-pointer mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cek Status Pengajuan Izin
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Masukkan Nomor Pengajuan dan Kode PIN 6-digit yang Anda peroleh saat mendaftar.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Nomor Pengajuan Unik <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={idPengajuan}
                  onChange={e => setIdPengajuan(e.target.value)}
                  placeholder="Contoh: IZIN-202610-0021"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA] uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Kode PIN Verifikasi (6-digit) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  value={tokenVerifikasi}
                  onChange={e => setTokenVerifikasi(e.target.value)}
                  placeholder="Contoh: 123456"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono tracking-widest text-slate-900 focus:outline-none focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA]"
                />
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Akses privat terlindungi</span>
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#0F52BA] hover:bg-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-xs disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Memeriksa...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Periksa Status</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Quick Fill Helper for Reviewers */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>Contoh Pengajuan Tersedia untuk Uji Coba:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIdPengajuan('IZIN-202610-0021');
                setTokenVerifikasi('123456');
                handleSearch('IZIN-202610-0021', '123456');
              }}
              className="underline text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              Contoh 1 (Disetujui)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setIdPengajuan('IZIN-202610-0023');
                setTokenVerifikasi('889900');
                handleSearch('IZIN-202610-0023', '889900');
              }}
              className="underline text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              Contoh 2 (Menunggu)
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Pencarian Tidak Ditemukan</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Result Display Card */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Nomor Pengajuan
              </span>
              <h2 className="text-xl font-extrabold font-mono text-[#0F52BA]">
                {result.id}
              </h2>
            </div>
            <div>
              {renderStatusBadge(result.status)}
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-slate-500 block">Nama Lengkap Siswa</span>
              <p className="text-sm font-bold text-slate-900">{result.namaSiswa}</p>
              <p className="text-slate-600">NISN: {result.nisn || '-'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-slate-500 block">Kelas & Rombel</span>
              <p className="text-sm font-bold text-slate-900">{result.kelas}</p>
              <p className="text-slate-600">Orang Tua: {result.namaOrangTua}</p>
            </div>

            <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-slate-500 block">Jenis Permohonan Izin</span>
              <p className="text-sm font-bold text-blue-900">{result.jenisIzin}</p>
              <p className="text-slate-700 font-medium">
                Rentang: {result.tanggalMulai} {result.tanggalSelesai && result.tanggalSelesai !== result.tanggalMulai ? `s/d ${result.tanggalSelesai}` : ''}
                {result.jamKeluar ? ` (Pukul ${result.jamKeluar} WITA)` : ''}
              </p>
            </div>

            <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-slate-500 block">Alasan Pengajuan</span>
              <p className="text-slate-800 italic">{result.alasan}</p>
              {result.keterangan && (
                <p className="text-slate-600 text-[11px] mt-1">Ket: {result.keterangan}</p>
              )}
              {result.tandaTanganOrangTua && (
                <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Tanda Tangan Pengesahan Orang Tua:</span>
                  <img
                    src={result.tandaTanganOrangTua}
                    alt="Tanda Tangan"
                    className="h-9 max-w-[120px] object-contain bg-white px-2 py-0.5 rounded border border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Catatan Admin & Keputusan */}
            <div className="sm:col-span-2 p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-700" />
                  Keputusan & Catatan Sekolah:
                </span>
                {result.waktuKeputusan && (
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    Diputuskan: {result.waktuKeputusan}
                  </span>
                )}
              </div>
              <p className="text-slate-800">
                {result.catatanAdmin ? result.catatanAdmin : 'Permohonan sedang dalam antrian pemeriksaan oleh petugas tata usaha / guru piket.'}
              </p>
              {result.diprosesOleh && (
                <p className="text-[11px] text-slate-600 font-medium">
                  Pejabat Pemeriksa: {result.diprosesOleh}
                </p>
              )}
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              Pengajuan diajukan pada: {result.timestamp}
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onPrintSurat(result)}
                className={`w-full sm:w-auto px-5 py-2.5 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors ${
                  result.status === 'Disetujui'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>
                  {result.status === 'Disetujui'
                    ? 'Cetak Surat Persetujuan Resmi (PDF)'
                    : 'Cetak Bukti Tanda Terima Pengajuan'}
                </span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
