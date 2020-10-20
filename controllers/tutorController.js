const bcrypt = require("bcrypt");
const { Tutor, Astor, User, AgendaInformasi, BbqInformasi, KeahlianTutor, Kelompok, Mahasiswa,Jurusan, Kelas, Nilai } = require("../models");
const Op = require("sequelize").Op;

module.exports = {
  /* all tutor */
  home: async (req, res) => {
    const userLogin = req.session.user;
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };

    try {
      const tutor = await Tutor.findOne({
        where: { UserId: { [Op.eq]: userLogin.id } },
        include: [
          { model: User }
        ]
      });
      
      // if (tutor) {
        //console.log('tutor')
        //console.log(tutor)
        const keahlianTutor = await KeahlianTutor.findAll({
          where: { IdTutor: { [Op.eq]: tutor.id } },
          include: [
            { model: Tutor }
          ]
        });
        
        const informasiBBQ = await BbqInformasi.findAll();
        const informasiAgenda = await AgendaInformasi.findAll();
        
        const kelompok = await Kelompok.findOne({
          where: { TutorId: { [Op.eq]: tutor.id } },
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
              model: Tutor
            },
            {
              model: Astor
            }
          ]
        });

        const nilaiMahasiswas = Nilai.findAll({
          where: {
            KelompokId: { [Op.eq]: kelompok.id }
          },
          include: [
            {
              model: Mahasiswa,
              as: 'Mahasiswas'              
            }
          ]
        });

        // if(KeahlianTutor){

          res.render("tutor/dashboard", {
            user: userLogin,
            alert,
            informasiBBQ,
            informasiAgenda,
            tutor,
            keahlianTutor,
            kelompok: kelompok,
            nilaiMahasiswas: nilaiMahasiswas,
            action: "dashboard"
          });
        // }
      // }      

    } catch (error) {
      req.flash('alertMessage', error.message);
      req.flash('alertStatus', 'danger');
      res.render("tutor/dashboard", {
        user: userLogin,
        alert: alert,
        kelompok: "",
        action: "data-tutor-belum-lengkap"
      });
    }      
  },
  getNilaiMahasiswas: async (req, res) => {
    const idKelompok = req.params.id;

    const nilaiMahasiswas = await Nilai.findAll({
      where: {
        KelompokId: { [Op.eq]: idKelompok }
      },
      include: [
        {
          model: Mahasiswa
        }
      ]
    });

    res.status(200).json({
      nilaiMahasiswas: nilaiMahasiswas
    });    
  },

  simpanNilaiMahasiswa: async (req, res) => {
    const absensi = parseInt(req.body.absensi);
    const mutabaah = parseInt(req.body.mutabaah);
    const mid = parseInt(req.body.mid);
    const kegiatan = parseInt(req.body.kegiatan);
    const uasP = parseInt(req.body.uasP);
    const uasT = parseInt(req.body.uasT);
    const dataMahasiswa = req.body.mahasiswa_id;

    // kehadiran * 10% 
    // mutabaah * 15%
    // mid * 15%
    // kegiatan * 10%
    // uas praktek * 30%
    // uas tertulis * 20%
    // ------------------- +
    // total nilai  = 
    console.log()
    let totalNilai = 0;
    let hm = "";
    let keterangan = "";

    if (typeof dataMahasiswa === 'string' || dataMahasiswa instanceof String) {
      console.log('Nilai untuk 1 orang');
      totalNilai = (absensi * 0.10) + (mutabaah * 0.15) + (mid * 0.15) + (kegiatan * 0.10) + (uasP * 0.30) + (uasT * 0.20);
      console.log(`Total Nilai = ${totalNilai}`);      
      if (totalNilai >= 90) {
        hm ="A"
        keterangan = "Sangat Baik"
      } else if (totalNilai >= 80 && totalNilai <= 89) {
        hm ="B"
        keterangan = "Baik"
      } else if (totalNilai >= 70 && totalNilai <= 79) {
        hm ="C"
        keterangan = "Sedang"
      } else if (totalNilai >= 60 && totalNilai <= 69) {
        hm ="D"
        keterangan = "Buruk"
      } else if (totalNilai <= 59) {
        hm ="E"
        keterangan = "Sangat Buruk"
      }

      await Nilai.update({
        absensi: absensi,
        mutabaah: mutabaah,
        mid: mid,
        kegiatan: kegiatan,
        uasP: uasP,
        uasT: uasT,
        totalNilai: totalNilai,
        hm: hm,
        keterangan: keterangan
      }, {
        where: {
          MahasiswaId : { [Op.eq]: parseInt(req.body.mahasiswa_id)}
        }
      });
    } else {
      for (let i = 0; i < dataMahasiswa.length; i++) {
        console.log('Nilai untuk banyak orang');
        totalNilai = (absensi * 0.10) + (mutabaah * 0.15) + (mid * 0.15) + (kegiatan * 0.10) + (uasP * 0.30) + (uasT * 0.20);
        console.log(`Total Nilai-${i} = ${totalNilai}`);
        if (totalNilai >= 90) {
          hm ="A"
          keterangan = "Sangat Baik"
        } else if (totalNilai >= 80 && totalNilai <= 89) {
          hm ="B"
          keterangan = "Baik"
        } else if (totalNilai >= 70 && totalNilai <= 79) {
          hm ="C"
          keterangan = "Sedang"
        } else if (totalNilai >= 60 && totalNilai <= 69) {
          hm ="D"
          keterangan = "Buruk"
        } else if (totalNilai <= 59) {
          hm ="E"
          keterangan = "Sangat Buruk"
        }
        
        await Nilai.update({
          absensi: req.body.absensi[i],
          mutabaah: req.body.mutabaah[i],
          mid: req.body.mid[i],
          kegiatan: req.body.kegiatan[i],
          uasP: req.body.uasP[i],
          uasT: req.body.uasT[i],
          totalNilai: totalNilai,
          hm: hm,
          keterangan: keterangan
        }, {
          where: {
            MahasiswaId : { [Op.eq]: req.body.mahasiswa_id[i]}
          }
        });
      }
    }

    return res.status(200).json({
      message: 'Sukses Simpan Nilai'
    });

  },

  getTutor: (req, res) => {
    Tutor.findAll({
      include: [{
        model: User,
        order: [['createdAt', 'ASC']]
      }]
    })
      .then(tutors => {
        console.log(tutors);
        res.render("tutor", {
          tutors: tutors
        });
      })
      .catch(err => {
        console.log(err);
        res.render("tutor", {
          err: err
        });
      });
  },

  create: (req, res) => {
    res.render('tutor/tambah');
  },

  createTutor: (req, res) => {
    let {
      nama,
      username,
      password,
      email,
      jenisKelamin,
      nomorHp,
      UserId
    } = req.body;
    let hashPassword = bcrypt.hashSync(password, 7);
    // cek apakah username sudah ada ?
    User.findOne({ where: { username: username } }).then(findUsername => {
      if (findUsername) {
        /* nanti ini diubah ngelink ke username sudah ada  */
        console.log("sudah ada " + findUsername.username);
        // res.redirect("/username sudah ada bro", { user: findUsername });
      } else {
        User.create({
          nama,
          username,
          password: hashPassword,
          email,
          role: "tutor"
        })
          .then(user => {
            UserId = user.id;
            /* untuk  KelasId, DosenId dan JurusanId dibuat difrontend */
            Tutor.create({
              nama,
              jenisKelamin,
              nomorHp,
              UserId
            })
              .then(tutor => {
                console.log(tutor.nama);
                /* nanti ubah sesuai link nya aja */
                res.redirect("/tutor");
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              message: "Email sudah terpakai"
            });
          });
      }
    });
  },

  findTutor: (req, res) => {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };
    const id = req.params.id;
    Tutor.findOne({
      where: { id: { [Op.eq]: id } },
      include: [{
        model: User,
      }]
    }).then((tutor) => {
      res.render('tutor/edit', {
        alert: alert,
        tutor: tutor
      });
    });
  },

  editTutor: (req, res) => {
    const id = req.params.id;
    let tutorFound;
    tutor.findOne({ where: { id: { [Op.eq]: id } } }).then((tutor) => {
      tutorFound = tutor;
      return tutor.update(req.body).then(() => {
        req.flash('alertMessage', `Sukses Mengubah Data tutor dengan nama : ${tutor.nama}`);
        req.flash('alertStatus', 'success');
        res.redirect('/tutor');
      })
    }).catch((err) => {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/tutor');
    });
  },

  hapusTutor: (req, res) => {
    let id = req.params.id;
    let tutorFound;
    tutor.findOne({ where: { id: { [Op.eq]: id } } }).then((tutor) => {
      tutorFound = tutor;
      return tutor.destroy().then(() => {
        req.flash('alertMessage', `Sukses Menghapus Data tutor dengan nama : ${tutorFound.nama}`);
        req.flash('alertStatus', 'success');
        res.redirect('/tutor');
      })
    }).catch((err) => {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/tutor');
    });
  },

  notFound: (req, res) => {
    res.render('main/notfound');
  },

  findTutorProfileMine: async (req, res) => {
    const userLogin = req.session.user;
    const id = req.params.id;
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };

    // user tutor
    if(userLogin.role === "tutor" && userLogin.id == id){
      const tutor = await Tutor.findOne({
        where: {
          UserId: { [Op.eq]: userLogin.id }
        },
        include: [
          { model: User }
        ]
      })

      if(tutor){
        res.render("tutor/profile", {
          alert: alert,
          user: userLogin,
          tutor: tutor
        })
      } else {
        req.flash(
          "alertMessage",
          `Akun Tutor tidak ditemukan`
        );
        req.flash("alertStatus", "warning");
        res.redirect("/tutor");
      }
    } else {
      req.flash(
        "alertMessage",
        `Dilarang Melihat Profile Tutor Lainnya!`
      )
      req.flash("alertStatus", "warning");
      res.redirect("/tutor")
    }
  },

  showEditFormProfileTutor: async (req, res) => {
    const userLogin = req.session.user
    const id = req.params.id

    // user tutor 
    if ((userLogin.role === "tutor") && (userLogin.id == id)) {
      const tutor = await Tutor.findOne({
        where: { UserId: { [Op.eq]: userLogin.id } },
        include: [
          { model: User }
        ]
      })

      if (tutor) {
        res.render("tutor/profile_edit", {
          user: userLogin,
          tutor: tutor
        });
      } else {
        req.flash(
          "alertMessage",
          `Akun Tutor mu tidak ditemukan`
        )
        req.flash("alertStatus", "warning");
        res.redirect("/tutor")
      }
    } else {
      req.flash(
        "alertMessage",
        `Dilarang Melihat Profile Tutor Lainnya!`
      )
      req.flash("alertStatus", "warning");
      res.redirect("/tutor")
    }
  },

  editTutor: async (req, res) => {
    const userLogin = req.session.user;
    const id = req.params.id;
    const {      
      nama,      
      jenisKelamin,
      nomorHp,      
      username,
      email
    } = req.body;

    // user tutor
    if ((userLogin.role === "tutor") && (userLogin.id == id)) {
      const tutor = await Tutor.findOne({
        where: { UserId: { [Op.eq]: userLogin.id } },
        include: [
          { model: User }
        ]
      })

      if (tutor) {
        User.findOne({ where: { id: { [Op.eq]: id } } })
          .then(userTutor => {
            return tutor.update(                          
              {
                nama: nama,
                nomorHp: nomorHp,
                jenisKelamin: jenisKelamin                
              }
            ).then(() => {
              return userTutor.update(                
                {
                  nama: nama,
                  username: username,
                  email: email
                }
              ).then(() => {
                req.flash(
                  "alertMessage",
                  `Sukses Mengubah Data dengan nama : ${tutor.nama}`
                );
                req.flash("alertStatus", "success")
                res.redirect(`/tutor/profile/${id}`)
              })
            })
          })
          .catch(err => {
            req.flash("alertMessage", err.message)
            req.flash("alertStatus", "danger")
            res.redirect(`/tutor/profile/${id}`)
          })
      } else {
        req.flash(
          "alertMessage",
          `Akun Tutor mu tidak ditemukan`
        )
        req.flash("alertStatus", "warning");
        res.redirect("/tutor")
      }
    } else {
      req.flash(
        "alertMessage",
        `Dilarang Melihat Profile Tutor Lainnya!`
      )
      req.flash("alertStatus", "warning");
      res.redirect("/tutor")
    }
  },

  editPassword: async (req, res) => {
    const userLogin = req.session.user;
    const id = req.params.id;

    let { password } = req.body;
    password = bcrypt.hashSync(password, 7);

    if ((userLogin.role === "tutor") && (userLogin.id == id)) {
      await User.findOne({ where: { id: { [Op.eq]: id } } })
        .then(userTutor => {
          return userTutor.update({
            password
          }).then(() => {
            req.flash(
              "alertMessage",
              `Sukses Mengubah Password dengan Username : ${userTutor.username}`
            );
            req.flash("alertStatus", "success")
            res.redirect(`/tutor/profile/${id}`)
          }).catch(err => {
            req.flash("alertMessage", err.message)
            req.flash("alertStatus", "danger")
            res.redirect(`/tutor/profile/${id}`)
          })
        }).catch(err => {
          req.flash("alertMessage", err.message)
          req.flash("alertStatus", "danger")
          res.redirect(`/tutor/profile/${id}`)
        })
    }
  }

};
