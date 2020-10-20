'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "TutorInformasis",
      [
        {
          judul: "Rapat Pembentukan Kelompok BBQ",
          deskripsi: "Diberitahukan kepada semua Tutor yang akan menghandle siswa BBQ agar pada hari Sabtu, 25 Juni 2019 pukul 11.00 diharapkan kehadirannya di ruang GSG Pertemuan",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("TutorInformasis", null, {});
  }
};
