'use strict';
module.exports = (sequelize, DataTypes) => {
  const BbqInformasi = sequelize.define('BbqInformasi', {
    judul: DataTypes.STRING,
    deskripsi: DataTypes.TEXT
  }, {});
  BbqInformasi.associate = function (models) {
    // associations can be defined here
  };
  return BbqInformasi;
};