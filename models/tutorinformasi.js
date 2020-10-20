'use strict';
module.exports = (sequelize, DataTypes) => {
  const TutorInformasi = sequelize.define('TutorInformasi', {
    judul: DataTypes.STRING,
    deskripsi: DataTypes.TEXT
  }, {});
  TutorInformasi.associate = function (models) {
    // associations can be defined here
  };
  return TutorInformasi;
};