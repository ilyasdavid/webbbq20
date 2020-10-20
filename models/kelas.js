"use strict";
module.exports = (sequelize, DataTypes) => {
  const Kelas = sequelize.define(
    "Kelas",
    {
      // Attributes
      namaKelas: DataTypes.STRING,

      // Foreign Key
      DosenId: DataTypes.INTEGER
    },
    {}
  );
  Kelas.associate = function(models) {
    // associations can be defined here
    Kelas.belongsTo(sequelize.models.Dosen, {
      foreignKey: "DosenId"
    });
  };
  return Kelas;
};
