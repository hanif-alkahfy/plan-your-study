const Jadwal = require('../models/Jadwal');

// Tambah jadwal baru
exports.addJadwal = async (req, res) => {
    try {
        const { hari, mataKuliah, jamKuliah, ruang } = req.body;
        const jadwal = await Jadwal.create({ hari, mataKuliah, jamKuliah, ruang });
        res.status(201).json({ message: 'Jadwal added', jadwal });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Ambil semua jadwal
exports.getAllJadwal = async (req, res) => {
    try {
        const jadwal = await Jadwal.findAll();
        res.json(jadwal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ambil jadwal berdasarkan ID
exports.getJadwalById = async (req, res) => {
    try {
        const { id } = req.params;
        const jadwal = await Jadwal.findByPk(id);
        if (!jadwal) {
            return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
        }
        res.json(jadwal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit jadwal
exports.editJadwal = async (req, res) => {
    try {
        const { id } = req.params;
        const { hari, mataKuliah, jamKuliah, ruang } = req.body;
        const jadwal = await Jadwal.findByPk(id);
        if (!jadwal) {
            return res.status(404).json({ error: 'Jadwal not found' });
        }
        await jadwal.update({ hari, mataKuliah, jamKuliah, ruang });
        res.json({ message: 'Jadwal updated', jadwal });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Hapus jadwal
exports.deleteJadwal = async (req, res) => {
    try {
        const { id } = req.params;
        await Jadwal.destroy({ where: { id } });
        res.json({ message: 'Jadwal deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
