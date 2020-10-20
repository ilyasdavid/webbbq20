"use strict";
module.exports = (sequelize, DataTypes) => {
  const Nilai = sequelize.define(
    "Nilai",
    {
      // Attributes
      absensi: DataTypes.INTEGER,
      mutabaah: DataTypes.INTEGER,
      mid: DataTypes.INTEGER,
      kegiatan: DataTypes.INTEGER,
      uasP: DataTypes.INTEGER,
      uasT: DataTypes.INTEGER,
      totalNilai:DataTypes.INTEGER,
      hm:DataTypes.STRING,
      keterangan:DataTypes.STRING,

      // Foreign Key
      MahasiswaId: DataTypes.INTEGER,
      KelompokId: DataTypes.INTEGER,
      KelasId: DataTypes.INTEGER
    },
    {}
  );
  Nilai.associate = function(models) {
    // associations can be defined here
    Nilai.belongsTo(sequelize.models.Mahasiswa, {
      foreignKey: "MahasiswaId"
    });

    Nilai.belongsTo(sequelize.models.Kelompok, {
      foreignKey: "KelompokId"
    });

    Nilai.belongsTo(sequelize.models.Kelas, {
      foreignKey: "KelasId"
    });
  };
  return Nilai;
};
