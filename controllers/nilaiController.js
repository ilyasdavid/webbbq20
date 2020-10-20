const { Niali } = require("../models");
const Op = require("sequelize").Op;

module.exports = {
  /* all astor */
  getAstor: (req, res) => {
    Astor.findAll()
      .then(astors => {
        console.log(astors);
        res.render("/admin/astors/index", {
          astors: astors
        });
      })
      .catch(err => {
        console.log(err);
        res.render("index", { err: err });
      });
  },

  notFound: (req, res) => {
    res.render("main/notfound");
  }
};
