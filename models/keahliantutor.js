'use strict';
module.exports = (sequelize, DataTypes) => {
  const KeahlianTutor = sequelize.define('KeahlianTutor', {
    // Attributes
    keahlian: DataTypes.STRING,
    
    // Foreign Key
    IdTutor: DataTypes.INTEGER
  }, {});
  KeahlianTutor.associate = function(models) {
    // associations can be defined here
    KeahlianTutor.belongsTo(sequelize.models.Tutor, {
      foreignKey: "IdTutor"
    });
  };
  return KeahlianTutor;
};