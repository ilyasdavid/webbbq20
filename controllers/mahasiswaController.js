const bcrypt = require("bcrypt")
const { Mahasiswa, User, Kelas, Dosen, Jurusan, AgendaInformasi, BbqInformasi, Kelompok, Tutor, Astor, Nilai } = require("../models")
const Op = require("sequelize").Op

module.exports = {

  home: async (req, res) => {
    const userLogin = req.session.user
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };
    let mahasiswa = await Mahasiswa.findOne({
      where: { UserId: { [Op.eq]: userLogin.id } },
      include: [
        { model: User },
        { model: Kelas },
        { model: Dosen },
        { model: Jurusan }
      ]
    })
    if (mahasiswa) {
      BbqInformasi.findAll()
        .then(informasiBBQ => {
          AgendaInformasi.findAll()
            .then(informasiAgenda => {
              res.render("mahasiswa/dashboard", {
                user: userLogin,
                alert,
                informasiBBQ,
                informasiAgenda,
                mahasiswa
              })
            })
            .catch(err => {
              req.flash('alertMessage', err.message)
              req.flash('alertStatus', 'danger')
              res.render("mahasiswa/dashboard", {
                user: userLogin,
                alert: alert,
                mahasiswa
              })
            })
        })
        .catch(err => {
          req.flash('alertMessage', err.message)
          req.flash('alertStatus', 'danger')
          res.render("mahasiswa/dashboard", {
            user: userLogin,
            alert: alert,
            mahasiswa
          })
        })
    }
  },


  /* all relasi untuk create ambil id User, Kelas, Dosen dan Jurusan */
  getAllRelasi: (req, res) => {
    User.findAll()
      .then(users => {
        Kelas.findAll()
          .then(kelas => {
            Dosen.findAll()
              .then(dosens => {
                Jurusan.findAll().then(jurusans => {
                  res.render("/admin/mahsiswa/tambah", {
                    users: users,
                    kelas: kelas,
                    dosens: dosens,
                    jurusans: jurusans
                  });
                });
              })
              .catch(err => {
                res.render("/admin/mahasiswa/index", {
                  err: err
                });
              });
          })
          .catch(err => {
            res.render("/admin/mahasiswa/index", {
              err: err
            });
          });
      })
      .catch(err => {
        res.render("/admin/mahasiswa/index", { err: err });
      });
  },

  /* all mahasiswa */
  getMahasiswa: (req, res) => {
    Mahasiswa.findAll({
      include: [
        { model: User },
        { model: Kelas },
        { model: Dosen },
        { model: Jurusan }
      ]
    })
      .then(mahasiswas => {
        res.render("/admin/mahasiswa/view", {
          mahasiswas: mahasiswas
        });
      })
      .catch(err => {
        console.log(err);
        res.render("tutor", {
          err: err
        });
      });
  },

  /* redirec ke admin mahasiswa tambah */
  create: (req, res) => {
    res.render("/admin/mahasiswa/tambah");
  },

  /* insert mahasiswa */
  createMahasiswa: (req, res) => {
    Mahasiswa.create(req.body)
      .then(mahasiswa => {
        req.flash(
          "alertMessage",
          `Sukses Menambahkan Data mahasiswa dengan nama : ${
          mahasiswa.nama
          }`
        );
        req.flash("alertStatus", "success");
        res.redirect("/admin/mahasiswa");
      })
      .catch(err => {
        req.flash("alertMessage", err.message);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/mahasiswa/tambah");
      });
  },

  /* get single mahasiswa */
  findMahasiswa: (req, res) => {
    const alertMessage = req.flash("alertMessage")
    const alertStatus = req.flash("alertStatus")
    const alert = { message: alertMessage, status: alertStatus };
    const userLogin = req.session.user
    const id = req.params.id

    // user mahasiswa 
    if (userLogin.role === "mahasiswa") {
      Mahasiswa.findOne({
        where: { UserId: { [Op.eq]: id } },
        include: [
          { model: User },
          { model: Kelas },
          { model: Dosen },
          { model: Jurusan }
        ]
      }).then(mahasiswa => {
        res.render("mahasiswa/profile", {
          alert: alert,
          mahasiswa: mahasiswa,
          user: userLogin
        })
      })
    } else if (userLogin.role === "admin") {
      Mahasiswa.findOne({
        where: { UserId: { [Op.eq]: id } },
        include: [
          { model: User },
          { model: Kelas },
          { model: Dosen },
          { model: Jurusan }
        ]
      }).then(mahasiswa => {
        res.render("/admin/mahasiswa/edit", {
          alert: alert,
          mahasiswa: mahasiswa
        })
      })
    }
  },

  findMahasiswaProfileMine: async (req, res) => {
    const userLogin = req.session.user
    const id = req.params.id
    const alertMessage = req.flash("alertMessage")
    const alertStatus = req.flash("alertStatus")
    const alert = { message: alertMessage, status: alertStatus };

    // user mahasiswa 
    if ((userLogin.role === "mahasiswa") && (userLogin.id == id)) {
      let mahasiswa = await Mahasiswa.findOne({
        where: { UserId: { [Op.eq]: userLogin.id } },
        include: [
          { model: User },
          { model: Kelas },
          { model: Dosen },
          { model: Jurusan }
        ]
      })

      if (mahasiswa) {
        res.render("mahasiswa/profile", {
          alert: alert,
          user: userLogin,
          mahasiswa: mahasiswa
        })
      } else {
        req.flash(
          "alertMessage",
          `Akun Mahasiswa mu tidak ditemukan`
        )
        req.flash("alertStatus", "warning");
        res.redirect("/mahasiswa")
      }
    } else {
      req.flash(
        "alertMessage",
        `Dilarang Melihat Profile Mahasiswa Lainnya!`
      )
      req.flash("alertStatus", "warning");
      res.redirect("/mahasiswa")
    }
  },

  showEditFormProfileMahasiswa: async (req, res) => {
    const userLogin = req.session.user;
    const id = req.params.id;

    // user mahasiswa 
    if (userLogin.role === "mahasiswa" && userLogin.id == id) {
      const mahasiswa = await Mahasiswa.findOne({
        where: { UserId: { [Op.eq]: userLogin.id } },
        include: [
          { model: User },
          { model: Kelas },
          { model: Dosen },
          { model: Jurusan }
        ]
      });

      if (mahasiswa) {
        Dosen.findAll()
          .then(dosens => {
            Jurusan.findAll()
              .then(jurusans => {
                Kelas.findAll()
                  .then(kelas => {
                    res.render("mahasiswa/profile_edit", {
                      user: userLogin,
                      mahasiswa: mahasiswa,
                      dosens: dosens,
                      jurusans: jurusans,
                      kelas: kelas
                    });
                  })
              })
          })
      } else {
        req.flash(
          "alertMessage",
          `Akun Mahasiswa mu tidak ditemukan`
        )
        req.flash("alertStatus", "warning");
        res.redirect("/mahasiswa")
      }
    } else {
      req.flash(
        "alertMessage",
        `Dilarang Melihat Profile Mahasiswa Lainnya!`
      )
      req.flash("alertStatus", "warning");
      res.redirect("/mahasiswa")
    }
  },

  /* update single mahasiswa */
  editMahasiswa: async (req, res) => {
    const userLogin = req.session.user;
    const id = req.params.id;

    const {
      npm,
      nama,
      tglLahir,
      alamat,
      bacaQuran,
      nomorHp,
      jenisKelamin,
      jadwalKosong,
      KelasId,
      DosenId,
      JurusanId,
      username,
      email
    } = req.body;
    
    const files = req.files;

    // user mahasiswa 
    if ((userLogin.role === "mahasiswa") && (userLogin.id == id)) {
      const mahasiswa = await Mahasiswa.findOne({
        where: { UserId: { [Op.eq]: userLogin.id } },
        include: [
          { model: User },
          { model: Kelas },
          { model: Dosen },
          { model: Jurusan }
        ]
      });

      if (mahasiswa) {
        User.findOne({ where: { id: { [Op.eq]: id } } })
          .then(userMahasiswa => {
            if (files) {
              // ada foto
              // cek file, dan upload yang baru
              if (files.foto.mimetype == "image/jpeg" || files.foto.mimetype == "image/png" || files.foto.mimetype == "image/gif") {
                files.foto.mv("public/foto-peserta-bbq/" + files.foto.name, (err) => {
                    if (err) return res.status(500).send(err);
                });
              } else {
                  req.flash('alertMessage', "This format is not allowed , please upload file with '.png','.gif','.jpg'");
                  req.flash('alertStatus', 'danger');
                  return res.redirect(`/mahasiswa/profile/${id}`);
              }
              // update data baru dengan foto
              return mahasiswa.update({
                // req.body for update Model Mahasiswa Profile                
                npm: npm,
                nama: nama,
                foto: files.foto.name,
                tglLahir: tglLahir,
                alamat: alamat,
                bacaQuran: bacaQuran,
                nomorHp: nomorHp,
                jenisKelamin: jenisKelamin,
                jadwalKosong: jadwalKosong,
                KelasId: KelasId,
                DosenId: DosenId,
                JurusanId: JurusanId
              }).then(() => {
                return userMahasiswa.update({
                    // req.body for update Model User Mahasiswa 
                    nama: nama,
                    username: username,
                    email: email,
                  }).then(() => {
                    req.flash(
                      "alertMessage",
                      `Sukses Mengubah Data dengan nama : ${mahasiswa.nama}`
                    );
                    req.flash("alertStatus", "success");
                    res.redirect(`/mahasiswa/profile/${id}`);
                });
              });
            } else {
              // tidak ada foto baru
              // update data baru tanpa foto
              return mahasiswa.update({
                // req.body for update Model Mahasiswa Profile                
                npm: npm,
                nama: nama,
                tglLahir: tglLahir,
                alamat: alamat,
                bacaQuran: bacaQuran,
                nomorHp: nomorHp,
                jenisKelamin: jenisKelamin,
                jadwalKosong: jadwalKosong,
                KelasId: KelasId,
                DosenId: DosenId,
                JurusanId: JurusanId
              }).then(() => {
                return userMahasiswa.update({
                    // req.body for update Model User Mahasiswa 
                    nama: nama,
                    username: username,
                    email: email
                  }).then(() => {
                  req.flash(
                    "alertMessage",
                    `Sukses Mengubah Data dengan nama : ${mahasiswa.nama}`
                  );
                  req.flash("alertStatus", "success");
                  res.redirect(`/mahasiswa/profile/${id}`);
                });
              });
            }            
          }).catch(err => {
            req.flash("alertMessage", err.message);
            req.flash("alertStatus", "danger");
            res.redirect(`/mahasiswa/profile/${id}`);
          });

      } else {
        req.flash(
          "alertMessage",
          `Akun Mahasiswa mu tidak ditemukan`
        )
        req.flash("alertStatus", "warning");
        res.redirect("/mahasiswa")
      }
    } else {
      req.flash(
        "alertMessage",
        `Dilarang Melihat Profile Mahasiswa Lainnya!`
      )
      req.flash("alertStatus", "warning");
      res.redirect("/mahasiswa")
    }
  },

  editPassword: async (req, res) => {
    const userLogin = req.session.user
    const id = req.params.id

    let { password } = req.body
    password = bcrypt.hashSync(password, 7)

    if ((userLogin.role === "mahasiswa") && (userLogin.id == id)) {
      await User.findOne({ where: { id: { [Op.eq]: id } } })
        .then(userMahasiswa => {
          return userMahasiswa.update({
            password
          }).then(() => {
            req.flash(
              "alertMessage",
              `Sukses Mengubah Password dengan Username : ${userMahasiswa.username}`
            );
            req.flash("alertStatus", "success")
            res.redirect(`/mahasiswa/profile/${id}`)
          }).catch(err => {
            req.flash("alertMessage", err.message)
            req.flash("alertStatus", "danger")
            res.redirect(`/mahasiswa/profile/${id}`)
          })
        }).catch(err => {
          req.flash("alertMessage", err.message)
          req.flash("alertStatus", "danger")
          res.redirect(`/mahasiswa/profile/${id}`)
        })
    }
  },

  showFormCetakRegistrasi: async (req, res) => {
    const userLogin = req.session.user;
    const id = req.params.id;

    // user mahasiswa 
    if ((userLogin.role === "mahasiswa") && (userLogin.id == id)) {
      let mahasiswa = await Mahasiswa.findOne({
        where: { UserId: { [Op.eq]: userLogin.id } },
        include: [
          { model: User },
          { model: Kelas },
          { model: Dosen },
          { model: Jurusan }
        ]
      });

      if (mahasiswa) {        
        res.render("mahasiswa/cetak-registrasi", {
          user: userLogin,
          mahasiswa: mahasiswa
        })
      } else {
        req.flash(
          "alertMessage",
          `Akun Mahasiswa mu tidak ditemukan`
        )
        req.flash("alertStatus", "warning");
        res.redirect("/mahasiswa")
      }

    } else {
      req.flash(
        "alertMessage",
        `Dilarang Melihat Profile Mahasiswa Lainnya!`
      )
      req.flash("alertStatus", "warning");
      res.redirect("/mahasiswa")
    }
  },

  jadwalKelompokBBQ: async (req, res) => {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };
    const userLogin = req.session.user;
    const id = req.params.id;

    // user mahasiswa 
    if (userLogin.role === "mahasiswa" && userLogin.id == id) {
      try {
        const mahasiswa = await Mahasiswa.findOne({
          where: { UserId: { [Op.eq]: userLogin.id } },
          include: [
            { model: User },
            { model: Kelas },
            { model: Dosen },
            { model: Jurusan },
            { model: Kelompok }
          ]
        });
        
        if (mahasiswa) {
          Kelompok.findOne({
              where: {                  
                  id: { [Op.eq]: mahasiswa.KelompokId }
              },
              include: [
                  {
                      model: Mahasiswa,
                      as: 'Mahasiswas',
                      include: [
                        { model: Jurusan },
                        { model: Kelas }
                      ]
                  },
                  {
                      model: Tutor,
                  },
                  {
                      model: Astor,
                  }
              ]
          }).then(kelompok => {            
            res.render("mahasiswa/jadwal_kelompok_bbq", {
              alert: alert,
              user: userLogin,
              kelompok: kelompok,
              mahasiswa
            });            
          }).catch(err => {
            console.log(err)
          })

        }

      } catch (error) {
        console.log('Error :')
        console.log(error);
        req.flash(
          "alertMessage",
          `Error View Jadwal!`
        );
        req.flash("alertStatus", "warning");
        res.redirect("/mahasiswa");
      }
    } else {
      req.flash(
        "alertMessage",
        `Dilarang Melihat Profile Mahasiswa Lainnya!`
      );
      req.flash("alertStatus", "warning");
      res.redirect("/mahasiswa");
    }
  },

  tutorProfileBBQ: async (req, res) => {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };
    const userLogin = req.session.user;
    const id = req.params.id;
    
    // user mahasiswa 
    if (userLogin.role === "mahasiswa" && userLogin.id == id) {
      try {
        const mahasiswa = await Mahasiswa.findOne({
          where: { UserId: { [Op.eq]: userLogin.id } },
          include: [
            { model: User },
            { model: Kelas },
            { model: Dosen },
            { model: Jurusan },
            { model: Kelompok }
          ]
        });
        
        if (mahasiswa) {
          const kelompok = await Kelompok.findOne({
              where: {                  
                  id: { [Op.eq]: mahasiswa.KelompokId }
              },
              include: [
                  {
                      model: Mahasiswa
                  },
                  {
                      model: Tutor,
                      include: [
                        { model: User }
                      ]
                  },
                  {
                      model: Astor,
                  }
              ]
          });

          res.render("mahasiswa/profile_tutor", {
            alert: alert,
            user: userLogin,
            kelompok: kelompok,
            mahasiswa
          }); 
        }

      } catch (error) {
        console.log('Error :')
        console.log(error);
        req.flash(
          "alertMessage",
          `Error View Jadwal!`
        );
        req.flash("alertStatus", "warning");
        res.redirect("/mahasiswa");
      }
    } else {
      req.flash(
        "alertMessage",
        `Dilarang Melihat Profile Mahasiswa Lainnya!`
      );
      req.flash("alertStatus", "warning");
      res.redirect("/mahasiswa");
    }
  },

  nilaiBBQMahasiswa: async (req, res) => {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };
    const userLogin = req.session.user;
    const id = req.params.id;
    
    // user mahasiswa 
    if (userLogin.role === "mahasiswa" && userLogin.id == id) {
      try {
        const mahasiswa = await Mahasiswa.findOne({
          where: { UserId: { [Op.eq]: userLogin.id } },
          include: [
            { model: User },
            { model: Kelas },
            { model: Dosen },
            { model: Jurusan },
            { model: Kelompok }
          ]
        });
        
        if (mahasiswa) {
          const kelompok = await Kelompok.findOne({
              where: {                  
                  id: { [Op.eq]: mahasiswa.KelompokId }
              },
              include: [
                  {
                      model: Mahasiswa
                  },
                  {
                      model: Tutor
                  },
                  {
                      model: Astor,
                  }
              ]
          });

          const nilaiMahasiswa = await Nilai.findOne({
            where: {
              MahasiswaId: { [Op.eq]: mahasiswa.id }
            },
            include: [
              {
                model: Mahasiswa
              }
            ]
          });

          res.render("mahasiswa/nilai_bbq", {
            alert: alert,
            user: userLogin,
            kelompok: kelompok,
            mahasiswa,
            nilaiMahasiswa
          }); 
        }
      } catch (error) {
        console.log('Error :')
        console.log(error);
        req.flash(
          "alertMessage",
          `Error View Nilai!`
        );
        req.flash("alertStatus", "warning");
        res.redirect("/mahasiswa");
      }
    } else {
      req.flash(
        "alertMessage",
        `Dilarang Melihat Nilai Mahasiswa Lainnya!`
      );
      req.flash("alertStatus", "warning");
      res.redirect("/mahasiswa");
    }
  }

}