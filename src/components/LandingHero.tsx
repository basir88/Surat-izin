import React, { useState } from 'react';
import { SchoolEmblem } from './SchoolEmblem';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  AlertCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  HeartPulse,
  Users,
  Compass,
  ArrowRight,
  Shield,
  FileSpreadsheet
} from 'lucide-react';

interface LandingHeroProps {
  onGoToForm: () => void;
  onGoToCek: () => void;
  totalPengajuanCount: number;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onGoToForm,
  onGoToCek,
  totalPengajuanCount,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Kapan batas waktu pengajuan izin dilakukan oleh orang tua?',
      a: 'Pengajuan izin sebaiknya dilakukan sebelum jam pelajaran dimulai (sebelum pukul 07.15 WITA) pada hari ketidakhadiran, atau maksimal pada hari yang sama agar guru piket dan wali kelas dapat segera mencatat absensi siswa.',
    },
    {
      q: 'Apakah wajib menyertakan surat dokter jika siswa sakit?',
      a: 'Untuk izin sakit lebih dari 2 hari berturut-turut, orang tua diimbau mengunggah surat keterangan dokter dari Puskesmas terdekat (misal: Puskesmas Aji Kuning atau RS Pratama Sebatik) agar dapat disetujui resmi oleh pihak sekolah.',
    },
    {
      q: 'Bagaimana cara orang tua memantau apakah izin sudah disetujui?',
      a: 'Setelah mengirimkan formulir, Anda akan mendapatkan Nomor Pengajuan unik (misal: IZIN-202610-0021) dan Kode PIN 6-digit. Anda cukup memasukkan nomor tersebut pada menu "Cek Status Pengajuan" kapan saja.',
    },
    {
      q: 'Apakah surat persetujuan izin resmi dapat dicetak?',
      a: 'Ya, apabila izin telah disetujui oleh Kepala Sekolah atau Guru Piket, Anda dapat langsung mengunduh dan mencetak Surat Persetujuan Izin Siswa resmi dalam format PDF ber-kop dinas SDN 004 Sebatik Tengah.',
    },
    {
      q: 'Bagaimana jika anak harus pulang lebih awal saat jam pelajaran berlangsung?',
      a: 'Pilih jenis permohonan "Izin meninggalkan sekolah sebelum jam pulang", cantumkan perkiraan jam keluar, dan pastikan orang tua atau wali terdaftar yang menjemput langsung di sekolah.',
    },
  ];

  const permitTypes = [
    {
      title: 'Izin Sakit',
      subtitle: 'Tidak Masuk Karena Sakit',
      icon: HeartPulse,
      desc: 'Digunakan saat anak sakit demam, flu, atau menjalani perawatan medis di rumah maupun fasilitas kesehatan.',
      badge: 'Lampiran Dokter Opsional',
      color: 'border-blue-200 bg-blue-50/60 text-blue-900',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Keperluan Keluarga',
      subtitle: 'Acara / Urusan Penting Keluarga',
      icon: Users,
      desc: 'Untuk menghadiri acara pernikahan keluarga, kedukaan, atau urusan penting keluarga yang tidak dapat diwakilkan.',
      badge: 'Rombongan / Luar Daerah',
      color: 'border-emerald-200 bg-emerald-50/60 text-emerald-900',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Keperluan Mendesak',
      subtitle: 'Situasi Darurat Mendadak',
      icon: AlertCircle,
      desc: 'Keadaan darurat mendadak seperti bencana alam, musibah keluarga, atau hal genting lainnya yang membutuhkan kehadiran anak.',
      badge: 'Verifikasi Prioritas',
      color: 'border-amber-200 bg-amber-50/60 text-amber-900',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Pulang Lebih Awal',
      subtitle: 'Meninggalkan Sekolah Sebelum Bel',
      icon: Clock,
      desc: 'Untuk anak yang merasa tidak enak badan di sekolah atau memiliki jadwal kontrol medis mendesak di siang hari.',
      badge: 'Wajib Dijemput Wali',
      color: 'border-purple-200 bg-purple-50/60 text-purple-900',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Kegiatan Luar Sekolah',
      subtitle: 'Lomba, Kejuaraan, Pelatihan',
      icon: Compass,
      desc: 'Mengikuti perlombaan, musabaqah tilawatil quran, seleksi olahraga tingkat kecamatan, atau kegiatan pramuka.',
      badge: 'Disertai Surat Tugas/Rekomendasi',
      color: 'border-indigo-200 bg-indigo-50/60 text-indigo-900',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Izin Khusus Lainnya',
      subtitle: 'Kategori Keperluan Tertentu',
      icon: FileText,
      desc: 'Pengajuan izin untuk kondisi spesifik lainnya yang tidak tercantum pada kategori di atas dengan penjelasan rinci.',
      badge: 'Penjelasan Tambahan',
      color: 'border-slate-200 bg-slate-50/80 text-slate-900',
      iconColor: 'text-slate-600',
    },
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F52BA] via-[#0D47A1] to-[#0A2D6C] text-white p-6 sm:p-12 shadow-xl border border-blue-900/40">
        
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          
          {/* School Badge Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-amber-300">
            <SchoolEmblem size={26} />
            <span>SDN 004 Sebatik Tengah · Kab. Nunukan, Kalimantan Utara</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-balance">
            Layanan Pengusulan Izin Siswa
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Ajukan permohonan izin putra-putri Anda secara online, mudah, cepat, dan transparan. 
            Terintegrasi langsung ke administrasi sekolah dan database Google Sheets.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGoToForm}
              className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2.5 text-base cursor-pointer"
            >
              <FileText className="w-5 h-5 text-slate-950" />
              <span>Ajukan Izin Sekarang</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={onGoToCek}
              className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer"
            >
              <Search className="w-5 h-5 text-amber-300" />
              <span>Cek Status Pengajuan</span>
            </button>
          </div>

          {/* Highlights Info Bar */}
          <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Bebas Kertas (Paperless)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Cetak Surat PDF Resmi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Privasi Siswa Terlindungi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span className="tabular-nums font-mono">Tercatat: {totalPengajuanCount} Izin</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Guide Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#0F52BA] uppercase tracking-wider">
            Alur Pelayanan
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Panduan Pengajuan Izin dalam 3 Langkah Mudah
          </h2>
          <p className="text-sm text-slate-600">
            Proses pengajuan izin dirancang sederhana agar mudah digunakan oleh seluruh orang tua siswa dari ponsel pintar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0F52BA] font-extrabold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Isi Formulir Pengajuan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Lengkapi identitas siswa (nama & kelas), jenis permohonan izin, tanggal ketidakhadiran, alasan, dan lampirkan dokumen pendukung bila ada (seperti surat dokter).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-[#0F52BA] font-medium flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Dapat diisi lewat HP kapan saja</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-extrabold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Verifikasi Petugas Sekolah
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Guru piket atau pihak tata usaha akan memvalidasi data permohonan. Kepala Sekolah atau pejabat yang berwenang memberikan persetujuan resmi.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-amber-700 font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Proses cepat saat jam piket sekolah</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Pantau Status & Unduh Surat
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Gunakan Nomor Pengajuan dan Kode PIN Anda untuk mengecek status permohonan. Jika disetujui, Anda dapat langsung mengunduh Surat Persetujuan PDF resmi.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <FileCheck className="w-4 h-4" />
              <span>Surat ber-kop dinas siap cetak</span>
            </div>
          </div>
        </div>
      </section>

      {/* Jenis Izin yang Dapat Diajukan */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#0F52BA] uppercase tracking-wider">
            Klasifikasi Permohonan
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Jenis Izin yang Dapat Diajukan
          </h2>
          <p className="text-sm text-slate-600">
            Silakan pilih kategori izin yang paling sesuai dengan keperluan putra-putri Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {permitTypes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-400 transition-colors shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 ${item.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Opsi {idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {item.badge}
                  </span>
                  <button
                    onClick={onGoToForm}
                    className="text-xs font-bold text-[#0F52BA] hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    Pilih
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Keamanan & Transparansi Administrasi Banner */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-emerald-700/50">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-700/60 text-xs font-semibold text-emerald-200">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Administrasi Resmi Berbasis Cloud</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">
            Data Pengajuan Izin Tersimpan Aman & Terpusat
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Didukung database digital resmi sekolah dengan riwayat audit lengkap. Seluruh data ketidakhadiran tersimpan tertib untuk laporan kehadiran siswa ke Dinas Pendidikan.
          </p>
        </div>

        <button
          onClick={onGoToForm}
          className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-950 font-bold rounded-xl text-xs sm:text-sm whitespace-nowrap shadow-sm cursor-pointer transition-colors"
        >
          Ajukan Izin Sekarang
        </button>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#0F52BA] uppercase tracking-wider">
            Bantuan & Jawaban
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Informasi penting seputar prosedur pengusulan izin di SDN 004 Sebatik Tengah.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#0F52BA] shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* School Contact Card */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <SchoolEmblem size={56} />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              SDN 004 Sebatik Tengah
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Desa Sungai Limau, Kecamatan Sebatik Tengah, Kabupaten Nunukan, Kalimantan Utara
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Jam Pelayanan Kantor: Senin – Jumat 07.15 – 14.00 WITA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onGoToForm}
            className="w-full md:w-auto px-5 py-2.5 bg-[#0F52BA] hover:bg-blue-800 text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
          >
            Mulai Pengajuan
          </button>
          <button
            onClick={onGoToCek}
            className="w-full md:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs cursor-pointer transition-colors"
          >
            Cek Status
          </button>
        </div>
      </section>

    </div>
  );
};
