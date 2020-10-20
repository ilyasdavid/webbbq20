"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Jurusans",
      [
        {
          namaJurusan: "Pendidikan Matematika S1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaJurusan: "Pendidikan Bahasa Inggris S1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaJurusan: "Pendidikan Olahraga S1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaJurusan: "Sastra Inggris S1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaJurusan: "Teknik Elektro S1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaJurusan: "Teknik Sipil S1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaJurusan: "Teknik Komputer S1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaJurusan: "Teknik Informatika S1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaJurusan: "Teknologi Informasi S1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaJurusan: "Sistem Informasi S1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaJurusan: "Sistem Informasi Akuntansi D3",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          namaJurusan: "Sistem Informasi D3",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Jurusans", null, {});
  }
};
