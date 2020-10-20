"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Mahasiswas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      npm: {
        type: Sequelize.STRING,
        unique: true
      },
      nama: {
        type: Sequelize.STRING
      },
      foto: {
        type: Sequelize.STRING
      },
      tglLahir: {
        type: Sequelize.DATEONLY
      },
      alamat: {
        type: Sequelize.TEXT
      },
      bacaQuran: {
        type: Sequelize.STRING
      },
      nomorHp: {
        type: Sequelize.STRING
      },
      jenisKelamin: {
        type: Sequelize.STRING
      },
      jadwalKosong: {
        type: Sequelize.STRING
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
      DosenId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "Dosens",
          key: "id"
        }
      },
      JurusanId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "Jurusans",
          key: "id"
        }
      },
      UserId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        }
      },
      KelompokId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        allowNull: true,
        references: {
          model: "Kelompoks",
          key: "id"
        }
      },
      status: {
        type: Sequelize.STRING
      },
      isHaveKelompok: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable("Mahasiswas");
  }
};
