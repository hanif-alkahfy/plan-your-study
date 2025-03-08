const { sendWhatsAppMessage } = require("../services/whatsappBot");

exports.sendMessage = async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: "Nomor dan pesan wajib diisi" });
  }

  const result = await sendWhatsAppMessage(phone, message);
  res.json(result);
};
