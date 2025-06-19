const { Client, LocalAuth } = require("whatsapp-web.js");
const moment = require("moment-timezone");
const schedule = require("node-schedule");
const qrcode = require("qrcode-terminal");

const { Reminder } = require("../models/Reminder");
const Jadwal = require("../models/Jadwal");
const Recipient = require("../models/Recipient");
const { logWithTimestamp, startServerUpTimeDisplay } = require("../components/logWithTimestamp");
const { sequelize } = require("../config/database");

const client = new Client({ authStrategy: new LocalAuth() });
let scheduledReminders = new Map();

client.on("qr", (qr) => {
  logWithTimestamp("QR Code keluar!");
  qrcode.generate(qr, { small: true });

  const io = require("../utils/socket").getIO();
  io.emit("qr", qr); // kirim ke frontend
});

client.on("ready", async () => {
  logWithTimestamp("WhatsApp Bot siap!");
  checkNewReminders();
  checkJadwalKuliah();

  setInterval(checkNewReminders, 60000);  // setiap menit
  setInterval(checkJadwalKuliah, 60000);
});

client.initialize();
startServerUpTimeDisplay();

// ✅ Kirim ke user, ambil nomor dari Recipient
async function sendUserMessage(userId, message, reminderId = null) {
  try {
    const recipient = await Recipient.findOne({ where: { userId } });
    if (!recipient) {
      return logWithTimestamp(`❌ Nomor belum disetel untuk user ${userId}`);
    }

    const number = recipient.phoneNumber + "@c.us";
    await client.sendMessage(number, message);

    if (reminderId) {
      await sequelize.query(
        "UPDATE reminders SET status = 'sent', sentAt = NOW() WHERE reminderId = ?",
        { replacements: [reminderId] }
      );
    }

    logWithTimestamp(`✅ Pesan dikirim ke ${recipient.phoneNumber}`);
  } catch (err) {
    console.error("❌ Gagal kirim pesan:", err.message);
  }
}

// 🔁 Reminder
async function checkNewReminders() {
  logWithTimestamp("⏰ Mengecek reminder baru...");

  const events = await sequelize.query("SELECT reminder_id FROM reminder_events", {
    type: sequelize.QueryTypes.SELECT,
  });

  for (const event of events) {
    const reminder = await Reminder.findByPk(event.reminder_id);
    if (!reminder) continue;
    scheduleReminder(reminder);
  }

  await sequelize.query("DELETE FROM reminder_events");
}

function scheduleReminder(reminder) {
  if (scheduledReminders.has(reminder.reminderId)) return;

  const waktu = moment(reminder.reminderTime).tz("Asia/Jakarta");
  const now = moment().tz("Asia/Jakarta");
  const delay = waktu.diff(now);

  if (delay <= 0) return;

  logWithTimestamp(`🔔 Reminder ID ${reminder.reminderId} dijadwalkan dalam ${Math.round(delay / 60000)} menit`);

  const timeout = setTimeout(() => {
    sendUserMessage(reminder.userId, formatReminderMessage(reminder), reminder.reminderId);
    scheduledReminders.delete(reminder.reminderId);
  }, delay);

  scheduledReminders.set(reminder.reminderId, timeout);
}

function formatReminderMessage(reminder) {
  const deadline = moment(reminder.deadline).tz("Asia/Jakarta").format("ddd, DD MMM YYYY");

  return `📢 *Reminder*  
📚 Mata Kuliah: ${reminder.mataKuliah}  
📝 Tugas: ${reminder.tugas}  
📖 Deskripsi: ${reminder.deskripsi || "-"}  
🔗 Link: ${reminder.attachmentLink || "-"}  
📅 Deadline: ${deadline}`;
}

// 🔁 Jadwal Kuliah
async function checkJadwalKuliah() {
  const now = moment().tz("Asia/Jakarta");
  const hariIni = now.format("dddd");
  const jam = now.add(10, "minutes").format("HH:mm");

  const jadwals = await Jadwal.findAll({ where: { hari: hariIni, jamKuliah: jam } });

  for (const j of jadwals) {
    const msg = `🎓 *Jadwal Kuliah*  
📚 ${j.mataKuliah}  
⏰ Jam: ${j.jamKuliah}  
🏛 Ruang: ${j.ruang}`;

    sendUserMessage(j.userId, msg);
  }
}

module.exports = { client };
