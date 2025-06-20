const express = require("express");
const {
  initDefault,
  sendDefaultMessage,
  initUserBot,
  sendUserMessage,
} = require("../controllers/whatsappController");

const auth = require("../middleware/auth");

const router = express.Router();

// 🔓 BOT DEFAULT (tidak perlu auth)
router.post("/init-default", initDefault);
router.post("/send-default", sendDefaultMessage);

// 🔐 BOT USER (pakai JWT)
router.post("/init-user", auth, initUserBot);
router.post("/send-user", auth, sendUserMessage); // ← disarankan pakai auth juga

module.exports = router;
