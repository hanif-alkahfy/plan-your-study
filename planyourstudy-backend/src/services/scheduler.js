const { Reminder } = require("../models");
const { Op } = require("sequelize");

// Ambil semua reminder yang waktunya <= sekarang dan belum dikirim
const getDueReminders = async () => {
  const now = new Date();

  const reminders = await Reminder.findAll({
    where: {
      remindAt: { [Op.lte]: now }, // ⏰ pastikan ini nama field yang sesuai
      sent: false, // atau bisa juga pakai sentAt: null
    },
  });

  return reminders;
};

module.exports = {
  getDueReminders,
};
