const sequelize = require("../config/database");
const moment = require("moment-timezone");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

const GROUP_ID = "120363411146663952@g.us"; // Ganti dengan Group ID dari terminal
let scheduledReminders = new Set(); // Menyimpan reminder yang sudah dijadwalkan

client.on("qr", (qr) => {
  console.log("📢 Scan QR Code untuk login ke WhatsApp:");
  require("qrcode-terminal").generate(qr, { small: true });
});

client.on("ready", async() => {
  console.log("✅ WhatsApp Bot siap!");
  scheduleReminders(); // Jalankan pertama kali setelah bot siap

  // await new Promise(resolve => setTimeout(resolve, 3000)); // Tunggu sebelum mengambil daftar chat
  // const chats = await client.getChats();

  // chats.forEach(chat => {
  //   console.log(`📌 Nama: ${chat.name || "Tanpa Nama"} | ID: ${chat.id._serialized} | Group: ${chat.isGroup}`);
  // });

  // Jalankan ulang pengecekan reminder setiap 1 menit agar bisa menangkap reminder baru
  setInterval(scheduleReminders, 60000);
});

// Fungsi untuk mengirim pesan ke grup WhatsApp
const sendGroupMessage = async (message, reminderId) => {
    try {
      await client.sendMessage(GROUP_ID, message);
  
      // Update status reminder ke "sent" setelah pesan terkirim
      await sequelize.query(
        "UPDATE reminders SET status = 'sent', sentAt = NOW() WHERE id = ?",
        { replacements: [reminderId] }
      );
  
      console.log(`✅ Reminder berhasil terkirim dan Reminder ID ${reminderId} diperbarui ke 'sent'`);
      
      // Hapus dari daftar reminder yang dijadwalkan
      scheduledReminders.delete(reminderId);
    } catch (error) {
      console.error("❌ Gagal mengirim pesan ke grup:", error);
    }
  };
  

// Fungsi untuk menjadwalkan reminder yang belum terkirim
const scheduleReminders = async () => {
  console.log("🔍 Menjadwalkan reminder yang belum terkirim...");

  try {
    const [results] = await sequelize.query(
      "SELECT * FROM reminders WHERE status = 'pending'"
    );

    if (!results || results.length === 0) {
      console.log("⚠ Tidak ada reminder yang harus dijadwalkan.");
      return;
    }

    console.log(`📌 Menemukan ${results.length} reminder yang harus dijadwalkan:`);

    results.forEach((reminder) => {
      if (scheduledReminders.has(reminder.id)) {
        console.log(`⏳ Reminder ID ${reminder.id} sudah dijadwalkan sebelumnya, melewati...`);
        return;
      }

      const reminderTime = moment(reminder.reminderTime).tz("Asia/Jakarta");
      const now = moment().tz("Asia/Jakarta");
      const delay = reminderTime.diff(now);

      if (delay <= 0) {
        console.log(`⚠ Reminder ID ${reminder.id} sudah terlewat, melewati...`);
        return;
      }

      console.log(
        `⏳ Reminder ID ${reminder.id} akan dikirim dalam ${Math.round(
          delay / 1000 / 60
        )} menit (${reminderTime.format("HH:mm:ss")})`
      );

      scheduledReminders.add(reminder.id);

      // Jadwalkan pengiriman pesan tepat pada waktu `reminderTime`
      setTimeout(() => {
        const formattedMessage = formatReminderMessage(reminder);
        sendGroupMessage(formattedMessage, reminder.id);
      }, delay);
    });
  } catch (err) {
    console.error("❌ ERROR: Gagal mengambil data dari database!", err);
  }
};

// Fungsi untuk memformat pesan berdasarkan template
const formatReminderMessage = (reminder) => {
  const deadlineFormatted = moment(reminder.deadline)
    .tz("Asia/Jakarta")
    .format("ddd DD/MM/YYYY"); // Format Sun 09/03/2025

  return `📢 *Reminder*  
📚 Mata Kuliah: ${reminder.mataKuliah}  
📝 Tugas: ${reminder.tugas}  
📖 Deskripsi: ${reminder.deskripsi || "Tidak ada deskripsi"}  
🔗 Link: ${reminder.attachmentLink || "Tidak ada link"}  
📅 Deadline: ${deadlineFormatted}`;
};

client.initialize();

module.exports = { sendGroupMessage };
