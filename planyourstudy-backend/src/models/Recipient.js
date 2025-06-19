const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Recipient = sequelize.define('Recipient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true
});

// Relasi ke User
Recipient.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

User.hasOne(Recipient, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

module.exports = Recipient;
