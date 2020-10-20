"use strict";
module.exports = (sequelize, DataTypes) => {
  const Jurusan = sequelize.define(
    "Jurusan",
    {
      namaJurusan: DataTypes.STRING
    },
    {}
  );
  Jurusan.associate = function(models) {
    // associations can be defined here
  };
  return Jurusan;
};
