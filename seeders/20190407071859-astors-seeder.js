"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Astors",
      [
        {
          nama: "Eko Saputra Asisten",
          jenisKelamin: "Pria",
          nomorHp: "081215679296",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nama: "Endang maulida Asisten",
          jenisKelamin: "Wanita",
          nomorHp: "081215679297",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Astors", null, {});
  }
};
