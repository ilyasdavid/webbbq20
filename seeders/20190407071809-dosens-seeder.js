"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Dosens",
      [
        {
          nama: "Rizal Taufik, M.Pd.I",
          nik: "11223344",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nama: "Friyansyah, S.Pd., M.Pd.",
          nik: "11223345",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nama: "Suhaili, M.Pd.",
          nik: "11223346",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Dosens", null, {});
  }
};
