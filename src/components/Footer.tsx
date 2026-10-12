import React from 'react';
import { SchoolEmblem } from './SchoolEmblem';
import { MapPin, Phone, Mail, ShieldAlert, Award } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'beranda' | 'form' | 'cek' | 'admin' | 'integrasi') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: School Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <SchoolEmblem size={44} />
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight">
                  SIPOS — SDN 004 Sebatik Tengah
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  Sistem Informasi Pengusulan Izin Orang Tua Siswa
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Layanan digital resmi SDN 004 Sebatik Tengah untuk memudahkan orang tua dan wali siswa 
              mengajukan permohonan izin ketidakhadiran siswa secara transparan, tertib administrasi, 
              dan terintegrasi langsung dengan database sekolah.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Desa Sungai Limau, Kecamatan Sebatik Tengah, Kabupaten Nunukan, Kalimantan Utara</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+62 822-5555-0040 (Layanan Informasi Tata Usaha)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>sdn004sebatiktengah@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('beranda')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Beranda & Panduan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('form')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left font-semibold text-white"
                >
                  Formulir Pengusulan Izin
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('cek')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Cek Status & Cetak Bukti
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('admin')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left text-amber-400 font-semibold"
                >
                  Portal Petugas & Admin Sekolah
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Keamanan & Privasi Anak */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Privasi & Keamanan Data
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seluruh data siswa dan orang tua dilindungi dengan sistem verifikasi kode PIN unik. 
              Sistem tidak menyediakan pencarian data siswa secara terbuka untuk mencegah akses oleh pihak yang tidak berhak.
            </p>
            <div className="p-2.5 bg-slate-800/80 rounded border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Pemerintah Kab. Nunukan · Disdikbud</span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} SDN 004 Sebatik Tengah. Semua hak dilindungi.
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span>Zona Waktu: Asia/Makassar (WITA)</span>
            <span aria-hidden="true">·</span>
            <span>Tahun Ajaran 2026/2027</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
