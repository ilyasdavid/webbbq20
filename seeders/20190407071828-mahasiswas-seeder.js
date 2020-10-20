"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Mahasiswas",
      [
        {
          npm: "13312344",
          nama: "Andi",
          foto: "user4.jpg",
          // tglLahir: new Date(isi date inputnya).toDateString("yyyy-MM-dd"),
          tglLahir: new Date(),
          alamat: "Jalan Raya Z.A Rajabasa",
          bacaQuran: "Belum Lancar",
          nomorHp: "081215679294",
          jenisKelamin: "Pria",
          jadwalKosong: "Senin, pukul 11.00",
          status: "aktif",
          isHaveKelompok: "no",
          KelasId: 1,
          DosenId: 1,
          JurusanId: 8,
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          npm: "13312345",
          nama: "Ani",
          foto: "user5.jpg",
          tglLahir: new Date(),
          alamat: "Jalan Raya Bandar Jaya",
          bacaQuran: "Belum Lancar",
          nomorHp: "081215679295",
          jenisKelamin: "Wanita",
          jadwalKosong: "Senin, pukul 11.00",
          status: "nonaktif",
          isHaveKelompok: "no",
          KelasId: 1,
          DosenId: 1,
          JurusanId: 8,
          UserId: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },

      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Mahasiswas", null, {});
  }
};
