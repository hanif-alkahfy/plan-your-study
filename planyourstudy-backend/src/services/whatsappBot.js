const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { getIO } = require("../config/socket");

const sessions = new Map(); // Menyimpan sesi bot per user

// ✅ Inisialisasi bot default saat file ini di-load
const initDefaultBot = () => {
  if (sessions.has("default")) return;

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: "default" }),
    puppeteer: { headless: true },
  });

  client.on("qr", (qr) => {
    console.log("🔍 QR untuk bot default:");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("✅ Bot default siap");
  });

  client.initialize();
  sessions.set("default", client);
};

// ⏫ Inisialisasi Bot per user (dipanggil dari controller)
const initBotForUser = (userId) => {
  if (!userId || typeof userId !== "string") throw new Error("userId invalid");
  if (sessions.has(userId)) return; // Jangan inisialisasi dua kali

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: userId }),
    puppeteer: { headless: true },
  });

  const io = getIO();

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(`QR code dibuat untuk user: ${userId}`);
    io.emit(`qr-${userId}`, qr);
  });

  client.on("ready", () => {
    console.log(`✅ Bot user ${userId} siap`);
    io.emit(`ready-${userId}`);
  });

  client.on("authenticated", () => {
    console.log(`🔐 Bot ${userId} sudah login`);
  });

  client.on("auth_failure", (msg) => {
    console.error(`❌ Auth gagal untuk ${userId}: ${msg}`);
  });

  client.on("disconnected", (reason) => {
    console.warn(`⚠️ Bot ${userId} disconnected: ${reason}`);
    sessions.delete(userId);
  });

  client.initialize();
  sessions.set(userId, client);
};

// 🔹 Fungsi test kirim pesan (untuk bot default)
const sendTestMessage = async (number, message) => {
  const defaultClient = sessions.get("default");
  if (!defaultClient) throw new Error("Bot default belum siap");

  const chatId = number.includes("@c.us") ? number : `${number}@c.us`;
  await defaultClient.sendMessage(chatId, message);
};

const sendMessage = async (userId, message, reminderId = null) => {
  try {
    const recipient = await Recipient.findOne({ where: { userId } });
    if (!recipient) return console.warn(`❌ User ${userId} belum mengatur nomor penerima`);

    const chatId = `${recipient.phoneNumber}@c.us`;
    const type = recipient.type || "default";

    const client = (type === "custom")
      ? sessions.get(`user-${userId}`) // clientId harus disimpan sebagai `user-${userId}` saat inisialisasi
      : sessions.get("default");

    if (!client) {
      return console.warn(`⚠️ Bot ${type} belum siap untuk user ${userId}`);
    }

    await client.sendMessage(chatId, message);

    // Jika reminderId diberikan, tandai sebagai sent
    if (reminderId) {
      await sequelize.query(
        "UPDATE reminders SET status = 'sent', sentAt = NOW() WHERE reminderId = ?",
        { replacements: [reminderId] }
      );
    }

    console.log(`✅ Pesan berhasil dikirim ke ${recipient.phoneNumber} dengan bot ${type}`);
  } catch (err) {
    console.error("❌ Gagal mengirim pesan:", err.message);
  }
};

module.exports = {
  initBotForUser,
  sendTestMessage,
  initDefaultBot,
  sendMessage,
};
