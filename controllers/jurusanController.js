// const models = require("../models");
const { Jurusan } = require("../models");
const Op = require("sequelize").Op;

module.exports = {
  /* all jurusan */
  getJurusans: (req, res) => {
    Jurusan.findAll()
      .then(Jurusans => {
        console.log(Jurusans);
        res.render("jurusan/index", {
          jurusans: jurusans
        });
      })
      .catch(err => {
        console.log(err);
        res.render("jurusan", {
          err: err
        });
      });
  },

  create: (req, res) => {
    res.render('jurusan/tambah');
  },

  createJurusan: (req, res) => {
    let jurusanFound;
    Jurusan.create(req.body).then((jurusan) => {
      jurusanFound = jurusan;
      req.flash('alertMessage', `Sukses Menambahkan Data jurusan dengan nama : ${dosenFound.nama}`);
      req.flash('alertStatus', 'success');
      res.redirect('/jurusan/');
    }).catch((err) => {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/jurusan/tambah');
    });
  },

  findJurusan: (req, res) => {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };
    const id = req.params.id;
    Jurusan.findOne({ where: { id: { [Op.eq]: id } } }).then((jurusan) => {
      res.render('jurusan/edit', {
        alert: alert,
        jurusan: jurusan
      });
    });
  },

  editJurusan: (req, res) => {
    const id = req.params.id;
    let jurusanFound;
    jurusan.findOne({ where: { id: { [Op.eq]: id } } }).then((jurusan) => {
      jurusanFound = jurusan;
      return jurusan.update(req.body).then(() => {
        req.flash('alertMessage', `Sukses Mengubah Data jurusan dengan nama : ${jurusan.nama}`);
        req.flash('alertStatus', 'success');
        res.redirect('/jurusan');
      })
    }).catch((err) => {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/jurusan');
    });
  },

  hapusJurusan: (req, res) => {
    let id = req.params.id;
    let jurusanFound;
    jurusan.findOne({ where: { id: { [Op.eq]: id } } }).then((jurusan) => {
      jurusanFound = jurusan;
      return jurusan.destroy().then(() => {
        req.flash('alertMessage', `Sukses Menghapus Data jurusan dengan nama : ${jurusanFound.nama}`);
        req.flash('alertStatus', 'success');
        res.redirect('/jurusan');
      })
    }).catch((err) => {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/jurusan');
    });
  },

  notFound: (req, res) => {
    res.render('main/notfound');
  }


};
