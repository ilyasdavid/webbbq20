var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { Dosen, Jurusan, Kelas, BbqInformasi, AgendaInformasi, User } = require("../models");
const Op = require("sequelize").Op;

/* GET home page. */
router.get("/", function (req, res){
  const alertMessage = req.flash('alertMessage');
  const alertStatus = req.flash('alertStatus');
  const alert = { message: alertMessage, status: alertStatus };

  BbqInformasi.findAll()
    .then(informasiBBQ => {
      AgendaInformasi.findAll()
        .then(informasiAgenda => {
          res.render("home", {
            alert: alert,
            informasiBBQ: informasiBBQ,
            informasiAgenda: informasiAgenda,
            akun: "login"
          });
        })
        .catch(err => {
          req.flash('alertMessage', err.message);
          req.flash('alertStatus', 'danger');
          res.render("home", {
            alert: alert,
            akun: "login"
          });
        });
    })
    .catch(err => {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.render("home", {
        user: userLogin,
        alert: alert,
        akun: "login"
      });
    });
});

router.get("/bbq", function (req, res, next) {
  const alertMessage = req.flash('alertMessage');
  const alertStatus = req.flash('alertStatus');
  const alert = { message: alertMessage, status: alertStatus };

  BbqInformasi.findAll()
    .then(informasiBBQ => {
      AgendaInformasi.findAll()
        .then(informasiAgenda => {
          res.render("index", {
            alert: alert,
            informasiBBQ: informasiBBQ,
            informasiAgenda: informasiAgenda,
            akun: "login"
          });
        })
        .catch(err => {
          req.flash('alertMessage', err.message);
          req.flash('alertStatus', 'danger');
          res.render("index", {
            alert: alert,
            akun: "login"
          });
        });
    })
    .catch(err => {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.render("index", {
        user: userLogin,
        alert: alert,
        akun: "login"
      });
    });
});

router.get("/register", function (req, res, next) {
  const alertMessage = req.flash('alertMessage');
  const alertStatus = req.flash('alertStatus');
  const alert = { message: alertMessage, status: alertStatus };

  Dosen.findAll()
    .then(dosens => {
      Jurusan.findAll()
        .then(jurusans => {
          Kelas.findAll()
            .then(kelas => {
              res.render("index", {
                akun: "register",
                dosens: dosens,
                jurusans: jurusans,
                kelas: kelas,
                alert: alert
              });
            })
            .catch(err => {
              res.render("index", {
                err: err
              });
            });
        })
        .catch(err => {
          res.render("index", {
            err: err
          });
        });
    })
    .catch(err => {
      res.render("index", { err: err })
    });
});

router.get("/forgot-password", function (req, res) {
  const alertMessage = req.flash('alertMessage');
  const alertStatus = req.flash('alertStatus');
  const alert = { message: alertMessage, status: alertStatus };
  // console.log('forgot-password form')
  res.render("index", {
    akun: "forgot-password",
    alert: alert
  });
});

router.post("/forgot-password", async function (req, res) {
  // console.log('Forgot Password!');
  const {
    username,
    email
  } = req.body;

  let password = Math.floor(100000 + Math.random() * 900000);

  const GMAIL_USERNAME = 'bbq.ukmi.arrahman@gmail.com';
  const GMAIL_PASSWORD = 'Kuyasinau9000JonSukses';
  const subject_email = 'Reset Password';
  const text_email = `Akun Kamu telah Berhasil di lakukan Reset Password, Saat ini Pasword baru kamu adalah : ${password}, setelah melakukan Login ke dalam Sistem, segera lakukan perubahan password untuk meningkatkan keamanan Akunmu. Terima Kasih - Admin BBQ Ukmi Ar-Rahman Universitas Teknokrat Indonesia.`;
  // console.log(password);
  // const saltRounds = 7;
  // let salt = bcrypt.genSaltSync(saltRounds);
  password = bcrypt.hashSync(password.toString(), 7);
  // console.log(password);
  await User.findOne({ where: { username: { [Op.eq]: username } } })
    .then(userMahasiswa => {
      if (userMahasiswa) {

        if (email == userMahasiswa.email) {
          // Kirim password reset
          let transporter = nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
              host: 'smtp.googlemail.com', // Gmail Host
              port: 465, // Port
              secure: true, // this is true as port is 465
              auth: {
                user: GMAIL_USERNAME, //Gmail username
                pass: GMAIL_PASSWORD // Gmail password
              }
            });

            let mailOptions = {
              from: 'Admin BBQ Ukmi Ar-Rahman Teknokrat',
              to: email, // Recepient email address. Multiple emails can send separated by commas
              subject: subject_email,
              text: text_email
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                req.flash("alertMessage", err.message);
                req.flash("alertStatus", "danger");
                return res.redirect("/bbq");
              }
              // console.log('Message sent: %s', info.messageId);
              return userMahasiswa.update({
                password
              }).then(() => {
                req.flash(
                  "alertMessage",
                  `Sukses Melakukan Reset Password dengan Username : ${userMahasiswa.username}, Silahkan Login Ulang dengan Password yang baru!`
                );
                req.flash("alertStatus", "success");
                res.redirect("/forgot-password");
              }).catch(err => {
                req.flash("alertMessage", err);
                req.flash("alertStatus", "danger");
                res.redirect("/forgot-password");
              })
            });

          })
        } else {
          req.flash("alertMessage", "Email yang kamu masukkan belum Tepat!");
          req.flash("alertStatus", "danger");
          res.redirect("/forgot-password");
        }
      } else {
        req.flash("alertMessage", "Username yang kamu masukkan Tidak Ada!");
        req.flash("alertStatus", "danger");
        res.redirect("/forgot-password");
      }
    }).catch(err => {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/forgot-password");
    })
})

/* GET login page from template adminlte. */
router.get("/login", function (req, res, next) {
  res.render("login");
})

/* GET dashboardv1 page from template adminlte. */
router.get("/dashboardv1", function (req, res, next) {
  const userLogin = req.session.user;
  res.render("dashboard-v1", { user: userLogin });
})

module.exports = router;
