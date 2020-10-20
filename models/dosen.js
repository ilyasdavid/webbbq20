"use strict";
module.exports = (sequelize, DataTypes) => {
  const Dosen = sequelize.define(
    "Dosen",
    {
      // Attributes
      nama: DataTypes.STRING,
      nik: DataTypes.STRING
    },
    {}
  );
  Dosen.associate = function(models) {
    // associations can be defined here
  };
  return Dosen;
};
