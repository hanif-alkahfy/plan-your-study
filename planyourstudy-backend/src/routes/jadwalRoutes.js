const express = require('express');
const { addJadwal, getAllJadwal, getJadwalById, editJadwal, deleteJadwal } = require('../controllers/jadwalController');

const router = express.Router();

router.post('/', addJadwal); // Menambahkan jadwal
router.get('/', getAllJadwal); // Mengambil semua jadwal
router.get('/:id', getJadwalById); // Mengambil jadwal berdasarkan ID
router.put('/:id', editJadwal); // Mengedit jadwal berdasarkan ID
router.delete('/:id', deleteJadwal); // Menghapus jadwal berdasarkan ID

module.exports = router;
