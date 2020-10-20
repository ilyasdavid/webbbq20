"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Nilais", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      absensi: {
        type: Sequelize.INTEGER
      },
      mutabaah: {
        type: Sequelize.INTEGER
      },
      mid: {
        type: Sequelize.INTEGER
      },
      kegiatan: {
        type: Sequelize.INTEGER
      },
      uasP: {
        type: Sequelize.INTEGER
      },
      uasT: {
        type: Sequelize.INTEGER
      },
      totalNilai: {
        type: Sequelize.FLOAT,
      },
      hm: {
        type: Sequelize.STRING
      },
      keterangan: {
        type: Sequelize.STRING
      },
      MahasiswaId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "Mahasiswas",
          key: "id"
        }
      },
      KelompokId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "Kelompoks",
          key: "id"
        }
      },
      KelasId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",       
        allowNull: false,
        references: {
          model: "Kelas",
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
    return queryInterface.dropTable("Nilais");
  }
};
