const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

let defaultClient;
const userClients = {}; // Simpan instance bot per userId

const loggedInPath = path.join(__dirname, "../data/loggedInBots.json");
let loggedInBots = fs.existsSync(loggedInPath)
  ? JSON.parse(fs.readFileSync(loggedInPath))
  : {};

// --- BOT DEFAULT ---
const initDefaultBot = () => {
  if (defaultClient) return;

  defaultClient = new Client({
    authStrategy: new LocalAuth({ clientId: "default" }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  defaultClient.on("qr", (qr) => {
    console.log("🔐 Scan QR untuk login WhatsApp (default):");
    qrcode.generate(qr, { small: true });
  });

  defaultClient.on("ready", () => {
    console.log("✅ WhatsApp bot default siap digunakan!");
  });

  defaultClient.on("authenticated", () => {
    console.log("🔓 Bot default berhasil login");
  });

  defaultClient.on("auth_failure", (msg) => {
    console.error("❌ Bot default gagal login:", msg);
  });

  defaultClient.on("disconnected", (reason) => {
    console.warn("⚠️ Bot default terputus:", reason);
  });

  defaultClient.initialize();
};

// --- BOT USER (CUSTOM) ---
const initUserBot = (userId) => {
  if (userClients[userId]) {
    console.log(`♻️ Bot untuk user ${userId} sudah aktif`);
    return userClients[userId];
  }

  const clientId = `user-${userId}`;
  const client = new Client({
    authStrategy: new LocalAuth({ clientId }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", (qr) => {
    console.log(`🔐 Scan QR untuk login WhatsApp user ${userId}:`);
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log(`✅ WhatsApp bot user ${userId} siap digunakan!`);
    loggedInBots[userId] = true;
    fs.writeFileSync(loggedInPath, JSON.stringify(loggedInBots, null, 2));
  });

  client.on("authenticated", () => {
    console.log(`🔓 Bot user ${userId} berhasil login`);
  });

  client.on("auth_failure", (msg) => {
    console.error(`❌ Bot user ${userId} gagal login:`, msg);
  });

  client.on("disconnected", (reason) => {
    console.warn(`⚠️ Bot user ${userId} terputus:`, reason);
    delete loggedInBots[userId];
    delete userClients[userId];
    fs.writeFileSync(loggedInPath, JSON.stringify(loggedInBots, null, 2));
  });

  client.initialize();
  userClients[userId] = client;

  return client;
};

// --- KIRIM PESAN ---
const sendMessage = async (number, message, userId = null) => {
  const targetClient = userId ? userClients[userId] : defaultClient;
  if (!targetClient) throw new Error("Bot belum diinisialisasi");

  const chatId = number.includes("@c.us") ? number : `${number}@c.us`;
  await targetClient.sendMessage(chatId, message);
};

module.exports = {
  initDefaultBot,
  initUserBot,
  sendMessage,
};
