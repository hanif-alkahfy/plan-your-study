const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        timezone: "+07:00", // Perbaiki timezone ke format yang benar
    },
    timezone: "+07:00", // Gunakan timezone yang valid untuk Jakarta
});

const createTrigger = async () => {
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS reminder_events (
          id INT AUTO_INCREMENT PRIMARY KEY,
          reminder_id INT NOT NULL,
          event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (reminder_id) REFERENCES reminders(id) ON DELETE CASCADE
        )
      `);
  
      await sequelize.query(`
        DROP TRIGGER IF EXISTS after_insert_reminder;
      `);
  
      await sequelize.query(`
        CREATE TRIGGER after_insert_reminder
        AFTER INSERT ON reminders
        FOR EACH ROW
        INSERT INTO reminder_events (reminder_id) VALUES (NEW.id);
      `);
  
    } catch (error) {
      console.error("Gagal membuat tabel atau trigger:", error);
    }
  };

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected!");
    } catch (error) {
        console.error("ERROR: Gagal terhubung ke database!", error);
    }
};
testConnection();

module.exports = {sequelize, createTrigger};
