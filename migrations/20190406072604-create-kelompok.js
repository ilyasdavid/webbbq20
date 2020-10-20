"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Kelompoks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namaKelompok: {
        type: Sequelize.STRING,
        unique: true
      },
      jenis: {
        type: Sequelize.STRING        
      },
      jadwal: {
        type: Sequelize.STRING        
      },
      bacaQuran: {
        type: Sequelize.STRING        
      },
      tempat: {
        type: Sequelize.STRING        
      },
      TutorId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "Tutors",
          key: "id"
        }
      },
      AstorId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "Astors",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Kelompoks");
  }
};
