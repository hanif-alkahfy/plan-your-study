const Reminder = require('../models/Reminder');

// Tambah reminder
exports.addReminder = async (req, res) => {
    try {
        const { mataKuliah, tugas, deskripsi, deadline, reminderTime, attachmentLink } = req.body;

        const reminder = await Reminder.create({ 
            mataKuliah, 
            tugas, 
            deskripsi, 
            deadline, 
            reminderTime, 
            attachmentLink 
        });

        res.status(201).json({ message: 'Reminder added', reminder });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Ambil semua reminder
exports.getAllReminders = async (req, res) => {
    try {
        const reminders = await Reminder.findAll();
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ambil berdasarkan id
const moment = require("moment-timezone");

exports.getReminderById = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findByPk(id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder tidak ditemukan" });
    }

    // Konversi ke zona waktu lokal (misalnya "Asia/Jakarta")
    const formattedReminder = {
      ...reminder.toJSON(),
      deadline: moment(reminder.deadline).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
      reminderTime: moment(reminder.reminderTime).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
      createdAt: moment(reminder.createdAt).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(reminder.updatedAt).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
    };

    res.json(formattedReminder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Edit reminder
exports.editReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const { mataKuliah, tugas, deskripsi, deadline, reminderTime, attachmentLink } = req.body;

        const reminder = await Reminder.findByPk(id);
        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }

        // Update sesuai dengan kolom yang ada di database
        await reminder.update({ 
            mataKuliah, 
            tugas, 
            deskripsi, 
            deadline, 
            reminderTime, 
            attachmentLink 
        });

        res.json({ message: 'Reminder updated', reminder });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Hapus reminder
exports.deleteReminder = async (req, res) => {
    try {
        const { id } = req.params;
        await Reminder.destroy({ where: { id } });
        res.json({ message: 'Reminder deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
