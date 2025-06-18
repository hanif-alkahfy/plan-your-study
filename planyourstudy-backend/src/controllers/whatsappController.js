const { Client, LocalAuth } = require("whatsapp-web.js");
const { getIO } = require("../config/socket");

const sessions = new Map();

exports.initBot = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: "userId wajib diisi" });
  if (sessions.has(userId)) return res.json({ message: "Bot sudah aktif" });

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: userId }),
    puppeteer: { headless: true }
  });

  const io = getIO();
  const qrcode = require("qrcode-terminal");

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true }); // debug terminal
    console.log("QR code dibuat!");
    io.emit(`qr-${userId}`, qr);
  });

  client.on("ready", () => {
    console.log(`Bot user ${userId} sudah ready`);
    io.emit(`ready-${userId}`);
  });

  client.on("authenticated", () => {
    console.log(`🔐 Bot user ${userId} sudah login`);
  });

  client.on("auth_failure", (msg) => {
    console.log(`Gagal login untuk ${userId}:`, msg);
  });

  client.on("disconnected", (reason) => {
    console.log(`Bot ${userId} disconnected:`, reason);
  });

  client.initialize();
  sessions.set(userId, client);

  res.json({ message: "Bot diinisialisasi" });
};