# PANDUAN LENGKAP INTEGRASI SIPOS DENGAN GOOGLE SHEETS & GOOGLE APPS SCRIPT
**SDN 004 Sebatik Tengah, Kabupaten Nunukan, Kalimantan Utara**

---

## 1. IDENTITAS & STRUKTUR SISTEM
- **Nama Aplikasi:** SIPOS (Sistem Informasi Pengusulan Izin Orang Tua Siswa)
- **Instansi:** SD Negeri 004 Sebatik Tengah
- **Alamat:** Desa Sungai Limau, Kec. Sebatik Tengah, Kab. Nunukan, Kalimantan Utara
- **Database Utama:** Google Sheets (Disimpan pada Google Drive resmi sekolah)
- **Backend API:** Google Apps Script (Web App Engine)
- **Zona Waktu:** Asia/Makassar (WITA)

---

## 2. STRUKTUR GOOGLE SHEETS

Spreadsheet harus memiliki 3 lembar kerja (Sheet) dengan penamaan huruf yang tepat:

### Sheet 1: `PengajuanIzin`
Menyimpan seluruh data permohonan izin dari orang tua siswa:
1. `ID_Pengajuan` (Contoh: `IZIN-202610-0021`)
2. `Timestamp` (Format: `YYYY-MM-DD HH:mm:ss`)
3. `Nama_Siswa`
4. `NISN`
5. `Kelas`
6. `Nama_Orang_Tua`
7. `Nomor_WhatsApp`
8. `Jenis_Izin`
9. `Tanggal_Mulai`
10. `Tanggal_Selesai`
11. `Jam_Keluar`
12. `Alasan`
13. `Keterangan`
14. `File_Pendukung`
15. `Status` (Menunggu Verifikasi / Sedang Diproses / Disetujui / Ditolak / Perlu Perbaikan)
16. `Catatan_Admin`
17. `Waktu_Keputusan`
18. `Diproses_Oleh`
19. `Token_Verifikasi_Hash` (SHA-256 Hash PIN verifikasi orang tua)
*(Catatan: Tanda tangan digital orang tua dibubuhkan langsung secara interaktif via kanvas digital dan dicetak berdampingan dengan tanda tangan Kepala Sekolah pada dokumen resmi).*

### Sheet 2: `RiwayatStatus`
Menyimpan log audit setiap pergantian status (7 Kolom):
1. `ID_Riwayat`
2. `ID_Pengajuan`
3. `Status_Sebelumnya`
4. `Status_Baru`
5. `Catatan`
6. `Waktu_Perubahan`
7. `Admin_Pemroses`

### Sheet 3: `Pengaturan`
Menyimpan konfigurasi profil resmi sekolah (8 Kolom):
1. `Nama_Sekolah` (`SDN 004 Sebatik Tengah`)
2. `Alamat_Sekolah` (`Desa Sungai Limau, Kecamatan Sebatik Tengah, Kabupaten Nunukan, Kalimantan Utara`)
3. `Nama_Kepala_Sekolah` (`H. Basir, S.Pd., M.Pd.`)
4. `NIP_Kepala_Sekolah` (`19780512 200502 1 003`)
5. `Email_Sekolah` (`sdn004sebatiktengah@gmail.com`)
6. `Nomor_Kontak_Sekolah` (`+62 822-5555-0040`)
7. `Tahun_Ajaran` (`2026/2027`)
8. `Zona_Waktu` (`Asia/Makassar`)

---

## 3. PANDUAN PEMBUATAN FILE DI GOOGLE APPS SCRIPT

Proyek Google Apps Script membutuhkan **2 file utama**:

### A. File 1: `Code.gs` (Server-side Script)
1. Buka [Google Sheets](https://sheets.new) dan buat spreadsheet baru dengan nama:  
   `SIPOS - Database Izin Siswa SDN 004 Sebatik Tengah`.
2. Klik menu **Extensions (Ekstensi)** > **Apps Script**.
3. Buka file bawaan `Code.gs`, hapus kodenya, lalu tempel kode `Code.gs` dari tab **Kode Code.gs** pada modal aplikasi SIPOS (atau berkas `src/services/gasBackendCode.ts`).
4. Pada dropdown fungsi di atas toolbar Apps Script, pilih fungsi `setupSpreadsheet` lalu klik **Run (Jalankan)** sekali untuk mengotomatisasi pembuatan 3 sheet.

### B. File 2: `Index.html` (Frontend Web App Tampilan Lengkap)
1. Di panel sebelah kiri Apps Script Editor pada bagian **Files**, klik tombol **+ (Tambah file)** > pilih **HTML**.
2. Beri nama file: `Index` (Apps Script akan otomatis menyimpannya sebagai `Index.html`).
3. Hapus seluruh isi bawaan file tersebut.
4. Salin seluruh isi dari tab **Kode Index.html (Tampilan)** pada modal aplikasi SIPOS (atau dari file `GAS_Index.html` / `public/Index.html`).
5. Tempelkan seluruhnya ke dalam file `Index.html`, lalu simpan (**Ctrl+S** / **Cmd+S**).

---

## 4. PANDUAN MEMASUKKAN ID SPREADSHEET & SCRIPT PROPERTIES

1. Salin ID Spreadsheet dari tautan browser Anda:  
   `https://docs.google.com/spreadsheets/d/`**[ID_SPREADSHEET_ANDA]**`/edit`
2. Di Google Apps Script, buka menu **Project Settings (ikon roda gigi)** di sebelah kiri.
3. Gulir ke bawah ke bagian **Script Properties**, klik **Add script property**:
   - Property 1: `SPREADSHEET_ID` -> Value: Masukkan ID spreadsheet Anda.
   - Property 2: `ADMIN_SECRET_KEY` -> Value: `SIPOS@Admin2026` (atau kata sandi admin yang diinginkan).
4. Klik **Save script properties**.

---

## 5. PANDUAN DEPLOYMENT SEBAGAI GOOGLE APPS SCRIPT WEB APP

1. Pada halaman editor Apps Script, klik tombol biru **Deploy** di sudut kanan atas > pilih **New deployment**.
2. Klik ikon gear di sebelah "Select type", pilih **Web app**.
3. Isi konfigurasi sebagai berikut:
   - **Description:** `SIPOS Production v1`
   - **Execute as:** `Me (akun Google sekolah Anda)`
   - **Who has access:** `Anyone (Siapa saja)`  
     *(Pengaturan "Anyone" wajib dipilih agar orang tua siswa dapat mengirim formulir permohonan tanpa dipaksa login akun Google).*
4. Klik tombol **Deploy**.
5. Klik **Authorize access** > Pilih Akun Google > Klik **Advanced** > Klik **Go to SIPOS (unsafe)** > Klik **Allow**.
6. Salin **Web app URL** yang muncul (berakhiran `/exec`).

---

## 6. PANDUAN PENGHUBUNGAN KE APLIKASI WEB SIPOS

1. Buka aplikasi SIPOS di browser.
2. Klik menu navigasi **Google Sheets** (atau tombol *Integrasi Google Sheets & Script*).
3. Pada tab **Koneksi Web App URL**, tempelkan URL Web App yang disalin dari langkah 5.
4. Klik tombol **Simpan & Tes Koneksi**.
5. Sistem akan melakukan ping uji coba ke endpoint Google Apps Script dan memvalidasi respon `{ success: true }`.

---

## 7. PANDUAN HAK AKSES DAN PENGUJIAN END-TO-END

### A. Pengujian Pengajuan Orang Tua
1. Buka menu **Ajukan Izin**.
2. Isi nama siswa (misal: "Muhammad Ridho Pratama"), kelas "Kelas IV", nama orang tua, WhatsApp, jenis izin sakit, alasan, dan centang pernyataan kebenaran.
3. Klik **Kirim Pengajuan**. Konfirmasi pada dialog.
4. Catat **Nomor Pengajuan** unik (misal: `IZIN-202610-XXXX`) dan **Kode PIN 6-digit** yang terbit.

### B. Pengujian Pengecekan Status Siswa
1. Buka menu **Cek Status**.
2. Masukkan Nomor Pengajuan dan Kode PIN.
3. Data akan ditampilkan dengan proteksi keamanan tanpa membuka data siswa lain.

### C. Pengujian Portal Admin & Persetujuan
1. Buka menu **Portal Petugas**.
2. Masuk menggunakan akun:
   - Jabatan: Kepala Sekolah / Guru Piket
   - Kata Sandi: `SIPOS@Admin2026` (atau gunakan tombol Uji Cepat Reviewer)
3. Temukan pengajuan tadi pada tabel.
4. Klik tombol **Setujui** atau **Ubah Status** (tersedia opsi: Disetujui, Sedang Diproses, Perlu Perbaikan, Ditolak).
5. Masukkan catatan admin. Simpan keputusan.

### D. Pengujian Cetak PDF Surat Persetujuan Resmi
1. Pada pengajuan yang telah berstatus Disetujui, klik ikon/tombol **Cetak Surat Persetujuan Resmi (PDF)**.
2. Modal akan menampilkan surat ber-kop resmi Pemerintah Kabupaten Nunukan, Dinas Pendidikan dan Kebudayaan, SD Negeri 004 Sebatik Tengah, nomor surat dinas, identitas lengkap siswa, dan ruang tanda tangan Kepala Sekolah.
3. Klik tombol **Cetak / Simpan PDF** untuk memicu dialog print sistematis browser (sudah disetel dengan CSS portrait A4 tanpa elemen navigasi website).

---

## 9. MENGATASI MASALAH: "SETELAH DEPLOY SEMUA FITUR TIDAK BERFUNGSI"

Jika setelah Anda melakukan Deploy, tombol kirim tidak merespon, data tidak muncul di admin, atau cek status gagal, lakukan **3 langkah verifikasi** ini:

### 1. Belum Menjalankan Otorisasi Izin Google (Paling Sering Terjadi)
Google Apps Script secara default memblokir skrip menulis ke Google Spreadsheet sebelum Anda memberikan izin secara eksplisit:
- Di editor Apps Script, lihat bilah toolbar atas di sebelah tombol *Debug*.
- Pilih fungsi bernama: **`jalankanSetupPertamaKali`**.
- Klik tombol **Run (Jalankan)**.
- Saat dialog izin muncul, klik **Tinjau izin (Review permissions)** > Akun Google Anda > **Lanjutan (Advanced)** > **Buka SIPOS (tidak aman)** > **Izinkan (Allow)**.
- Fungsi ini akan otomatis menyiapkan 3 sheet dan mengaktifkan izin permanen!

### 2. Pengaturan Deploy Salah ("Who has access" / "Execute as")
- Klik **Deploy** > **Kelola deployment (Manage deployments)** > Edit (ikon pensil).
- Pastikan **Execute as** = **Me (Saya)**. *(JANGAN pilih "User accessing the web app")*.
- Pastikan **Who has access** = **Anyone (Siapa saja)**. *(JANGAN pilih "Only myself" atau batasan domain organisasi)*.

### 3. File HTML Bernama `Index` dan Deploy Versi Baru
- File tampilan di Apps Script **harus diberi nama `Index`** (tanpa ekstensi .html, karena Apps Script otomatis menjadikannya `Index.html`).
- Setiap kali Anda memperbarui kode di `Code.gs` atau `Index.html`, buka **Deploy > Kelola deployment > Edit (ikon pensil)**, pilih **New version (Versi baru)** pada kolom Version, lalu klik **Deploy**. Jika tidak memilih "New version", Apps Script akan tetap menjalankan kode lama yang belum diperbaiki.
