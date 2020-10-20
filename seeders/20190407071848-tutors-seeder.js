"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Tutors",
      [
        {
          nama: "Ade sanjaya",
          jenisKelamin: "Pria",
          nomorHp: "081215679295",
          UserId: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tutors", null, {});
  }
};
