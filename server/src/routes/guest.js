const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');

router.post('/', (req, res) => {
    const { nama, pesan } = req.body;
    if (!nama || !pesan) {
        return res.status(400).json({ message: "Nama dan Pesan wajib diisi" });
    }
    Guest.create(nama, pesan, (err) => {
        if (err) return res.status(500).json({ message: "Gagal menyimpan data" });
        res.status(200).json({ message: "Tamu berhasil ditambahkan" });
    });
});

router.get('/', (req, res) => {
    Guest.getAll((err, rows) => {
        if (err) return res.status(500).json({ message: "Gagal mengambil data" });
        res.status(200).json(rows);
    });
});

module.exports = router;
