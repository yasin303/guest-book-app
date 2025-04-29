const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email dan Password wajib diisi" });
    }

    User.findByEmail(email, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: "Email tidak ditemukan" });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ message: "Password salah" });
            }
            res.status(200).json({ message: "Login berhasil" });
        });
    });
});

module.exports = router;
