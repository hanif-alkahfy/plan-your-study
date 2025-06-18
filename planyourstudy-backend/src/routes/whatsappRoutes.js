const express = require("express");
const { sendMessage, initBot } = require("../controllers/whatsappController");

const router = express.Router();

router.post("/init", initBot);

module.exports = router;
