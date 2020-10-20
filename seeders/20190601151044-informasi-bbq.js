'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "BbqInformasis",
      [
        {
          judul: "Rapat Pembentukan Kelompok BBQ",
          deskripsi: "Diberitahukan kepada semua Peserta BBQ yang akan mengikuti BBQ agar pada hari Jum'at, 29 Juni 2019 pukul 11.00 diharapkan kehadirannya di Masjid Asmaul Yusuf",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("BbqInformasis", null, {});
  }
};
