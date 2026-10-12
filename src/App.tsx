import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingHero } from './components/LandingHero';
import { FormPengajuan } from './components/FormPengajuan';
import { CekStatus } from './components/CekStatus';
import { AdminDashboard } from './components/AdminDashboard';
import { SuratIzinModal } from './components/SuratIzinModal';
import { GasIntegrationModal } from './components/GasIntegrationModal';
import { PengajuanIzin, PengaturanSekolah } from './types';
import { getStoredPengajuan, getStoredPengaturan } from './services/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'beranda' | 'form' | 'cek' | 'admin' | 'integrasi'>('beranda');
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pengaturan, setPengaturan] = useState<PengaturanSekolah>(getStoredPengaturan());
  
  // State for prefilling Cek Status from successful submission
  const [cekPrefill, setCekPrefill] = useState<{ id: string; token: string }>({ id: '', token: '' });

  // State for printing official letter / receipt modal
  const [printingItem, setPrintingItem] = useState<PengajuanIzin | null>(null);

  // Check if admin is currently logged in
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('sipos_active_admin'));
  });

  // Keep total count updated
  useEffect(() => {
    const list = getStoredPengajuan();
    setTotalCount(list.length);
  }, [currentTab]);

  const handleViewStatusAfterSubmit = (id: string, token: string) => {
    setCekPrefill({ id, token });
    setCurrentTab('cek');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintSurat = (item: PengajuanIzin) => {
    setPrintingItem(item);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      
      {/* Top Header Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {currentTab === 'beranda' && (
          <LandingHero
            onGoToForm={() => {
              setCurrentTab('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToCek={() => {
              setCurrentTab('cek');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            totalPengajuanCount={totalCount}
          />
        )}

        {currentTab === 'form' && (
          <FormPengajuan
            onBackToHome={() => {
              setCurrentTab('beranda');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewStatus={handleViewStatusAfterSubmit}
          />
        )}

        {currentTab === 'cek' && (
          <CekStatus
            initialId={cekPrefill.id}
            initialToken={cekPrefill.token}
            onBackToHome={() => {
              setCurrentTab('beranda');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPrintSurat={handlePrintSurat}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            pengaturan={pengaturan}
            onUpdatePengaturan={newCfg => setPengaturan(newCfg)}
            onPrintSurat={handlePrintSurat}
            onOpenIntegrasi={() => setCurrentTab('integrasi')}
          />
        )}

        {/* Integrasi Tab opens exclusively from Admin portal */}
        {currentTab === 'integrasi' && (
          <GasIntegrationModal
            onClose={() => setCurrentTab('admin')}
          />
        )}

      </main>

      {/* PDF / Official Letter Print Preview Modal */}
      {printingItem && (
        <SuratIzinModal
          item={printingItem}
          pengaturan={pengaturan}
          onClose={() => setPrintingItem(null)}
        />
      )}

      {/* Official School Footer */}
      <Footer
        onSelectTab={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
