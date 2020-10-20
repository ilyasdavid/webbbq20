'use strict';
module.exports = (sequelize, DataTypes) => {
  const LimitMahasiswa = sequelize.define('LimitMahasiswa', {
    npm: DataTypes.STRING,
    nama: DataTypes.STRING,    

    // Foreign Key
    KelasId: DataTypes.INTEGER
    
  }, {});
  LimitMahasiswa.associate = function(models) {
    // associations can be defined here
    LimitMahasiswa.belongsTo(sequelize.models.Kelas, {
      foreignKey: "KelasId"
    });

  };
  return LimitMahasiswa;
};