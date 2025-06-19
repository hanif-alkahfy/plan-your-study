require("dotenv").config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const reminderRoutes = require('./src/routes/reminderRoutes');
const jadwalRoutes = require('./src/routes/jadwalRoutes');
const whatsappRoutes = require("./src/routes/whatsappRoutes");
const recipientRoutes = require('./src/routes/recipientRoutes');
const { createReminderTrigger } = require('./src/controllers/TriggerController');


const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/whatsapp", whatsappRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/jadwals', jadwalRoutes);
app.use('/api/recipients', recipientRoutes);

(async () => {
  try {
    await sequelize.sync({ force: false, alter: true });
    console.log("Sync database berhasil !!");
    await createReminderTrigger();
  } catch (err) {
    console.error("Gagal sync database atau trigger", err);
  }
})();

module.exports = app;
