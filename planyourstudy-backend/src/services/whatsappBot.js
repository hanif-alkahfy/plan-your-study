const { sequelize, createTrigger } = require("../config/database");
const moment = require("moment-timezone");
const { Client, LocalAuth } = require("whatsapp-web.js");
const Jadwal = require("../models/Jadwal"); // Import model Jadwal

// Inisialisasi bot WhatsApp
const client = new Client({ authStrategy: new LocalAuth() });

const GROUP_ID = "120363336442316101@g.us";
let scheduledReminders = new Map();

// Jalankan pembuatan trigger saat bot dimulai
(async () => {
  await sequelize.sync();
  await createTrigger();
})();

client.on("qr", (qr) => {
  console.log("Scan QR Code untuk login ke WhatsApp:");
  require("qrcode-terminal").generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("WhatsApp Bot siap!");
  checkNewReminders();
  checkJadwalKuliah(); // Cek jadwal kuliah pertama kali saat bot siap
  setInterval(checkNewReminders, 60000); // Cek reminder setiap 60 detik
  setInterval(checkJadwalKuliah, 60000); // Cek jadwal kuliah setiap 60 detik
});

// Fungsi untuk mengirim pesan ke grup
const sendGroupMessage = async (message) => {
  try {
    await client.sendMessage(GROUP_ID, message);
    console.log(`Pesan berhasil dikirim`);
  } catch (error) {
    console.error("Gagal mengirim pesan ke grup:", error);
  }
};

// 🔹 Fungsi untuk mengecek jadwal kuliah dan mengirim notifikasi
const checkJadwalKuliah = async () => {
  console.log("Mengecek jadwal kuliah...");

  try {
    const now = moment().tz("Asia/Jakarta");
    const today = now.format("dddd"); // Contoh: "Monday"
    const upcomingTime = now.add(10, "minutes").format("HH:mm");

    // Ambil jadwal kuliah untuk hari ini yang akan dimulai dalam 10 menit
    const jadwal = await Jadwal.findAll({
      where: {
        hari: today,
        jamKuliah: upcomingTime,
      },
    });

    if (jadwal.length === 0) {
      console.log("Tidak ada jadwal kuliah dalam 10 menit ke depan.");
      return;
    }

    console.log(`Ditemukan ${jadwal.length} jadwal kuliah yang akan dimulai.`);

    // Kirim notifikasi untuk setiap jadwal yang ditemukan
    jadwal.forEach((j) => {
      const message = `🎓 *Jadwal Kuliah*  
📚 : ${j.mataKuliah}  
⏰ Jam: ${j.jamKuliah}  
🏛 Ruang: ${j.ruang}`;
      sendGroupMessage(message);
    });
  } catch (error) {
    console.error("Gagal mengambil jadwal kuliah:", error);
  }
};

// 🔹 Fungsi untuk mengecek reminder baru
const checkNewReminders = async () => {
  console.log("Mengecek reminder baru...");

  try {
    const events = await sequelize.query("SELECT reminder_id FROM reminder_events", {
      type: sequelize.QueryTypes.SELECT,
    });

    if (events.length === 0) {
      console.log("Tidak ada reminder baru.");
      return;
    }

    console.log(`Ditemukan ${events.length} reminder baru.`);

    for (const event of events) {
      const reminder = await sequelize.models.Reminder.findByPk(event.reminder_id);
      if (!reminder) continue;

      scheduleReminder(reminder);
    }

    await sequelize.query("DELETE FROM reminder_events");
  } catch (error) {
    console.error("Gagal mengambil reminder baru:", error);
  }
};

// 🔹 Fungsi untuk menjadwalkan reminder tertentu
const scheduleReminder = (reminder) => {
  if (scheduledReminders.has(reminder.id)) return;

  const reminderTime = moment(reminder.reminderTime).tz("Asia/Jakarta");
  const now = moment().tz("Asia/Jakarta");
  const delay = reminderTime.diff(now);

  if (delay <= 0) return;

  console.log(`Reminder ID ${reminder.id} akan dikirim dalam ${Math.round(delay / 60000)} menit`);

  const timeout = setTimeout(() => {
    sendGroupMessage(formatReminderMessage(reminder));
    scheduledReminders.delete(reminder.id);
  }, delay);

  scheduledReminders.set(reminder.id, timeout);
};

// 🔹 Fungsi untuk memformat pesan reminder
const formatReminderMessage = (reminder) => {
  const deadlineFormatted = moment(reminder.deadline).tz("Asia/Jakarta").format("ddd DD/MM/YYYY");

  return `📢 *Reminder*  
📚 : ${reminder.mataKuliah}  
📝 : ${reminder.tugas}  
📖 : ${reminder.deskripsi || "Tidak ada deskripsi"}  
🔗 : ${reminder.attachmentLink || "Tidak ada link"}  
📅 : ${deadlineFormatted}`;
};

client.initialize();

module.exports = { sendGroupMessage };
