// const models = require("../models");
const { Kelas, Dosen } = require("../models");
const Op = require("sequelize").Op;

module.exports = {
  /* get all dosen untuk diambil id nya udh create kelas */
  getDosens: (req, res) => {
    Dosen.findAll()
      .then(dosens => {
        console.log(dosens);
        res.render("kelas/index", {
          dosens: dosens
        });
      })
      .catch(err => {
        console.log(err);
        res.render("index", { err: err });
      });
  },

  /* all kelas */
  getKelas: (req, res) => {
    Kelas.findAll({
      include: [
        {
          model: Dosen
        },
        { order: [["createdAt", "ASC"]] }
      ]
    })
      .then(kelas => {
        console.log(kelas);
        res.render("kelas/index", {
          kelas: kelas
        });
      })
      .catch(err => {
        console.log(err);
        res.render("kelas", {
          err: err
        });
      });
  },

  create: (req, res) => {
    res.render("kelas/tambah");
  },

  createKelas: (req, res) => {
    let kelasFound;
    Kelas.create(req.body)
      .then(kelas => {
        kelasFound = kelas;
        req.flash(
          "alertMessage",
          `Sukses Menambahkan Data kelas dengan nama : ${kelasFound.nama}`
        );
        req.flash("alertStatus", "success");
        res.redirect("/kelas");
      })
      .catch(err => {
        req.flash("alertMessage", err.message);
        req.flash("alertStatus", "danger");
        res.redirect("kelas/tambah");
      });
  },

  findKelas: (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    const id = req.params.id;
    Kelas.findOne({
      where: { id: { [Op.eq]: id } },
      include: [
        {
          model: Dosen
        }
      ]
    }).then(kelas => {
      res.render("kelas/edit", {
        alert: alert,
        kelas: kelas
      });
    });
  },

  editKelas: (req, res) => {
    const id = req.params.id;
    let kelasFound;
    Kelas.findOne({ where: { id: { [Op.eq]: id } } })
      .then(kelas => {
        kelasFound = kelas;
        return kelas.update(req.body).then(() => {
          req.flash(
            "alertMessage",
            `Sukses Mengubah Data kelas dengan nama : ${kelas.nama}`
          );
          req.flash("alertStatus", "success");
          res.redirect("/kelas");
        });
      })
      .catch(err => {
        req.flash("alertMessage", err.message);
        req.flash("alertStatus", "danger");
        res.redirect("/kelas");
      });
  },

  hapusKelas: (req, res) => {
    let id = req.params.id;
    let kelasFound;
    Kelas.findOne({ where: { id: { [Op.eq]: id } } })
      .then(kelas => {
        kelasFound = kelas;
        return kelas.destroy().then(() => {
          req.flash(
            "alertMessage",
            `Sukses Menghapus Data kelas dengan nama : ${kelasFound.nama}`
          );
          req.flash("alertStatus", "success");
          res.redirect("/kelas");
        });
      })
      .catch(err => {
        req.flash("alertMessage", err.message);
        req.flash("alertStatus", "danger");
        res.redirect("/kelas");
      });
  },

  notFound: (req, res) => {
    res.render("main/notfound");
  }
};
