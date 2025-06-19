const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Jadwal = sequelize.define('Jadwal', {
  jadwalId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  hari: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mataKuliah: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jamKuliah: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ruang: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

// Relasi ke User (1 User = 1 Jadwal)
Jadwal.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.hasOne(Jadwal, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

module.exports = Jadwal;
