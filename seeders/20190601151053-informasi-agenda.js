'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "AgendaInformasis",
      [
        {
          judul: "I'tikaf bersama Rektor",
          deskripsi: "Diberitahukan kepada semua Peserta BBQ yang akan mengikuti BBQ agar pada hari Jum'at, 29 Juni 2019 pukul 20.00 diharapkan kehadirannya di Masjid Asmaul Yusuf",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("AgendaInformasis", null, {});
  }
};
