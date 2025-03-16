const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const User = require('./User');

const Jadwal = sequelize.define('Jadwal', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hari: { type: DataTypes.STRING, allowNull: false },
    mataKuliah: { type: DataTypes.STRING, allowNull: false },
    jamKuliah: { type: DataTypes.STRING, allowNull: false },
    ruang: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: true
});

User.hasMany(Jadwal);
Jadwal.belongsTo(User);

module.exports = Jadwal;
