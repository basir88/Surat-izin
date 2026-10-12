import React, { useState } from 'react';
import { GAS_CODE_GS, APPSSCRIPT_JSON, GAS_INDEX_HTML } from '../services/gasBackendCode';
import { getGasWebAppUrl, saveGasWebAppUrl, testGasConnection } from '../services/storage';
import { 
  FileSpreadsheet, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Server, 
  ShieldCheck, 
  HelpCircle, 
  Layers, 
  AlertCircle,
  X,
  Play,
  Terminal,
  FileCheck,
  LayoutTemplate
} from 'lucide-react';

interface GasIntegrationModalProps {
  onClose: () => void;
}

export const GasIntegrationModal: React.FC<GasIntegrationModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'koneksi' | 'codegs' | 'indexhtml' | 'panduan' | 'struktur' | 'solusi'>('solusi');
  const [gasUrl, setGasUrl] = useState(() => getGasWebAppUrl());
  const [testResult, setTestResult] = useState<{ loading: boolean; message: string; success?: boolean } | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSaveAndTestUrl = async () => {
    saveGasWebAppUrl(gasUrl);
    if (!gasUrl.trim()) {
      setTestResult({ loading: false, message: 'URL berhasil dikosongkan. Aplikasi beralih ke penyimpanan lokal browser.', success: true });
      return;
    }

    setTestResult({ loading: true, message: 'Menghubungi endpoint Google Apps Script...' });
    const res = await testGasConnection(gasUrl);
    setTestResult({ loading: false, message: res.message, success: res.success });
  };

  const sheet1Columns = [
    'ID_Pengajuan', 'Timestamp', 'Nama_Siswa', 'NISN', 'Kelas',
    'Nama_Orang_Tua', 'Nomor_WhatsApp', 'Jenis_Izin', 'Tanggal_Mulai', 'Tanggal_Selesai',
    'Jam_Keluar', 'Alasan', 'Keterangan', 'File_Pendukung', 'Status',
    'Catatan_Admin', 'Waktu_Keputusan', 'Diproses_Oleh', 'Token_Verifikasi_Hash'
  ];

  const sheet2Columns = [
    'ID_Riwayat', 'ID_Pengajuan', 'Status_Sebelumnya', 'Status_Baru',
    'Catatan', 'Waktu_Perubahan', 'Admin_Pemroses'
  ];

  const sheet3Columns = [
    'Nama_Sekolah', 'Alamat_Sekolah', 'Nama_Kepala_Sekolah', 'NIP_Kepala_Sekolah',
    'Email_Sekolah', 'Nomor_Kontak_Sekolah', 'Tahun_Ajaran', 'Zona_Waktu'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-emerald-300">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Integrasi Google Sheets & Apps Script (GAS)
              </h2>
              <p className="text-xs text-emerald-200">
                SDN 004 Sebatik Tengah · Backend Serverless Resmi Berbasis Akun Google Sekolah
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto text-xs font-semibold gap-2">
          <button
            onClick={() => setActiveTab('solusi')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'solusi'
                ? 'border-red-600 text-red-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Solusi: Fitur Tidak Berfungsi</span>
            <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 text-[10px] font-bold">Solusi Cepat</span>
          </button>
          <button
            onClick={() => setActiveTab('indexhtml')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'indexhtml'
                ? 'border-emerald-600 text-emerald-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
            <span>Kode Index.html (Tampilan)</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Wajib</span>
          </button>
          <button
            onClick={() => setActiveTab('codegs')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'codegs'
                ? 'border-emerald-600 text-emerald-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kode Code.gs (Backend)</span>
          </button>
          <button
            onClick={() => setActiveTab('koneksi')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'koneksi'
                ? 'border-emerald-600 text-emerald-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Koneksi Web App URL
          </button>
          <button
            onClick={() => setActiveTab('panduan')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'panduan'
                ? 'border-emerald-600 text-emerald-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Panduan Lengkap Setup (10 Menit)
          </button>
          <button
            onClick={() => setActiveTab('struktur')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'struktur'
                ? 'border-emerald-600 text-emerald-900 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Struktur Spreadsheet (3 Sheet)
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700">
          
          {/* TAB 1: KONEKSI WEB APP URL */}
          {activeTab === 'koneksi' && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-700" />
                  Hubungkan Aplikasi ke Google Apps Script Web App
                </h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Setelah Anda membuat script di Google Apps Script dan melakukan Deploy sebagai Web App, 
                  salin URL Web App (berakhiran <code>/exec</code>) ke dalam kotak di bawah ini. Aplikasi akan 
                  langsung menulis dan membaca data dari Google Sheets SDN 004 Sebatik Tengah secara realtime.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  URL Google Apps Script Web App Endpoint:
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    value={gasUrl}
                    onChange={e => setGasUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    onClick={handleSaveAndTestUrl}
                    disabled={testResult?.loading}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs whitespace-nowrap cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    {testResult?.loading ? (
                      <>
                        <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                        <span>Menguji...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Simpan & Tes Koneksi</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Jika kosong, aplikasi akan beroperasi dalam <strong>Mode Simpan Cerdas (Local Database)</strong> dengan data contoh realistis SDN 004 Sebatik Tengah yang tetap dapat diekspor ke CSV dan dicetak PDF.
                </p>
              </div>

              {/* Test Connection Output Alert */}
              {testResult && (
                <div className={`p-4 rounded-xl border text-xs flex items-start gap-2.5 ${
                  testResult.success 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}>
                  {testResult.success ? <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-bold">{testResult.success ? 'Koneksi Berhasil!' : 'Pemberitahuan Respon'}</p>
                    <p className="mt-0.5">{testResult.message}</p>
                  </div>
                </div>
              )}

              {/* Status Mode Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">
                  Status Operasional Saat Ini:
                </span>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${gasUrl ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                  <span className="font-semibold text-slate-900">
                    {gasUrl ? 'Mode Google Sheets Terhubung' : 'Mode Offline / Local DB Siap Sinkronisasi'}
                  </span>
                </div>
                <p className="text-slate-600">
                  {gasUrl 
                    ? 'Setiap permohonan baru dan perubahan status oleh admin akan disinkronkan ke spreadsheet Google.' 
                    : 'Data saat ini tersimpan di memori browser yang aman dan dapat diekspor sewaktu-waktu ke spreadsheet via tombol Ekspor CSV.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PANDUAN LENGKAP SETUP */}
          {activeTab === 'panduan' && (
            <div className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                  Langkah 1: Buat Spreadsheet Baru di Google Drive
                </h3>
                <div className="pl-8 space-y-2 text-xs text-slate-600">
                  <p>1. Buka <strong>Google Drive</strong> akun sekolah SDN 004 Sebatik Tengah.</p>
                  <p>2. Buat spreadsheet baru bernama: <code>SIPOS - Database Izin Siswa SDN 004 Sebatik Tengah</code>.</p>
                  <p>3. Salin <strong>ID Spreadsheet</strong> dari URL browser (bagian acak di antara <code>/d/</code> dan <code>/edit</code>).</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                  Langkah 2: Buat Project Google Apps Script
                </h3>
                <div className="pl-8 space-y-2 text-xs text-slate-600">
                  <p>1. Pada spreadsheet tersebut, klik menu <strong>Extensions (Ekstensi)</strong> &gt; <strong>Apps Script</strong>.</p>
                  <p>2. Hapus kode default di <code>Code.gs</code>, lalu tempelkan seluruh kode dari tab <strong>Kode Backend Code.gs</strong> di atas.</p>
                  <p>3. Simpan project dengan menekan ikon Disket atau Ctrl+S.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
                  Langkah 3: Atur Script Properties (ID Spreadsheet & Kunci Rahasia)
                </h3>
                <div className="pl-8 space-y-2 text-xs text-slate-600">
                  <p>1. Di editor Apps Script sebelah kiri, klik ikon <strong>Project Settings (Roda Gigi)</strong>.</p>
                  <p>2. Gulir ke bawah ke bagian <strong>Script Properties</strong>, klik <strong>Add script property</strong>:</p>
                  <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-slate-800">
                    <li>Property: <code>SPREADSHEET_ID</code> &rarr; Value: [ID Spreadsheet dari langkah 1]</li>
                    <li>Property: <code>ADMIN_SECRET_KEY</code> &rarr; Value: <code>SIPOS@Admin2026</code> (atau kata sandi admin pilihan Anda)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
                  Langkah 4: Deploy sebagai Web App
                </h3>
                <div className="pl-8 space-y-2 text-xs text-slate-600">
                  <p>1. Klik tombol biru <strong>Deploy</strong> di pojok kanan atas &gt; pilih <strong>New deployment</strong>.</p>
                  <p>2. Klik ikon roda gigi di sebelah "Select type" &gt; pilih <strong>Web app</strong>.</p>
                  <p>3. Konfigurasi:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-800">
                    <li><strong>Description:</strong> SIPOS SDN 004 v1</li>
                    <li><strong>Execute as:</strong> Me (email Anda / akun Google sekolah)</li>
                    <li><strong>Who has access:</strong> <span className="text-red-700 font-bold">Anyone (Siapa saja)</span> *wajib agar formulir orang tua dapat mengirim data.</li>
                  </ul>
                  <p>4. Klik <strong>Deploy</strong>, izinkan akses akun Google (Review Permissions &gt; Advanced &gt; Go to SIPOS).</p>
                  <p>5. Salin <strong>Web App URL</strong> yang dihasilkan (akhiran <code>/exec</code>) lalu masukkan ke tab <strong>Koneksi Web App URL</strong>.</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs text-blue-950">
                <p className="font-bold">Tips Cepat: Inisialisasi Otomatis Tabel Spreadsheet</p>
                <p>
                  Di editor Apps Script, Anda dapat memilih fungsi <code>setupSpreadsheet</code> lalu klik <strong>Run</strong> sekali saja. 
                  Script akan secara otomatis membuat 3 Sheet (PengajuanIzin, RiwayatStatus, Pengaturan) lengkap dengan header berwarna biru resmi!
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: STRUKTUR SPREADSHEET */}
          {activeTab === 'struktur' && (
            <div className="space-y-6">
              
              {/* Sheet 1 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Sheet 1: PengajuanIzin</h4>
                    <p className="text-[11px] text-slate-500">Tabel utama penyimpan seluruh berkas permohonan izin (19 Kolom)</p>
                  </div>
                  <button
                    onClick={() => handleCopy(sheet1Columns.join('\t'), 'sheet1')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'sheet1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'sheet1' ? 'Tersalin' : 'Salin Header (Tab)'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {sheet1Columns.map((col, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[11px] font-mono px-2 py-0.5 rounded">
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sheet 2 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Sheet 2: RiwayatStatus</h4>
                    <p className="text-[11px] text-slate-500">Log audit riwayat setiap perubahan status & catatan admin (7 Kolom)</p>
                  </div>
                  <button
                    onClick={() => handleCopy(sheet2Columns.join('\t'), 'sheet2')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'sheet2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'sheet2' ? 'Tersalin' : 'Salin Header (Tab)'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {sheet2Columns.map((col, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[11px] font-mono px-2 py-0.5 rounded">
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sheet 3 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Sheet 3: Pengaturan</h4>
                    <p className="text-[11px] text-slate-500">Konfigurasi sekolah, NIP Kepala Sekolah, kontak & zona waktu (8 Kolom)</p>
                  </div>
                  <button
                    onClick={() => handleCopy(sheet3Columns.join('\t'), 'sheet3')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'sheet3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'sheet3' ? 'Tersalin' : 'Salin Header (Tab)'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {sheet3Columns.map((col, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[11px] font-mono px-2 py-0.5 rounded">
                      {col}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: KODE BACKEND CODE.GS */}
          {activeTab === 'codegs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    File: Code.gs (Google Apps Script Backend)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Berisi LockService, PropertiesService, endpoint doGet & doPost, hashing SHA-256, dan setup otomatis.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(GAS_CODE_GS, 'code')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copiedSection === 'code' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSection === 'code' ? 'Tersalin!' : 'Salin Semua Kode'}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadFile('Code.gs', GAS_CODE_GS)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Code.gs</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[380px] border border-slate-800">
                  {GAS_CODE_GS}
                </pre>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">Manifest appsscript.json (Zona Waktu WITA):</p>
                <pre className="font-mono text-[11px] text-slate-800 bg-white p-2 rounded border border-slate-200">
                  {APPSSCRIPT_JSON}
                </pre>
              </div>
            </div>
          )}

          {/* TAB: KODE TAMPILAN INDEX.HTML */}
          {activeTab === 'indexhtml' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1.5">
                  <p className="font-bold text-amber-900 text-sm">
                    Cara Menambahkan File Index.html di Editor Apps Script:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-amber-800 leading-relaxed">
                    <li>Buka project Google Apps Script Anda di <strong>script.google.com</strong>.</li>
                    <li>Di panel sebelah kiri pada bagian <strong>Files</strong>, klik tombol <strong>+ (Tambah file)</strong> lalu pilih <strong>HTML</strong>.</li>
                    <li>Beri nama file persis: <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">Index</code> (sistem Apps Script akan otomatis menjadikannya <code className="font-mono">Index.html</code>).</li>
                    <li>Hapus seluruh isi bawaan yang ada di editor tersebut.</li>
                    <li>Klik tombol <strong>"Salin Semua Index.html"</strong> di bawah ini, lalu tempelkan (paste) seluruhnya ke dalam file <code className="font-mono">Index.html</code>.</li>
                    <li>Simpan project (Ctrl+S / Cmd+S), lalu buat Deployment baru atau perbarui deployment yang sudah ada.</li>
                  </ol>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>File: Index.html (Google Apps Script Web App Frontend)</span>
                    <span className="bg-blue-100 text-[#0F52BA] text-[10px] font-bold px-2 py-0.5 rounded">Lengkap</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dilengkapi desain modern Tailwind CSS, logo resmi sekolah, kanvas tanda tangan orang tua, cek status, cetak surat izin PDF, dan dashboard admin.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(GAS_INDEX_HTML, 'indexhtml')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copiedSection === 'indexhtml' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSection === 'indexhtml' ? 'Tersalin!' : 'Salin Semua Index.html'}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadFile('Index.html', GAS_INDEX_HTML)}
                    className="px-3 py-1.5 bg-[#0F52BA] hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Index.html</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[380px] border border-slate-800">
                  {GAS_INDEX_HTML}
                </pre>
              </div>
            </div>
          )}

          {/* TAB: SOLUSI FITUR TIDAK BERFUNGSI SETELAH DEPLOY */}
          {activeTab === 'solusi' && (
            <div className="space-y-6">
              
              <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2.5 text-red-950 font-extrabold text-base">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <h4>Penyebab Utama Fitur Tidak Berfungsi Setelah Deploy & Solusinya</h4>
                </div>
                <p className="text-xs text-red-900 leading-relaxed">
                  Jika setelah melakukan Deploy Web App fitur <strong>Kirim Pengajuan, Cek Status, atau Admin tidak berfungsi</strong>, 
                  hampir selalu disebabkan oleh 3 hal di Google Apps Script berikut. Lakukan 3 langkah mudah di bawah ini untuk mengatasinya secara tuntas:
                </p>
              </div>

              {/* Langkah 1 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">1</span>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Langkah 1: Otorisasi Izin Google (Wajib Dijalankan Sekali di Editor)
                  </h4>
                </div>
                <div className="text-xs text-slate-600 space-y-2 pl-10">
                  <p>
                    Google Apps Script <strong>memblokir akses ke Google Spreadsheet</strong> jika Anda belum pernah memberikan otorisasi akun Google.
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800">
                    <li>Buka editor Google Apps Script di tab browser Anda.</li>
                    <li>Di bilah toolbar atas (di samping tombol <em>Debug</em>), temukan dropdown fungsi.</li>
                    <li>Pilih fungsi bernama: <code className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">jalankanSetupPertamaKali</code></li>
                    <li>Klik tombol <strong>"Jalankan" (Run)</strong>.</li>
                    <li>Kotak dialog Google akan muncul: klik <strong>"Tinjau izin" (Review permissions)</strong>.</li>
                    <li>Pilih akun Google Anda &gt; klik <strong>"Lanjutan" (Advanced)</strong> di pojok kiri bawah &gt; klik <strong>"Buka SIPOS (tidak aman)"</strong> &gt; klik <strong>"Izinkan" (Allow)</strong>.</li>
                  </ol>
                  <p className="text-emerald-700 font-semibold text-[11px]">
                    ✨ Fungsi ini otomatis membuat sheet <strong>PengajuanIzin</strong>, <strong>RiwayatStatus</strong>, dan <strong>Pengaturan</strong> di Google Sheets Anda.
                  </p>
                </div>
              </div>

              {/* Langkah 2 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">2</span>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Langkah 2: Pastikan Pengaturan Deploy Web App Sudah Tepat
                  </h4>
                </div>
                <div className="text-xs text-slate-600 space-y-2 pl-10">
                  <p>
                    Jika pengaturan deploy salah, pengguna selain pemilik akun akan menerima layar kosong atau error 403 Forbidden.
                  </p>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-slate-800">
                    <p>Buka menu <strong>Deploy &gt; Kelola deployment (Manage deployments)</strong> &gt; klik ikon <strong>Pensil (Edit)</strong>:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Execute as (Jalankan sebagai):</strong> Pilih <strong>Me (Saya / akun email Anda)</strong>. <span className="text-red-600 font-bold">JANGAN</span> pilih "User accessing the web app".</li>
                      <li><strong>Who has access (Siapa yang memiliki akses):</strong> Pilih <strong>Anyone (Siapa saja)</strong>. <span className="text-red-600 font-bold">JANGAN</span> pilih "Only myself".</li>
                      <li><em>Catatan:</em> Jika menggunakan akun Google Workspace (@sekolah/@belajar.id), pastikan pilih <strong>"Anyone"</strong>, bukan hanya "Anyone in your organization".</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Langkah 3 */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center">3</span>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Langkah 3: Perbarui Kode Code.gs & Index.html Terbaru, Lalu Deploy Versi Baru
                  </h4>
                </div>
                <div className="text-xs text-slate-600 space-y-2 pl-10">
                  <p>
                    Versi terbaru telah memperbaiki sinkronisasi data tanda tangan orang tua, ID pengajuan, dan perbaikan penanganan data admin agar tidak error.
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800">
                    <li>Salin kode dari tab <strong>"Kode Code.gs"</strong> dan tempel ke file <code className="font-mono">Code.gs</code> di Apps Script.</li>
                    <li>Salin kode dari tab <strong>"Kode Index.html"</strong> dan tempel ke file <code className="font-mono">Index.html</code> di Apps Script.</li>
                    <li>Klik <strong>Simpan (ikon disket)</strong>.</li>
                    <li>Klik <strong>Deploy &gt; Kelola deployment (Manage deployments)</strong> &gt; Edit (ikon pensil).</li>
                    <li>Pada kolom <strong>Version</strong>, pilih <strong>New version (Versi baru)</strong>.</li>
                    <li>Klik <strong>Deploy</strong>. Buka tautan Web App Anda di browser baru atau segarkan halaman.</li>
                  </ol>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
                <div className="text-xs text-emerald-900">
                  <p className="font-bold">Butuh bantuan cepat?</p>
                  <p>Anda dapat mengunduh berkas langsung dan menempelkannya ke editor Apps Script Anda.</p>
                </div>
                <button
                  onClick={() => setActiveTab('indexhtml')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs cursor-pointer shrink-0"
                >
                  Buka Tab Index.html
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>SIPOS SDN 004 Sebatik Tengah · Serverless Architecture</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
