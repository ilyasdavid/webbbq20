"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "LimitMahasiswas",
      [
        {
          npm: "17312005",
          nama: "Rizki Okta Rowansyah",          
          KelasId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {         
          npm: "17312009",
          nama: "Raditha feriyani",               
          KelasId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {          
          npm: "17312010",
          nama: "WIDIYA KUSUMANINGRUM",          
          KelasId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }, 
        {          
          npm: "17312011",
          nama: "Rizky Edy Suwarno",                     
          KelasId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {          
          npm: "14312161",
          nama: "NAUFAL RAVIZAN PRADANA",                     
          KelasId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("LimitMahasiswas", null, {});
  }
};
