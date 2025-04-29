const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./guestbook.db');

router.post('/', (req, res) => {
    const { nama_lengkap, email, nomor_telepon, jumlah_pembayaran, metode_pembayaran } = req.body;

    if (!nama_lengkap || !email || !nomor_telepon || !jumlah_pembayaran || !metode_pembayaran) {
        return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ message: "Email tidak valid" });
    }

    if (jumlah_pembayaran < 10000) {
        return res.status(400).json({ message: "Jumlah pembayaran minimal Rp10.000" });
    }

    Payment.create({ nama_lengkap, email, nomor_telepon, jumlah_pembayaran, metode_pembayaran }, (err) => {
        if (err) return res.status(500).json({ message: "Gagal memproses pembayaran" });
        res.status(200).json({ message: "Pembayaran berhasil" });
    });
});

router.get('/', (req, res) => {
    const sql = "SELECT * FROM payments";
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Gagal mengambil data pembayaran" });
        }
        res.status(200).json(rows);
    });
});

module.exports = router;
