const { Jadwal, Tutor, Mahasiswa, Astor } = require("../models");
const Op = require("sequelize").Op;

module.exports = {
  /* all relasi untuk create ambil id tutor, mahasiswa dan astor */
  getAllRelasi: (req, res) => {
    Tutor.findAll()
      .then(tutors => {
        Mahasiswa.findAll()
          .then(mahasiswas => {
            Astor.findAll()
              .then(astors => {
                res.render("/admin/jadwal", {
                  tutors: tutors,
                  mahasiswas: mahasiswas,
                  astors: astors
                });
              })
              .catch(err => {
                res.render("/admin/jadwal", {
                  err: err
                });
              });
          })
          .catch(err => {
            res.render("/admin/jadwal", {
              err: err
            });
          });
      })
      .catch(err => {
        res.render("/admin/jadwal", { err: err });
      });
  },

  /* get all jadwal */
  getJadwal: (req, res) => {
    Jadwal.findAll({
      include: [
        { model: Tutor },
        { model: Mahasiswa },
        { model: Astor },
        { order: [["createdAt", "ASC"]] }
      ]
    })
      .then(jadwals => {
        console.log(jadwals);
        res.render("/admin/jadwal", {
          jadwals: jadwals
        });
      })
      .catch(err => {
        console.log(err);
        res.render("/admin/jadwal", {
          err: err
        });
      });
  },

  create: (req, res) => {
    res.render("/admin/jadwal/tambah");
  },

  createJadwal: (req, res) => {
    let jadwalFound;
    Jadwal.create(req.body)
      .then(jadwal => {
        jadwalFound = jadwal;
        req.flash(
          "alertMessage",
          `Sukses Menambahkan Data jadwal dengan nama : ${jadwalFound.nama}`
        );
        req.flash("alertStatus", "success");
        res.redirect("/admin/jadwal");
      })
      .catch(err => {
        req.flash("alertMessage", err.message);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/jawdal");
      });
  },

  findJadwal: (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    const id = req.params.id;
    Jadwal.findOne({
      where: { id: { [Op.eq]: id } },
      include: [{ model: Tutor }, { model: Mahasiswa }, { model: Astor }]
    }).then(jadwal => {
      res.render("/admin/jadwal/edit", {
        alert: alert,
        jadwal: jadwal
      });
    });
  },

  editJadwal: (req, res) => {
    const id = req.params.id;
    let jadwalFound;
    Jadwal.findOne({ where: { id: { [Op.eq]: id } } })
      .then(jadwal => {
        jadwalFound = jadwal;
        return jadwal.update(req.body).then(() => {
          req.flash(
            "alertMessage",
            `Sukses Mengubah Data jadwal dengan nama : ${jadwal.nama}`
          );
          req.flash("alertStatus", "success");
          res.redirect("/admin/jadwal");
        });
      })
      .catch(err => {
        req.flash("alertMessage", err.message);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/jadwal");
      });
  },

  hapusJadwal: (req, res) => {
    let id = req.params.id;
    let jadwalFound;
    Jadwal.findOne({ where: { id: { [Op.eq]: id } } })
      .then(jadwal => {
        jadwalFound = jadwal;
        return jadwal.destroy().then(() => {
          req.flash(
            "alertMessage",
            `Sukses Menghapus Data jadwal dengan nama : ${jadwalFound.nama}`
          );
          req.flash("alertStatus", "success");
          res.redirect("/admin/jadwal/index");
        });
      })
      .catch(err => {
        req.flash("alertMessage", err.message);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/jadwal/index");
      });
  },

  notFound: (req, res) => {
    res.render("main/notfound");
  }
};
