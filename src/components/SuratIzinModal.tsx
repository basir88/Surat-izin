import React from 'react';
import { PengajuanIzin, PengaturanSekolah } from '../types';
import { SchoolEmblem } from './SchoolEmblem';
import { Printer, Download, X, CheckCircle, Clock } from 'lucide-react';

interface SuratIzinModalProps {
  item: PengajuanIzin;
  pengaturan: PengaturanSekolah;
  onClose: () => void;
}

export const SuratIzinModal: React.FC<SuratIzinModalProps> = ({
  item,
  pengaturan,
  onClose,
}) => {
  const isApproved = item.status === 'Disetujui';

  // Format date to Indonesian prose: 11 Oktober 2026
  const formatIndonesianDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate official letter number if approved
  const nomorSuratResmi = isApproved
    ? `421.2/${item.id.replace('IZIN-', '')}/SDN-004-ST/${new Date().getFullYear()}`
    : `BUKTI-REGISTER/${item.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      
      {/* Outer Container */}
      <div className="bg-white rounded-2xl max-w-3xl w-full my-auto shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Top Actions Toolbar (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isApproved ? 'Surat Persetujuan Izin Resmi' : 'Tanda Terima Pengajuan Izin'}
            </span>
            <span className="text-xs text-slate-400">· Siap Cetak / Simpan PDF</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div 
          id="printable-document" 
          className="p-8 sm:p-12 text-slate-900 bg-white font-serif leading-normal"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          
          {/* KOP SURAT RESMI SEKOLAH */}
          <div className="flex items-center gap-4 border-b-4 border-double border-slate-950 pb-3 mb-6">
            <div className="shrink-0">
              <SchoolEmblem size={74} />
            </div>
            <div className="text-center flex-1 space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 leading-tight">
                PEMERINTAH KABUPATEN NUNUKAN
              </h4>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 leading-tight">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </h4>
              <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-slate-950 leading-tight">
                SD NEGERI 004 SEBATIK TENGAH
              </h3>
              <p className="text-[11px] text-slate-700 italic leading-tight">
                Alamat: {pengaturan.alamatSekolah}
              </p>
              <p className="text-[10px] text-slate-600 leading-tight font-sans">
                Email: {pengaturan.emailSekolah} · Telp/WA: {pengaturan.nomorKontakSekolah}
              </p>
            </div>
          </div>

          {/* JUDUL SURAT */}
          <div className="text-center my-6 space-y-1">
            <h2 className="text-base sm:text-lg font-bold underline tracking-wide uppercase">
              {isApproved ? 'SURAT PERSETUJUAN IZIN SISWA' : 'BUKTI PENGAJUAN PERMOHONAN IZIN SISWA'}
            </h2>
            <p className="text-xs text-slate-700 font-sans">
              Nomor: {nomorSuratResmi}
            </p>
          </div>

          {/* PARAGRAF PEMBUKA */}
          <div className="text-xs sm:text-sm text-justify space-y-4 my-4 leading-relaxed">
            <p>
              Yang bertanda tangan di bawah ini Kepala Sekolah SD Negeri 004 Sebatik Tengah, 
              Kecamatan Sebatik Tengah, Kabupaten Nunukan, dengan ini menerangkan bahwa telah 
              menerima dan memverifikasi permohonan izin dari orang tua/wali siswa atas nama:
            </p>

            {/* TABEL IDENTITAS SISWA */}
            <table className="w-full text-xs sm:text-sm my-3 border-collapse">
              <tbody>
                <tr>
                  <td className="w-40 py-1 font-medium">Nama Lengkap Siswa</td>
                  <td className="w-4 py-1">:</td>
                  <td className="py-1 font-bold">{item.namaSiswa}</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">NIS / NISN</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{item.nisn || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Kelas / Rombel</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{item.kelas}</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Nama Orang Tua / Wali</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{item.namaOrangTua}</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Nomor Kontak (WhatsApp)</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-sans">{item.nomorWhatsApp}</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Jenis Izin</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-semibold">{item.jenisIzin}</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Waktu Ketidakhadiran</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-medium">
                    {formatIndonesianDate(item.tanggalMulai)}
                    {item.tanggalSelesai && item.tanggalSelesai !== item.tanggalMulai
                      ? ` s/d ${formatIndonesianDate(item.tanggalSelesai)}`
                      : ''}
                    {item.jamKeluar ? ` (Pukul ${item.jamKeluar} WITA)` : ''}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-medium align-top">Alasan Permohonan</td>
                  <td className="py-1 align-top">:</td>
                  <td className="py-1 italic">{item.alasan}</td>
                </tr>
              </tbody>
            </table>

            {/* STATUS KEPUTUSAN */}
            <div className={`p-3 my-4 rounded border text-xs sm:text-sm ${
              isApproved 
                ? 'bg-slate-50 border-slate-300' 
                : 'bg-amber-50 border-amber-300'
            }`}>
              <p className="font-bold mb-1">
                {isApproved ? 'Keputusan Sekolah: DISETUJUI' : `Status Saat Ini: ${item.status.toUpperCase()}`}
              </p>
              <p className="text-slate-800">
                {item.catatanAdmin || (isApproved ? 'Permohonan izin telah diverifikasi dan disetujui sesuai dengan tata tertib sekolah.' : 'Permohonan masih dalam proses verifikasi pihak sekolah.')}
              </p>
              {!isApproved && (
                <p className="text-[11px] text-amber-900 mt-1 italic font-sans">
                  * Lembar ini merupakan bukti tanda terima sementara bahwa permohonan telah diajukan ke sistem sekolah.
                </p>
              )}
            </div>

            <p>
              Demikian surat keterangan ini diberikan kepada yang bersangkutan untuk dapat dipergunakan 
              sebagaimana mestinya. Siswa diharapkan tetap menyelesaikan tugas-tugas pembelajaran 
              yang tertinggal selama masa izin berlangsung.
            </p>
          </div>

          {/* RUANG TANDA TANGAN RESMI (DUA SISI: ORANG TUA & KEPALA SEKOLAH) */}
          <div className="mt-8 pt-4 flex flex-row justify-between items-start text-xs sm:text-sm">
            
            {/* Tanda Tangan Pemohon (Orang Tua / Wali) */}
            <div className="text-center w-56 space-y-1">
              <p className="text-transparent select-none">Sungai Limau</p>
              <p className="font-semibold">Orang Tua / Wali Siswa,</p>
              
              <div className="h-20 flex items-center justify-center">
                {item.tandaTanganOrangTua ? (
                  <img
                    src={item.tandaTanganOrangTua}
                    alt="Tanda Tangan Orang Tua"
                    className="max-h-18 max-w-[150px] object-contain"
                  />
                ) : (
                  <span className="text-[10px] text-slate-400 italic font-sans border border-dashed border-slate-300 px-2 py-1 rounded">
                    [Tanda Tangan Terverifikasi Digital]
                  </span>
                )}
              </div>

              <p className="font-bold underline text-slate-950">
                ( {item.namaOrangTua} )
              </p>
              <p className="text-[10px] font-sans text-slate-600">
                Pemohon Izin
              </p>
            </div>

            {/* Tanda Tangan Pengesahan (Kepala Sekolah) */}
            <div className="text-center w-64 space-y-1">
              <p>Sungai Limau, {formatIndonesianDate(item.waktuKeputusan ? item.waktuKeputusan.slice(0, 10) : item.timestamp.slice(0, 10))}</p>
              <p className="font-semibold">Kepala Sekolah,</p>
              
              {/* Ruang TTD fisik / pengesahan */}
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic font-sans border border-dashed border-slate-300 px-3 py-1 rounded">
                  [Ruang Pengesahan / TTD & Stempel Resmi]
                </span>
              </div>

              <p className="font-bold underline text-slate-950">
                {pengaturan.namaKepalaSekolah}
              </p>
              <p className="text-[11px] font-sans text-slate-800">
                NIP. {pengaturan.nipKepalaSekolah}
              </p>
            </div>

          </div>

          {/* FOOTER IDENTITAS DOKUMEN & WATERMARK HASH */}
          <div className="mt-12 pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-sans">
            <div>
              <span>ID Registrasi: {item.id}</span>
              <span className="mx-2">·</span>
              <span>Diajukan: {item.timestamp} WITA</span>
            </div>
            <div>
              <span>SIPOS SDN 004 Sebatik Tengah</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
