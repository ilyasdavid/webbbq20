"use strict";
module.exports = (sequelize, DataTypes) => {
  const Mahasiswa = sequelize.define(
    "Mahasiswa",
    {
      // Attributes
      npm: DataTypes.STRING,
      nama: DataTypes.STRING,
      foto: DataTypes.STRING,
      tglLahir: DataTypes.DATE,
      alamat: DataTypes.TEXT,
      bacaQuran: DataTypes.STRING,
      nomorHp: DataTypes.STRING,
      jenisKelamin: DataTypes.STRING,
      jadwalKosong: DataTypes.STRING,
      status: DataTypes.STRING,
      isHaveKelompok: DataTypes.STRING,

      // Foreign Key
      KelasId: DataTypes.INTEGER,
      DosenId: DataTypes.INTEGER,
      JurusanId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      KelompokId: DataTypes.INTEGER
    },
    {}
  );
  Mahasiswa.associate = function(models) {
    // associations can be defined here
    Mahasiswa.belongsTo(sequelize.models.Jurusan, {
      foreignKey: "JurusanId"
    });

    Mahasiswa.belongsTo(sequelize.models.Dosen, {
      foreignKey: "DosenId"
    });

    Mahasiswa.belongsTo(sequelize.models.Kelas, {
      foreignKey: "KelasId"
    });

    Mahasiswa.belongsTo(sequelize.models.User, {
      foreignKey: "UserId"
    });

    Mahasiswa.belongsTo(sequelize.models.Kelompok, {
      foreignKey: "KelompokId"
    });
  };
  return Mahasiswa;
};
