"use strict";
module.exports = (sequelize, DataTypes) => {
  const Astor = sequelize.define(
    "Astor",
    {
      // Attributes
      nama: DataTypes.STRING,
      jenisKelamin: DataTypes.STRING,
      nomorHp: DataTypes.STRING
    },
    {}
  );
  Astor.associate = function(models) {
    // associations can be defined here
  };
  return Astor;
};
