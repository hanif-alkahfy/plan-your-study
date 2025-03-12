const express = require('express');
const cors = require('cors');
const {sequelize} = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const reminderRoutes = require('./src/routes/reminderRoutes');
const jadwalRoutes = require('./src/routes/jadwalRoutes');
const whatsappRoutes = require("./src/routes/whatsappRoutes");


const PORT = process.env.PORT || 5000;
const app = express();

require("dotenv").config();
require("./src/services/whatsappBot");

app.use(express.json());
app.use(cors());

// Gunakan routing
app.use("/api/whatsapp", whatsappRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/jadwal', jadwalRoutes);

sequelize.sync({ force: false, alter: true })

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server berjalan di PORT: 5000');
});

