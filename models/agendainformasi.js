'use strict';
module.exports = (sequelize, DataTypes) => {
  const AgendaInformasi = sequelize.define('AgendaInformasi', {
    judul: DataTypes.STRING,
    deskripsi: DataTypes.TEXT
  }, {});
  AgendaInformasi.associate = function (models) {
    // associations can be defined here
  };
  return AgendaInformasi;
};