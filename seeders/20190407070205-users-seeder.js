"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const password = bcrypt.hashSync("rahasia", 10);
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          nama: "Rio Sandi",
          username: "rio_admin1",
          password: password,
          role: "admin",
          email: "rio@toptar.com",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // mahasiswa yang statusnya nanti sudah aktif
          nama: "Andi",
          username: "13312344",
          password: password,
          role: "mahasiswa",
          email: "Andi@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          // mahasiswa yang belum di aktifkan
          nama: "Ani",
          username: "15312556",
          password: password,
          role: "mahasiswa",
          email: "Ani@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nama: "Ade sanjaya",
          username: "adesanjaya",
          password: password,
          role: "tutor",
          email: "adesanjayn@toptar.com",
          createdAt: new Date(),
          updatedAt: new Date()
        },                                                                                                                                                                                                                                                             
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
