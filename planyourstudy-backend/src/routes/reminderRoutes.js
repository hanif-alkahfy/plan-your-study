const express = require('express');
const { addReminder, getAllReminders, getReminderById, editReminder, deleteReminder } = require('../controllers/reminderController');

const router = express.Router();

router.post('/', addReminder); // Menambahkan reminder
router.get('/', getAllReminders); // Mengambil semua reminder
router.get('/:id', getReminderById); // mengambil reminder berdasarkan ID
router.put('/:id', editReminder); // Mengedit reminder berdasarkan ID
router.delete('/:id', deleteReminder); // Menghapus reminder berdasarkan ID

module.exports = router;
