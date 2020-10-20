"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "KeahlianTutors",
      [
        {
          IdTutor: 1,
          keahlian: "Pernah Mengikuti BBQ",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          IdTutor: 1,
          keahlian: "Berakhlak Baik",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          IdTutor: 1,
          keahlian: "Paham Tentang Ilmu Agama",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          IdTutor: 1,
          keahlian: "Paham Makhrojul Huruf Al-Qur'an",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          IdTutor: 1,
          keahlian: "Paham Ilmu Tajwid",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          IdTutor: 1,
          keahlian: "Memiliki Hafalan Al-Qur'an",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("KeahlianTutors", null, {});
  }
};
