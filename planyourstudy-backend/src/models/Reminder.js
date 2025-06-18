const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const User = require('./User');

const Reminder = sequelize.define('Reminder', {
    reminderId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    mataKuliah: { type: DataTypes.STRING, allowNull: false },
    tugas: { type: DataTypes.STRING, allowNull: false },
    deskripsi: { type: DataTypes.TEXT },
    deadline: { type: DataTypes.DATE, allowNull: false },
    reminderTime: { type: DataTypes.DATE, allowNull: false },
    attachmentLink: { type: DataTypes.STRING },
    status: { 
        type: DataTypes.ENUM('pending', 'sent'), 
        allowNull: false, 
        defaultValue: 'pending' 
    }, // Status pengiriman
    sentAt: { 
        type: DataTypes.DATE, 
        allowNull: true 
    } // Waktu pengiriman (null jika belum dikirim)
}, {
    timestamps: true
});

User.hasMany(Reminder);
Reminder.belongsTo(User);

module.exports = Reminder;
