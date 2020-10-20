const { Dosen } = require("../models");
const Op = require("sequelize").Op;

module.exports = {
  /* get all dosen */
  getDosens: (req, res) => {
    Dosen.findAll()
      .then(dosens => {
        console.log(dosens);
        res.render("/admin/dosen/index", {
          dosens: dosens
        });
      })
      .catch(err => {
        console.log(err);
        res.render("/admin/dosenindex", { err: err });
      });
  },

  /* redirec ke view admin/dosen/tambah.ejs */
  create: (req, res) => {
    res.render('/admin/dosen/tambah');
  },

  /* create dosen */
  createDosen: (req, res) => {
    let dosenFound;
    Dosen.create(req.body).then((dosen) => {
      dosenFound = dosen;
      req.flash('alertMessage', `Sukses Menambahkan Data Dosen dengan nama : ${dosenFound.nama}`);
      req.flash('alertStatus', 'success');
      res.redirect('/dosen');
    }).catch((err) => {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/dosen/tambah');
    });
  },

  /* get single dosen */
  findDosen: (req, res) => {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };
    const id = req.params.id;
    Dosen.findOne({ where: { id: { [Op.eq]: id } } }).then((dosen) => {
      res.render('dosen/edit', {
        alert: alert,
        dosen: dosen
      });
    });
  },

  /* update dosen single id */
  editDosen: (req, res) => {
    const id = req.params.id;
    let dosenFound;
    Dosen.findOne({ where: { id: { [Op.eq]: id } } }).then((dosen) => {
      dosenFound = dosen;
      return dosen.update(req.body).then(() => {
        req.flash('alertMessage', `Sukses Mengubah Data dosen dengan nama : ${dosen.nama}`);
        req.flash('alertStatus', 'success');
        res.redirect('/dosen');
      })
    }).catch((err) => {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/dosen');
    });
  },

  /* delete dosen single id */
  hapusDosen: (req, res) => {
    let id = req.params.id;
    let dosenFound;
    Dosen.findOne({ where: { id: { [Op.eq]: id } } }).then((dosen) => {
      dosenFound = dosen;
      return dosen.destroy().then(() => {
        req.flash('alertMessage', `Sukses Menghapus Data dosen dengan nama : ${dosenFound.nama}`);
        req.flash('alertStatus', 'success');
        res.redirect('/dosen');
      })
    }).catch((err) => {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/dosen');
    });
  },

  notFound: (req, res) => {
    res.render('main/notfound');
  }

};
