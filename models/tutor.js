"use strict";
module.exports = (sequelize, DataTypes) => {
  const Tutor = sequelize.define(
    "Tutor",
    {
      // Attributes
      nama: DataTypes.STRING,
      jenisKelamin: DataTypes.STRING,
      nomorHp: DataTypes.STRING,

      // Foreign Key
      UserId: DataTypes.INTEGER
    },
    {}
  );
  Tutor.associate = function(models) {
    // associations can be defined here
    Tutor.belongsTo(sequelize.models.User, {
      foreignKey: "UserId"
    });
  };
  return Tutor;
};
