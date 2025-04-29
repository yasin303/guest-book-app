# 📚 Guest Book Web App

Aplikasi Buku Tamu berbasis web dengan **frontend (Next.js)**, **backend (Express.js)** dan database **SQLite**. Fitur utama mencakup buku tamu, login admin, halaman pembayaran dan konfirmasi pembayaran.

---

## 🧹 Fitur Utama

### Halaman Publik

- Form Buku Tamu: Nama & Pesan (wajib)
- Data disimpan ke database dan ditampilkan di dashboard admin

### Halaman Admin

- Login dengan email & password (dengan bcrypt)
- Lihat daftar tamu yang mengisi form
- Tombol logout

### Halaman Pembayaran

- Formulir pembayaran: Nama, Email, Telepon, Jumlah, Metode
- Validasi: semua wajib diisi, email valid, min. pembayaran Rp10.000
- Setelah submit, diarahkan ke halaman konfirmasi

### Halaman Konfirmasi

- Menampilkan data pembayaran yang telah diisi
- Pesan: "Terima kasih, pembayaran Anda sebesar Rp [jumlah] telah berhasil diproses."

---

## 💠 Teknologi yang Digunakan

### Frontend

- [Next.js](https://nextjs.org/) 
- [React Query](https://tanstack.com/query/latest) untuk fetch API
- [Tailwind CSS](https://tailwindcss.com/) untuk styling
- Axios

### Backend

- Node.js + Express.js
- SQLite 
- bcrypt, JWT, dotenv
- CORS, body-parser

---

## 🚀 Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone <URL_REPOSITORY>
cd project-root (server-client)
```

### 2. Jalankan Backend

```bash
cd server
npm install
cp .env.example .env  # Buat file .env dan sesuaikan
npm run dev            # atau npm start
```

### 3. Jalankan Frontend

```bash
cd client
npm install
npm run dev
```

### 4. Akses Aplikasi

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5001](http://localhost:5001)

---

## 📦 Struktur Database (SQLite)

- **guests**: `id`, `nama`, `pesan`, `timestamp`
- **users**: `id`, `email`, `password` (hashed)
- **payments**: `id`, `nama_lengkap`, `email`, `nomor_telepon`, `jumlah_pembayaran`, `metode_pembayaran`, `timestamp`

---

## 📦 Struktur Backend

- **Server.js** : `import & konfigurasi`, `port & run server`, `database & middleware`, `routing API`

- **Route** : `endpoint route API`, `logic of each endpoint`, `validation data`

- **Controller** : `connect req user(client) to logic db`

- **Model** : `connect db sqlite`, `cretae admin, table db`, `provide CRUD function`

---

## 📦 Struktur Frontend

- **Server.js** : `import & konfigurasi`, `port & run server`, `database & middleware`, `routing API`

- **Route** : `endpoint route API`, `logic of each endpoint`, `validation data`

- **Controller** : `connect req user(client) to logic db`

- **Model** : `connect db sqlite`, `cretae admin, table db`, `provide CRUD function`

---

## 🔐 Keamanan

- Password admin di-hash menggunakan bcrypt
- Tidak ada fitur register — akun admin dimasukkan manual di database
- Login menggunakan JWT
- Waktu expired login 1 menit

---

## ✅ Validasi & Responsif

- Validasi input di frontend dan backend
- Layout mendukung perangkat mobile

---


