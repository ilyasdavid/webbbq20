"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Kelas",
      [
        {
          namaKelas: "IF 18 A",
          DosenId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaKelas: "IF 18 BC",
          DosenId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaKelas: "IF 18 DE",
          DosenId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaKelas: "TK 18 ABC 1",
          DosenId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaKelas: "TK 18 ABC 2",
          DosenId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaKelas: "TS 18 AB",
          DosenId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Kelas", null, {});
  }
};
