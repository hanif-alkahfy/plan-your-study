const {sendTestMessage,initBotForUser,initDefaultBot,sendUserMessage,} = require("../services/whatsappBot");

// ✅ Jalankan bot default saat controller pertama kali diload
initDefaultBot();

// 🔧 Inisialisasi bot custom untuk user
exports.initBot = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId wajib diisi" });

    await initBotForUser(userId);
    res.json({ message: `Bot untuk ${userId} diinisialisasi` });
  } catch (err) {
    console.error("❌ Gagal inisialisasi bot:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 🧪 Test kirim pesan pakai bot default (langsung pakai nomor WA)
exports.testSend = async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: "Nomor dan pesan wajib diisi" });
  }

  try {
    await sendTestMessage(number, message);
    res.json({ message: `✅ Pesan berhasil dikirim ke ${number}` });
  } catch (err) {
    console.error("Gagal kirim pesan:", err.message);
    res.status(500).json({ error: "Gagal mengirim pesan" });
  }
};

// ✅ Kirim pesan ke user berdasarkan setting (default atau custom)
exports.sendToUser = async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "userId dan pesan wajib diisi" });
  }

  try {
    await sendUserMessage(userId, message); // ← logic pilih bot berdasarkan recipient
    res.json({ message: `✅ Pesan berhasil dikirim ke userId: ${userId}` });
  } catch (err) {
    console.error("❌ Gagal kirim ke user:", err.message);
    res.status(500).json({ error: "Gagal mengirim pesan ke user" });
  }
};
