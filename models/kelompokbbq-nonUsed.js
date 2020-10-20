'use strict';
module.exports = (sequelize, DataTypes) => {
  const KelompokBBQ = sequelize.define('KelompokBBQ', {
    // Foreign Key
    KelompokId: DataTypes.INTEGER,
    MahasiswaId: DataTypes.INTEGER
  }, {});
  KelompokBBQ.associate = function(models) {
    // associations can be defined here
    KelompokBBQ.belongsTo(sequelize.models.Mahasiswa, {
      foreignKey: "MahasiswaId"
    });

    KelompokBBQ.belongsTo(sequelize.models.Kelompok, {
      foreignKey: "KelompokId"
    });
  };
  return KelompokBBQ;
};