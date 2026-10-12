import React, { useState } from 'react';
import { JenisIzin, PengajuanIzin } from '../types';
import { submitPengajuanIzin } from '../services/storage';
import { SignaturePad } from './SignaturePad';
import { 
  FileText, 
  Send, 
  RotateCcw, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Copy, 
  Printer, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Info, 
  FileCheck2,
  File,
  PenTool
} from 'lucide-react';

interface FormPengajuanProps {
  onBackToHome: () => void;
  onViewStatus: (id: string, token: string) => void;
}

export const FormPengajuan: React.FC<FormPengajuanProps> = ({
  onBackToHome,
  onViewStatus,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Form State
  const [formData, setFormData] = useState({
    namaSiswa: '',
    nisn: '',
    kelas: 'Kelas I',
    namaOrangTua: '',
    nomorWhatsApp: '',
    jenisIzin: 'Izin tidak masuk sekolah karena sakit' as JenisIzin,
    jenisIzinLainnya: '',
    tanggalMulai: todayStr,
    tanggalSelesai: todayStr,
    jamKeluar: '',
    alasan: '',
    keterangan: '',
    tandaTangan: '',
    pernyataan: false,
  });

  // File upload state
  const [fileAttachment, setFileAttachment] = useState<{
    namaFile: string;
    tipe: string;
    ukuranKb: number;
    dataUrl?: string;
  } | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // UI dialog states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<PengajuanIzin | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const kelasOptions = [
    'Kelas I',
    'Kelas II',
    'Kelas III',
    'Kelas IV',
    'Kelas V',
    'Kelas VI',
  ];

  const jenisIzinOptions: JenisIzin[] = [
    'Izin tidak masuk sekolah karena sakit',
    'Izin tidak masuk sekolah karena keperluan keluarga',
    'Izin tidak masuk sekolah karena keperluan mendesak',
    'Izin meninggalkan sekolah sebelum jam pulang',
    'Izin mengikuti kegiatan di luar sekolah',
    'Jenis izin lainnya',
  ];

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, file: 'Ukuran file maksimal 3 MB.' }));
      return;
    }

    // Validate type (JPG, PNG, PDF)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, file: 'Hanya file format JPG, PNG, atau PDF yang diperbolehkan.' }));
      return;
    }

    setErrors(prev => ({ ...prev, file: '' }));

    const reader = new FileReader();
    reader.onload = () => {
      setFileAttachment({
        namaFile: file.name,
        tipe: file.type,
        ukuranKb: Math.round(file.size / 1024),
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.namaSiswa.trim()) {
      newErrors.namaSiswa = 'Nama lengkap siswa wajib diisi.';
    } else if (formData.namaSiswa.trim().length < 3) {
      newErrors.namaSiswa = 'Nama siswa minimal 3 karakter.';
    }

    if (!formData.namaOrangTua.trim()) {
      newErrors.namaOrangTua = 'Nama orang tua atau wali siswa wajib diisi.';
    }

    if (!formData.nomorWhatsApp.trim()) {
      newErrors.nomorWhatsApp = 'Nomor WhatsApp aktif wajib diisi.';
    } else {
      const cleanPhone = formData.nomorWhatsApp.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 9 || cleanPhone.length > 15) {
        newErrors.nomorWhatsApp = 'Nomor WhatsApp tidak valid (contoh: 081234567890).';
      }
    }

    if (!formData.tanggalMulai) {
      newErrors.tanggalMulai = 'Tanggal mulai izin wajib ditentukan.';
    }

    if (formData.tanggalSelesai && formData.tanggalMulai) {
      if (formData.tanggalSelesai < formData.tanggalMulai) {
        newErrors.tanggalSelesai = 'Tanggal selesai izin tidak boleh lebih awal dari tanggal mulai izin.';
      }
    }

    if (formData.jenisIzin === 'Izin meninggalkan sekolah sebelum jam pulang' && !formData.jamKeluar) {
      newErrors.jamKeluar = 'Jam meninggalkan sekolah wajib diisi untuk jenis izin ini.';
    }

    if (formData.jenisIzin === 'Jenis izin lainnya' && !formData.jenisIzinLainnya?.trim()) {
      newErrors.jenisIzinLainnya = 'Mohon sebutkan jenis izin yang diajukan.';
    }

    if (!formData.alasan.trim()) {
      newErrors.alasan = 'Alasan permohonan izin wajib diisi secara jelas.';
    } else if (formData.alasan.trim().length < 5) {
      newErrors.alasan = 'Alasan izin terlalu singkat. Mohon jelaskan dengan memadai.';
    }

    if (!formData.tandaTangan) {
      newErrors.tandaTangan = 'Tanda tangan orang tua / wali siswa wajib dibubuhkan sebagai bukti permohonan sah.';
    }

    if (!formData.pernyataan) {
      newErrors.pernyataan = 'Anda wajib menyetujui pernyataan kebenaran data.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open confirmation modal
  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    } else {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  // Execute Submission
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitPengajuanIzin({
        namaSiswa: formData.namaSiswa.trim(),
        nisn: formData.nisn.trim() || '-',
        kelas: formData.kelas,
        namaOrangTua: formData.namaOrangTua.trim(),
        nomorWhatsApp: formData.nomorWhatsApp.trim(),
        jenisIzin: formData.jenisIzin,
        jenisIzinLainnya: formData.jenisIzinLainnya.trim() || undefined,
        tanggalMulai: formData.tanggalMulai,
        tanggalSelesai: formData.tanggalSelesai || formData.tanggalMulai,
        jamKeluar: formData.jamKeluar || undefined,
        alasan: formData.alasan.trim(),
        keterangan: formData.keterangan.trim() || undefined,
        filePendukung: fileAttachment || undefined,
        tandaTanganOrangTua: formData.tandaTangan || undefined,
      });

      if (result.success && result.data) {
        setSubmissionResult(result.data);
        setShowConfirmModal(false);
      } else {
        alert(result.message || 'Gagal mengirimkan permohonan izin. Silakan coba lagi.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan formulir ini?')) {
      setFormData({
        namaSiswa: '',
        nisn: '',
        kelas: 'Kelas I',
        namaOrangTua: '',
        nomorWhatsApp: '',
        jenisIzin: 'Izin tidak masuk sekolah karena sakit',
        jenisIzinLainnya: '',
        tanggalMulai: todayStr,
        tanggalSelesai: todayStr,
        jamKeluar: '',
        alasan: '',
        keterangan: '',
        tandaTangan: '',
        pernyataan: false,
      });
      setFileAttachment(null);
      setErrors({});
    }
  };

  const handleCopyCode = () => {
    if (submissionResult) {
      navigator.clipboard.writeText(
        `Nomor Pengajuan: ${submissionResult.id}\nKode PIN: ${submissionResult.tokenVerifikasiPlain}\nNama Siswa: ${submissionResult.namaSiswa} (${submissionResult.kelas})\nSDN 004 Sebatik Tengah`
      );
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-8">
      
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0F52BA] transition-colors cursor-pointer mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Formulir Pengusulan Izin Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Lengkapi data di bawah ini untuk mengajukan izin ketidakhadiran siswa di SDN 004 Sebatik Tengah.
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleOpenConfirm} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
        
        {/* BAGIAN A: DATA SISWA */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-5 h-5 text-[#0F52BA]" />
            <h2 className="text-base font-bold text-slate-900">
              A. Data Siswa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Nama Siswa */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Nama Lengkap Siswa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaSiswa"
                value={formData.namaSiswa}
                onChange={handleChange}
                placeholder="Contoh: Muhammad Ridho Pratama"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none transition-colors ${
                  errors.namaSiswa 
                    ? 'border-red-500 bg-red-50/30 focus:border-red-500' 
                    : 'border-slate-300 focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA]'
                }`}
              />
              {errors.namaSiswa && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.namaSiswa}
                </p>
              )}
            </div>

            {/* NISN */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                NIS / NISN Siswa <span className="text-slate-400 font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                name="nisn"
                value={formData.nisn}
                onChange={handleChange}
                placeholder="Contoh: 0129482910"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA] transition-colors"
              />
              <p className="text-[11px] text-slate-600">Dapat dilihat pada rapor atau kartu pelajar siswa</p>
            </div>

            {/* Kelas */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Kelas <span className="text-red-500">*</span>
              </label>
              <select
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA] transition-colors"
              >
                {kelasOptions.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* Nama Orang Tua */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Nama Orang Tua / Wali <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaOrangTua"
                value={formData.namaOrangTua}
                onChange={handleChange}
                placeholder="Contoh: H. Suryadi"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none transition-colors ${
                  errors.namaOrangTua 
                    ? 'border-red-500 bg-red-50/30 focus:border-red-500' 
                    : 'border-slate-300 focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA]'
                }`}
              />
              {errors.namaOrangTua && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.namaOrangTua}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Nomor WhatsApp Orang Tua <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="nomorWhatsApp"
                  value={formData.nomorWhatsApp}
                  onChange={handleChange}
                  placeholder="081234567890"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none transition-colors ${
                    errors.nomorWhatsApp 
                      ? 'border-red-500 bg-red-50/30 focus:border-red-500' 
                      : 'border-slate-300 focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA]'
                  }`}
                />
              </div>
              {errors.nomorWhatsApp ? (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.nomorWhatsApp}
                </p>
              ) : (
                <p className="text-[11px] text-slate-600">Digunakan pihak sekolah jika konfirmasi mendesak diperlukan</p>
              )}
            </div>

          </div>
        </div>

        {/* BAGIAN B: DATA PERMOHONAN IZIN */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-[#0F52BA]" />
            <h2 className="text-base font-bold text-slate-900">
              B. Data Permohonan Izin
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Jenis Izin */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Jenis Izin <span className="text-red-500">*</span>
              </label>
              <select
                name="jenisIzin"
                value={formData.jenisIzin}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA] transition-colors"
              >
                {jenisIzinOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Jika jenis izin lainnya */}
            {formData.jenisIzin === 'Jenis izin lainnya' && (
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Sebutkan Jenis Izin <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jenisIzinLainnya"
                  value={formData.jenisIzinLainnya}
                  onChange={handleChange}
                  placeholder="Tuliskan jenis permohonan izin Anda"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none transition-colors ${
                    errors.jenisIzinLainnya ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-[#0F52BA]'
                  }`}
                />
                {errors.jenisIzinLainnya && (
                  <p className="text-xs text-red-600">{errors.jenisIzinLainnya}</p>
                )}
              </div>
            )}

            {/* Tanggal Mulai */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Tanggal Mulai Izin <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggalMulai"
                value={formData.tanggalMulai}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none transition-colors ${
                  errors.tanggalMulai ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-[#0F52BA]'
                }`}
              />
              {errors.tanggalMulai && (
                <p className="text-xs text-red-600">{errors.tanggalMulai}</p>
              )}
            </div>

            {/* Tanggal Selesai */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Tanggal Selesai Izin <span className="text-slate-400 font-normal">(jika lebih dari 1 hari)</span>
              </label>
              <input
                type="date"
                name="tanggalSelesai"
                value={formData.tanggalSelesai}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none transition-colors ${
                  errors.tanggalSelesai ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-[#0F52BA]'
                }`}
              />
              {errors.tanggalSelesai && (
                <p className="text-xs text-red-600">{errors.tanggalSelesai}</p>
              )}
            </div>

            {/* Jam Meninggalkan Sekolah (khusus opsi pulang lebih awal) */}
            {formData.jenisIzin === 'Izin meninggalkan sekolah sebelum jam pulang' && (
              <div className="sm:col-span-2 space-y-1.5 bg-amber-50 p-3.5 rounded-xl border border-amber-200">
                <label className="block text-xs font-bold text-amber-900">
                  Jam Meninggalkan Sekolah <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="jamKeluar"
                  value={formData.jamKeluar}
                  onChange={handleChange}
                  className={`w-full sm:w-48 px-3.5 py-2 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none transition-colors ${
                    errors.jamKeluar ? 'border-red-500 bg-red-50' : 'border-amber-300 focus:border-amber-500'
                  }`}
                />
                <p className="text-[11px] text-amber-800">
                  Perhatian: Siswa hanya diizinkan keluar jika dijemput langsung oleh orang tua/wali tercatat.
                </p>
                {errors.jamKeluar && (
                  <p className="text-xs text-red-600">{errors.jamKeluar}</p>
                )}
              </div>
            )}

            {/* Alasan Izin */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Alasan Izin <span className="text-red-500">*</span>
              </label>
              <textarea
                name="alasan"
                rows={3}
                value={formData.alasan}
                onChange={handleChange}
                placeholder="Jelaskan secara singkat alasan permohonan izin tidak masuk atau keperluan siswa..."
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none transition-colors ${
                  errors.alasan ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA]'
                }`}
              />
              {errors.alasan && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.alasan}
                </p>
              )}
            </div>

            {/* Keterangan Tambahan */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Keterangan Tambahan <span className="text-slate-400 font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                placeholder="Catatan tambahan untuk guru atau pihak sekolah jika ada..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#0F52BA] transition-colors"
              />
            </div>

            {/* Unggah Dokumen Pendukung */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Unggah Dokumen Pendukung <span className="text-slate-400 font-normal">(opsional, misal: Surat Dokter / Foto Bukti)</span>
              </label>

              {!fileAttachment ? (
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center transition-colors">
                  <input
                    type="file"
                    id="doc-upload"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="doc-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    <Upload className="w-6 h-6 text-[#0F52BA]" />
                    <span className="text-xs font-bold text-slate-800">
                      Pilih file atau foto surat keterangan dokter
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Format: JPG, PNG, atau PDF (Maksimal 3 MB)
                    </span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <File className="w-5 h-5 text-[#0F52BA] shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {fileAttachment.namaFile}
                      </p>
                      <p className="text-[10px] text-slate-500 tabular-nums">
                        {fileAttachment.ukuranKb} KB · {fileAttachment.tipe}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFileAttachment(null)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                    title="Hapus lampiran"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {errors.file && (
                <p className="text-xs text-red-600">{errors.file}</p>
              )}
            </div>

          </div>
        </div>

        {/* BAGIAN C: TANDA TANGAN ORANG TUA / WALI */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-[#0F52BA]" />
              <h2 className="text-base font-bold text-slate-900">
                C. Tanda Tangan Orang Tua / Wali Siswa <span className="text-red-500">*</span>
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">
              Pengesahan Digital
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Bubuhkan tanda tangan asli Anda langsung pada kotak di bawah ini menggunakan jari (pada layar sentuh) atau mouse.
          </p>

          <SignaturePad
            value={formData.tandaTangan}
            parentName={formData.namaOrangTua || 'Orang Tua / Wali Siswa'}
            onChange={(signUrl) => {
              setFormData(prev => ({ ...prev, tandaTangan: signUrl }));
              if (errors.tandaTangan) {
                setErrors(prev => ({ ...prev, tandaTangan: '' }));
              }
            }}
            onClear={() => {
              setFormData(prev => ({ ...prev, tandaTangan: '' }));
            }}
            error={errors.tandaTangan}
          />
        </div>

        {/* BAGIAN D: PERNYATAAN KEBENARAN DATA */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              name="pernyataan"
              checked={formData.pernyataan}
              onChange={e => {
                setFormData(prev => ({ ...prev, pernyataan: e.target.checked }));
                if (errors.pernyataan) setErrors(prev => ({ ...prev, pernyataan: '' }));
              }}
              className="mt-0.5 w-4 h-4 rounded text-[#0F52BA] border-slate-300 focus:ring-[#0F52BA]"
            />
            <span className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
              Saya menyatakan bahwa informasi yang saya isi adalah benar dan dapat dipertanggungjawabkan.
            </span>
          </label>
          {errors.pernyataan && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {errors.pernyataan}
            </p>
          )}
        </div>

        {/* BAGIAN E: TOMBOL AKSI */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Formulir</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onBackToHome}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0F52BA] hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Pengajuan</span>
            </button>
          </div>
        </div>

      </form>

      {/* DIALOG KONFIRMASI SEBELUM KIRIM */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 text-[#0F52BA]">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Konfirmasi Pengajuan Izin
                  </h3>
                  <p className="text-xs text-slate-500">
                    Periksa kembali ringkasan permohonan sebelum dikirim
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs text-slate-700 border border-slate-200/60 divide-y divide-slate-100">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Nama Siswa</span>
                <span className="font-bold text-slate-900">{formData.namaSiswa}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Kelas</span>
                <span className="font-bold text-slate-900">{formData.kelas}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Orang Tua / Wali</span>
                <span className="font-semibold text-slate-800">{formData.namaOrangTua}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Nomor WhatsApp</span>
                <span className="font-mono text-slate-800">{formData.nomorWhatsApp}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Jenis Izin</span>
                <span className="font-semibold text-blue-700 text-right max-w-[65%]">
                  {formData.jenisIzin === 'Jenis izin lainnya' ? formData.jenisIzinLainnya : formData.jenisIzin}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Rentang Waktu</span>
                <span className="font-medium text-slate-900">
                  {formData.tanggalMulai} {formData.tanggalSelesai && formData.tanggalSelesai !== formData.tanggalMulai ? `s/d ${formData.tanggalSelesai}` : ''}
                </span>
              </div>
              {formData.jamKeluar && (
                <div className="flex justify-between py-1 text-amber-700 font-semibold">
                  <span>Jam Keluar Sekolah</span>
                  <span>{formData.jamKeluar} WITA</span>
                </div>
              )}
              <div className="py-1">
                <span className="text-slate-500 block mb-0.5">Alasan:</span>
                <span className="italic text-slate-800">{formData.alasan}</span>
              </div>
              {formData.tandaTangan && (
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500">Tanda Tangan Orang Tua:</span>
                  <div className="bg-white px-3 py-1 rounded border border-slate-200">
                    <img
                      src={formData.tandaTangan}
                      alt="Tanda Tangan Orang Tua"
                      className="h-10 max-w-[130px] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Ubah Data
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmSubmit}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0F52BA] hover:bg-blue-800 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Menyimpan ke Sheets...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ya, Kirim Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG BERHASIL: NOMOR PENGAJUAN & PIN VERIFIKASI */}
      {submissionResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-200 space-y-6 animate-in fade-in zoom-in-95 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                Pengajuan Izin Berhasil Dikirim!
              </h3>
              <p className="text-xs text-slate-600">
                Data telah tersimpan di sistem SDN 004 Sebatik Tengah dan sedang menunggu verifikasi petugas.
              </p>
            </div>

            {/* Nomor Pengajuan & PIN Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-left">
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Nomor Pengajuan Unik:
                </span>
                <span className="text-lg font-mono font-extrabold text-[#0F52BA] select-all">
                  {submissionResult.id}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                    Kode PIN Verifikasi:
                  </span>
                  <span className="text-2xl font-mono font-extrabold text-amber-600 tracking-widest select-all">
                    {submissionResult.tokenVerifikasiPlain}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{copiedText ? 'Tersalin!' : 'Salin Bukti'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 bg-amber-50 p-2 rounded text-amber-900 border border-amber-200/60">
                <Info className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                Simpan nomor pengajuan dan 6 digit PIN di atas untuk memantau status atau mencetak surat persetujuan izin.
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (submissionResult.tokenVerifikasiPlain) {
                    onViewStatus(submissionResult.id, submissionResult.tokenVerifikasiPlain);
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0F52BA] hover:bg-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-xs"
              >
                Pantau Status Pengajuan
              </button>
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
