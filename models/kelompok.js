"use strict";
module.exports = (sequelize, DataTypes) => {
  const Kelompok = sequelize.define(
    "Kelompok",
    {
      // Attributes
      namaKelompok: DataTypes.STRING,
      jenis: DataTypes.STRING,
      jadwal: DataTypes.STRING,
      bacaQuran: DataTypes.STRING,
      tempat: DataTypes.STRING,

      // Foreign Key
      TutorId: DataTypes.INTEGER,
      AstorId: DataTypes.INTEGER
    },
    {}
  );
  Kelompok.associate = function(models) {
    // associations can be defined here
    Kelompok.belongsTo(sequelize.models.Tutor, {
      foreignKey: "TutorId"
    });

    Kelompok.belongsTo(sequelize.models.Astor, {
      foreignKey: "AstorId"
    });

    Kelompok.hasMany(sequelize.models.Mahasiswa);
  };
  return Kelompok;
};
