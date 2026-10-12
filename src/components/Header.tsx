import React from 'react';
import { SchoolEmblem } from './SchoolEmblem';
import { FileText, Search, ShieldCheck, Database, Menu, X, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentTab: 'beranda' | 'form' | 'cek' | 'admin' | 'integrasi';
  onSelectTab: (tab: 'beranda' | 'form' | 'cek' | 'admin' | 'integrasi') => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Single text element wordmark with School Emblem */}
          <button
            onClick={() => {
              onSelectTab('beranda');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left group transition-transform active:scale-98 cursor-pointer"
          >
            <SchoolEmblem size={44} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-[#0F52BA] tracking-tight leading-none group-hover:text-blue-800 transition-colors">
                  SIPOS
                </span>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 leading-none">
                  SDN 004
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium tracking-tight mt-0.5 whitespace-nowrap">
                SDN 004 Sebatik Tengah
              </p>
            </div>
          </button>

          {/* Zone 2: 3 clean single-line text nav links for public */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('beranda')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
                currentTab === 'beranda'
                  ? 'text-[#0F52BA] font-bold border-[#0F52BA]'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:border-slate-300'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => onSelectTab('form')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
                currentTab === 'form'
                  ? 'text-[#0F52BA] font-bold border-[#0F52BA]'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:border-slate-300'
              }`}
            >
              Ajukan Izin
            </button>
            <button
              onClick={() => onSelectTab('cek')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 border-b-2 ${
                currentTab === 'cek'
                  ? 'text-[#0F52BA] font-bold border-[#0F52BA]'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:border-slate-300'
              }`}
            >
              Cek Status
            </button>
          </nav>

          {/* Zone 3: 1 primary action button */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('admin')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                currentTab === 'admin' || isAdminLoggedIn
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                  : 'bg-[#0F52BA] hover:bg-blue-800 text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAdminLoggedIn ? 'Dashboard Sekolah' : 'Portal Petugas'}</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onSelectTab('admin')}
              className="p-2 text-xs font-semibold bg-blue-50 text-[#0F52BA] rounded-lg border border-blue-200"
              aria-label="Portal Petugas"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2 border-t border-slate-200 space-y-1">
            <button
              onClick={() => {
                onSelectTab('beranda');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
                currentTab === 'beranda' ? 'bg-blue-50 text-[#0F52BA] font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#0F52BA]" />
              Beranda
            </button>
            <button
              onClick={() => {
                onSelectTab('form');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
                currentTab === 'form' ? 'bg-blue-50 text-[#0F52BA] font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-[#0F52BA]" />
              Ajukan Izin Siswa
            </button>
            <button
              onClick={() => {
                onSelectTab('cek');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 ${
                currentTab === 'cek' ? 'bg-blue-50 text-[#0F52BA] font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-[#0F52BA]" />
              Cek Status Pengajuan
            </button>
            <button
              onClick={() => {
                onSelectTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-2.5 bg-amber-500 text-slate-950 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {isAdminLoggedIn ? 'Dashboard Petugas Sekolah' : 'Login Portal Petugas'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
