const express = require("express");
const { initBot, testSend, sendToUser } = require("../controllers/whatsappController");

const router = express.Router();

router.post("/init", initBot);
router.post("/test-send", testSend);
router.post("/send-to-user", sendToUser);

module.exports = router;
