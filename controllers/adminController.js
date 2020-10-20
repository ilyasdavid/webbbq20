const { Mahasiswa, User, Kelas, Dosen, Jurusan, Tutor, Astor, Jadwal, Kelompok, TutorInformasi, AgendaInformasi, BbqInformasi, Nilai, KeahlianTutor, LimitMahasiswa } = require("../models");
const Op = require("sequelize").Op;
const bcrypt = require("bcrypt");

module.exports = {
    home: (req, res) => {
        const userLogin = req.session.user
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const kelompok = ""
        BbqInformasi.findAll()
            .then(informasiBBQ => {
                AgendaInformasi.findAll()
                    .then(informasiAgenda => {
                        res.render("admin/dashboard", {
                            user: userLogin,
                            alert: alert,
                            informasiBBQ: informasiBBQ,
                            informasiAgenda: informasiAgenda,
                        })
                    })
                    .catch(err => {
                        req.flash('alertMessage', err.message)
                        req.flash('alertStatus', 'danger')
                        res.render("admin/dashboard", {
                            user: userLogin,
                            alert: alert,
                            kelompok
                        })
                    })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.render("admin/dashboard", {
                    user: userLogin,
                    alert: alert,
                    kelompok
                })
            })
    },
    viewInMahasiswa: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const userLogin = req.session.user

        try {
            const mahasiswas = await Mahasiswa.findAll({
                include: [
                    {
                        model: Jurusan,
                    },
                    {
                        model: User
                    },
                    {
                        model: Kelas
                    },
                    {
                        model: Dosen
                    }
                ]
            });

            const dosens = await Dosen.findAll();
            const jurusans = await Jurusan.findAll();
            const kelas = await Kelas.findAll({
                include: [
                    { 
                        model: Dosen
                    }
                ]
            });

            res.render("admin/mahasiswa/view", {
                user: userLogin,
                alert: alert,
                mahasiswas: mahasiswas,
                dosens: dosens,
                jurusans: jurusans,
                kelas: kelas,
                action: "view",
                kelompok: ""
            });

        } catch (err) {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.render("admin/mahasiswa/view", {
                user: userLogin,
                action: "view"
            });
        }

        // Mahasiswa.findAll({
        //     include: [
        //         {
        //             model: Jurusan,
        //         },
        //         {
        //             model: User
        //         },
        //         {
        //             model: Kelas
        //         },
        //         {
        //             model: Dosen
        //         }
        //     ]
        // })
        //     .then(mahasiswas => {
        //         Dosen.findAll()
        //             .then(dosens => {
        //                 Jurusan.findAll()
        //                     .then(jurusans => {
        //                         Kelas.findAll()
        //                             .then(kelas => {
        //                                 res.render("admin/mahasiswa/view", {
        //                                     user: userLogin,
        //                                     alert: alert,
        //                                     mahasiswas: mahasiswas,
        //                                     dosens: dosens,
        //                                     jurusans: jurusans,
        //                                     kelas: kelas,
        //                                     action: "view",
        //                                     kelompok: ""
        //                                 });
        //                             })
        //                     })
        //             })
        //     })
        //     .catch(err => {
        //         req.flash('alertMessage', err.message)
        //         req.flash('alertStatus', 'danger')
        //         res.render("admin/mahasiswa/view", {
        //             user: userLogin,
        //             action: "view"
        //         })
        //     })
    },    
    nilaiInMahasiswa: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const userLogin = req.session.user

        try {
            const mahasiswas = await Mahasiswa.findAll({
                include: [
                    {
                        model: Jurusan,
                    },
                    {
                        model: User
                    },
                    {
                        model: Kelas
                    },
                    {
                        model: Dosen
                    }
                ]
            });

            const dosens = await Dosen.findAll();
            const jurusans = await Jurusan.findAll();
            const kelas = await Kelas.findAll({
                include: [
                    { 
                        model: Dosen
                    }
                ]
            });

            res.render("admin/mahasiswa/nilai", {
                user: userLogin,
                alert: alert,
                mahasiswas: mahasiswas,
                dosens: dosens,
                jurusans: jurusans,
                kelas: kelas,
                action: "view",
                kelompok: ""
            });

        } catch (err) {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.render("admin/mahasiswa/nilai", {
                user: userLogin,
                action: "view"
            });
        }
    },
    createMahasiswa: async (req, res) => {
        const {
            nama,
            username,
            email,
            npm,
            tglLahir,
            alamat,
            bacaQuran,
            nomorHp,
            jenisKelamin,
            jadwalKosong,
            KelasId,
            JurusanId,
            DosenId
        } = req.body;

        let { password } = req.body;

        const role = "mahasiswa";
        const status = "nonaktif";
        const isHaveKelompok = "no";

        try {
            password = await bcrypt.hash(password, 7);    
            const files = req.files;

            if (!files) {
                req.flash('alertMessage', "Tidak ada Foto yang di Upload, Segera Pilih Foto!");
                req.flash('alertStatus', 'danger');
                return res.redirect("/register");
            }      

            if (files.foto.mimetype == "image/jpeg" || files.foto.mimetype == "image/png" || files.foto.mimetype == "image/gif") {
                await files.foto.mv("public/foto-peserta-bbq/" + files.foto.name, (err) => {
                if (err) return res.status(500).send(err);
                });
            } else {
                req.flash('alertMessage', "This format is not allowed , please upload file with '.png','.gif','.jpg'");
                req.flash('alertStatus', 'danger');
                return res.redirect("/register");
            }

            const findUsername = await User.findOne({ where: { username: { [Op.eq]: username } } });

            if (findUsername) {
                Mahasiswa.findOne({ where: { npm: { [Op.eq]: npm } } }).then(mahasiswa => {
                    if (mahasiswa) {
                        req.flash('alertMessage', 'Username dan NPM sudah ada yang memakai, silahkan ganti dengan yang lain!');
                        req.flash('alertStatus', 'danger');
                        res.redirect('/admin/mahasiswa/view');
                    } else {
                        req.flash('alertMessage', 'Username sudah ada yang memakai, silahkan ganti dengan yang lain!');
                        req.flash('alertStatus', 'danger');
                        res.redirect('/admin/mahasiswa/view');
                    }
                });
            } else {
                User.create({
                    nama,
                    username,
                    email,
                    password,
                    role
                }).then(user => {
                    const UserId = user.id;
                    Mahasiswa.create({
                        npm,
                        nama,
                        foto: files.foto.name,
                        tglLahir,
                        alamat,
                        bacaQuran,
                        nomorHp,
                        jenisKelamin,
                        jadwalKosong,
                        status,
                        isHaveKelompok,
                        KelasId,
                        JurusanId,
                        DosenId,
                        UserId
                    }).then(() => {
                        req.flash('alertMessage', `Sukses Menambahkan Data Mahasiswa Baru dengan nama : ${nama} dan Username: ${username}`);
                        req.flash('alertStatus', 'success');
                        res.redirect('/admin/mahasiswa/view');
                    })
                        .catch(err => {
                            req.flash('alertMessage', err.message);
                            req.flash('alertStatus', 'danger');
                            res.redirect('/admin/mahasiswa/view');
                        })
                })
                    .catch(err => {
                        req.flash('alertMessage', err.message);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/admin/mahasiswa/view');
                    })
            }
        } catch (err) {
            req.flash('alertMessage', err);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/mahasiswa/view');
        }
    },
    showEditFormMahasiswa: async (req, res) => {
        const idMahasiswa = req.params.id;
        const userLogin = req.session.user;

        try {
            const mahasiswa = await Mahasiswa.findOne({
                where: {
                    id: { [Op.eq]: idMahasiswa }
                },
                include: [
                    {
                        model: Jurusan,
                    },
                    {
                        model: User
                    },
                    {
                        model: Kelas
                    },
                    {
                        model: Dosen
                    }
                ]
            });

            const dosens = await Dosen.findAll();
            const jurusans = await Jurusan.findAll();
            const kelas = await Kelas.findAll();

            res.render("admin/mahasiswa/view", {
                user: userLogin,
                mahasiswa: mahasiswa,
                dosens: dosens,
                jurusans: jurusans,
                kelas: kelas,
                action: "edit"
            });

        } catch (error) {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/mahasiswa/view');
        }
    },

    editMahasiswa: async (req, res) => {
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
        const idMahasiswa = req.params.id;
        const files = req.files;

        try {
            const mahasiswa = await Mahasiswa.findOne({ where: { id: { [Op.eq]: idMahasiswa } } });    
            const userMahasiswa = await User.findOne({ where: { id: { [Op.eq]: mahasiswa.UserId }}});

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
                  return res.redirect("/admin/mahasiswa/view");
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
                    res.redirect("/admin/mahasiswa/view");
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
                  res.redirect("/admin/mahasiswa/view");
                });
              });
            }
        } catch (err) {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/mahasiswa/view");
        }
    },

    editPassword: async (req, res) => {
        const userLogin = req.session.user
        const idMahasiswa = req.params.id
    
        let { password } = req.body
        password = bcrypt.hashSync(password, 7)

        
    
        if (userLogin.role === "admin") {
            try {
                const mahasiswa = await Mahasiswa.findOne({ where: { id: { [Op.eq]: idMahasiswa } } });    
                const userMahasiswa = await User.findOne({ where: { id: { [Op.eq]: mahasiswa.UserId }}});

                return userMahasiswa.update({
                    password
                }).then(() => {
                    req.flash(
                        "alertMessage",
                        `Sukses Mengubah Password dengan Username : ${userMahasiswa.username}`
                );
                    req.flash("alertStatus", "success");
                    res.redirect('/admin/mahasiswa/view');
                }).catch(err => {
                    req.flash("alertMessage", err.message);
                    req.flash("alertStatus", "danger");
                    res.redirect('/admin/mahasiswa/view');
                });

            } catch (err) {
                req.flash("alertMessage", err.message);
                req.flash("alertStatus", "danger");
                res.redirect('/admin/mahasiswa/view');
            }          
        }
      },
    
    deleteMahasiswa: (req, res) => {
        const idMahasiswa = req.params.id
        Mahasiswa.findOne({
            where: {
                id: { [Op.eq]: idMahasiswa } 
            }
        }).then(mahasiswa => {
                return mahasiswa.destroy().then(() => {
                    req.flash('alertMessage', `Sukses Menghapus Data Siswa dengan nama : ${mahasiswa.nama}`)
                    req.flash('alertStatus', 'success')
                    res.redirect("/admin/mahasiswa/view")
                });
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect("/admin/mahasiswa/view")
            });
    },

    statusInMahasiswa: (req, res) => {
        const userLogin = req.session.user
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };

        Mahasiswa.findAll({
            include: [
                {
                    model: Jurusan,
                },
                {
                    model: User
                },
                {
                    model: Kelas
                },
                {
                    model: Dosen
                }
            ]
        })
            .then(mahasiswas => {
                let mahasiswasAktif = mahasiswas.filter(function (mahasiswas) {
                    return mahasiswas.status === 'aktif';
                })
                let mahasiswasNonAktif = mahasiswas.filter(function (mahasiswas) {
                    return mahasiswas.status === 'nonaktif';
                })
                res.render("admin/mahasiswa/status", {
                    user: userLogin,
                    alert: alert,
                    mahasiswasNonAktif: mahasiswasNonAktif,
                    mahasiswasAktif: mahasiswasAktif
                });
            })
            .catch(err => {
                res.render("admin/mahasiswa/status", {
                    err: err
                });
            });
    },
    aktivateStatusPeserta: (req, res) => {
        const idMahasiswa = req.params.id
        let mahasiswaFound
        const status = "aktif"

        Mahasiswa.findOne({ where: { id: { [Op.eq]: idMahasiswa } } })
            .then(mahasiswa => {
                mahasiswaFound = mahasiswa
                return mahasiswa.update({ status }).then(() => {
                    req.flash('alertMessage', `Sukses Mengaktifasi Data Mahasiswa dengan nama : ${mahasiswaFound.nama}`)
                    req.flash('alertStatus', 'success')
                    res.redirect("/admin/mahasiswa/status")
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect("/admin/mahasiswa/status")
            });
    },
    nonAktivateStatusPeserta: (req, res) => {
        const idMahasiswa = req.params.id
        let mahasiswaFound
        const status = "nonaktif"

        Mahasiswa.findOne({ where: { id: { [Op.eq]: idMahasiswa } } })
            .then(mahasiswa => {
                mahasiswaFound = mahasiswa
                return mahasiswa.update({ status }).then(() => {
                    req.flash('alertMessage', `Sukses Menonaktifasi Data Mahasiswa dengan nama : ${mahasiswaFound.nama}`)
                    req.flash('alertStatus', 'success')
                    res.redirect("/admin/mahasiswa/status")
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect("/admin/mahasiswa/status")
            });
    },
    tutorInBBQ: (req, res) => {
        const userLogin = req.session.user
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };

        Tutor.findAll({
            include: [
                {
                    model: User
                }
            ]
        }).then(tutors => {
            res.render("admin/bbq/tutor_bbq", {
                user: userLogin,
                alert: alert,
                tutors: tutors,
                action: "view"
            });
        }).catch(err => {
            req.flash('alertMessage', err.message)
            req.flash('alertStatus', 'danger')
            res.render("admin/bbq/tutor_bbq", {
                user: userLogin,
                action: "view"
            });
        });
    },
    createTutor: async (req, res) => {
        let {
            username,
            password,
            nama,
            jenisKelamin,
            nomorHp,
            email,
        } = req.body;

        console.log(req.body);

        let arrayFields = ["keahlian"];
        let regexString = `^(${arrayFields.join("|")})\\[\\d+\\]`;

        let regex = new RegExp(regexString);

        let newObj = Object.keys(req.body)
        .filter(aKey => regex.test(aKey))
        .reduce((combinedObj, aKey) => {
            let keyName = aKey.match(regex)[1];
            if (!combinedObj[keyName]) {
            combinedObj[keyName] = [];
            }
            combinedObj[keyName].push(req.body[aKey]);
            return combinedObj;
        }, {});

        console.log('Objek Barru');
        console.log(newObj);

        // for (let index = 0; index < newObj.length; index++) {
        //     console.log(newObj[index]);                    
        // }

        // console.log('Objek Barru selesai');


        const role = "tutor"

        password = bcrypt.hashSync(password, 7)

        User.findOne({ where: { username: { [Op.eq]: username } } }).then(findUsername => {
            if (findUsername) {
                req.flash('alertMessage', 'Username sudah ada yang memakai, silahkan ganti dengan yang lain!')
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/bbq/tutor')
            } else {
                User.create({
                    nama,
                    username,
                    email,
                    password,
                    role
                }).then(user => {
                    const UserId = user.id
                    Tutor.create({
                        nama,
                        jenisKelamin,
                        nomorHp,
                        UserId
                    }).then(tutor => {   
                        let keahlian = newObj.keahlian;                    
                        let keahlianSementara = ["Pernah Mengikuti BBQ", "Berakhlak Baik", "Paham Tentang Ilmu Agama", "Paham Makhrojul Huruf Al-Qur'an", "Paham Ilmu Tajwid", "Memiliki Hafalan Al-Qur'an"];                        

                        keahlian.map(async function(keahlian, index) {
                            const row = await KeahlianTutor.create({
                                keahlian: keahlian,
                                IdTutor: tutor.id
                            });
                        });

                        req.flash('alertMessage', `Sukses Menambahkan Data Tutor Baru dengan nama : ${nama} dan Username: ${username}`);
                        req.flash('alertStatus', 'success');
                        return res.redirect('/admin/bbq/tutor');
                    }).catch(err => {
                        req.flash('alertMessage', err.message)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/admin/bbq/tutor')
                    })
                })
                    .catch(err => {
                        req.flash('alertMessage', err.message)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/admin/bbq/tutor')
                    })
            }
        })
    },
    showEditFormTutor: (req, res) => {
        const idTutor = req.params.id
        const userLogin = req.session.user
        Tutor.findOne({
            where: {
                id: { [Op.eq]: idTutor }
            },
            include: [
                {
                    model: User
                }
            ]
        })
            .then(tutor => {
                res.render("admin/bbq/tutor_bbq", {
                    user: userLogin,
                    tutor: tutor,
                    action: "edit"
                });
            })
    },
    editTutor: (req, res) => {
        const idTutor = req.params.id
        let tutorFound

        Tutor.findOne({ where: { id: { [Op.eq]: idTutor } } })
            .then(tutor => {
                tutorFound = tutor
                return tutor.update(req.body).then(() => {
                    req.flash('alertMessage', `Sukses Mengubah Data Tutor dengan nama : ${tutorFound.nama}`)
                    req.flash('alertStatus', 'success')
                    res.redirect("/admin/bbq/tutor")
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect("/admin/bbq/tutor")
            })
    },
    deleteTutor: (req, res) => {
        const idTutor = req.params.id
        Tutor.findOne({ where: { id: { [Op.eq]: idTutor } } })
            .then(tutor => {
                return tutor.destroy().then(() => {
                    req.flash('alertMessage', `Sukses Menghapus Data Tutor dengan nama : ${tutor.nama}`)
                    req.flash('alertStatus', 'success')
                    res.redirect("/admin/bbq/tutor")
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect("/admin/bbq/tutor")
            });
    },
    astorInBBQ: (req, res) => {
        const userLogin = req.session.user
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };

        Astor.findAll()
            .then(astors => {
                res.render("admin/bbq/astor_bbq", {
                    user: userLogin,
                    alert: alert,
                    astors: astors,
                    action: "view"
                });
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.render("admin/bbq/astor_bbq", {
                    user: userLogin,
                    alert: alert,
                    action: "view"
                });
            });
    },
    createAstor: (req, res) => {
        let {
            nama,
            jenisKelamin,
            nomorHp
        } = req.body

        Astor.create({
            nama,
            jenisKelamin,
            nomorHp
        }).then(() => {
            req.flash('alertMessage', `Sukses Menambahkan Data Astor Baru dengan nama : ${nama}`)
            req.flash('alertStatus', 'success')
            res.redirect('/admin/bbq/astor')
        }).catch(err => {
            req.flash('alertMessage', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/bbq/astor')
        })
    },
    showEditFormAstor: (req, res) => {
        const idAstor = req.params.id
        const userLogin = req.session.user
        Astor.findOne({
            where: {
                id: { [Op.eq]: idAstor }
            }
        }).then(astor => {
            res.render("admin/bbq/astor_bbq", {
                user: userLogin,
                astor: astor,
                action: "edit"
            })
        })
    },
    editAstor: (req, res) => {
        const idTutor = req.params.id
        let astorFound

        Astor.findOne({ where: { id: { [Op.eq]: idTutor } } })
            .then(astor => {
                astorFound = astor
                return astor.update(req.body).then(() => {
                    req.flash('alertMessage', `Sukses Mengubah Data Tutor dengan nama : ${astorFound.nama}`)
                    req.flash('alertStatus', 'success')
                    res.redirect("/admin/bbq/astor")
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect("/admin/bbq/astor")
            })
    },
    deleteAstor: (req, res) => {
        const idAstor = req.params.id
        Astor.findOne({ where: { id: { [Op.eq]: idAstor } } })
            .then(astor => {
                return astor.destroy().then(() => {
                    req.flash('alertMessage', `Sukses Menghapus Data Astor dengan nama : ${astor.nama}`)
                    req.flash('alertStatus', 'success')
                    res.redirect("/admin/bbq/astor")
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect("/admin/bbq/astor")
            });
    },    
    jadwalInBBQ: (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const userLogin = req.session.user

        Kelompok.findAll({
            include: [
                {
                    model: Tutor
                },
                {
                    model: Jadwal
                },
                {
                    model: Mahasiswa
                }
            ]
        })
            .then(kelompoks => {
                res.render("admin/kelompok_bbq", {
                    alert: alert,
                    user: userLogin,
                    kelompoks: kelompoks
                });
            })
            .catch(err => {
                res.render("admin/kelompok_bbq", {
                    err: err
                });
            });
    },
    viewIkhwanInKelompokBBQ: (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const userLogin = req.session.user

        Mahasiswa.findAll({
            where: {
                jenisKelamin: { [Op.eq]: 'Pria' },
                isHaveKelompok: { [Op.eq]: 'no' }
            },
            include: [
                {
                    model: Jurusan,
                },
                {
                    model: User
                },
                {
                    model: Kelas
                },
                {
                    model: Dosen
                }
            ]
        })
            .then(mahasiswas => {
                Kelompok.findAll({
                    where: {
                        jenis: { [Op.eq]: 'ikhwan' }
                    },
                    include: [
                        {
                            model: Mahasiswa
                        }
                    ]
                }).then(kelompok => {
                        Tutor.findAll({
                            where: {
                                jenisKelamin: { [Op.eq]: 'Pria' }
                            }
                        })
                            .then(tutor => {
                                Astor.findAll({
                                    where: {
                                        jenisKelamin: { [Op.eq]: 'Pria' }
                                    }
                                })
                                    .then(astor => {
                                        res.render("admin/kelompok_bbq_ikhwan", {
                                            alert: alert,
                                            user: userLogin,
                                            kelompok: kelompok,
                                            tutor: tutor,
                                            astor: astor,
                                            mahasiswas: mahasiswas,
                                            action: "view"
                                        });
                                });
                            });
                    });
            })
            .catch(err => {
                req.flash('alertMessage', err.message);
                req.flash('alertStatus', 'danger');
                res.render("admin/kelompok_bbq_ikhwan", {
                    user: userLogin,
                    action: "view"
                });
            });
    },    
    viewAkhwatInKelompokBBQ: (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const userLogin = req.session.user

        Mahasiswa.findAll({
            where: {
                jenisKelamin: { [Op.eq]: 'Wanita' },
                isHaveKelompok: { [Op.eq]: 'no' }
            },
            include: [
                {
                    model: Jurusan,
                },
                {
                    model: User
                },
                {
                    model: Kelas
                },
                {
                    model: Dosen
                }
            ]
        })
            .then(mahasiswas => {
                Kelompok.findAll({
                    where: {
                        jenis: { [Op.eq]: 'akhwat' }
                    },
                    include: [
                        {
                            model: Mahasiswa
                        }
                    ]
                }).then(kelompok => {
                        Tutor.findAll({
                                    where: {
                                        jenisKelamin: { [Op.eq]: 'Wanita' }
                                    }
                                })
                            .then(tutor => {
                                Astor.findAll({
                                    where: {
                                        jenisKelamin: { [Op.eq]: 'Wanita' }
                                    }
                                })
                                    .then(astor => {
                                        res.render("admin/kelompok_bbq_akhwat", {
                                            alert: alert,
                                            user: userLogin,
                                            kelompok: kelompok,
                                            tutor: tutor,
                                            astor: astor,
                                            mahasiswas: mahasiswas,
                                            action: "view"
                                        });
                                });
                            });
                    });
            })
            .catch(err => {
                req.flash('alertMessage', err.message);
                req.flash('alertStatus', 'danger');
                res.render("admin/kelompok_bbq_akhwat", {
                    user: userLogin,
                    action: "view"
                });
            });
    },
    
    createIkhwanInKelompokBBQ: (req, res) => {
        const {
            namaKelompok,            
            jadwal,
            tempat,
            bacaQuran,
            TutorId,
            AstorId
        } = req.body

        Kelompok.create({
            namaKelompok,
            jenis: 'ikhwan',
            jadwal,
            tempat,
            bacaQuran,
            TutorId,
            AstorId
        }).then(kelompok => {
            req.flash('alertMessage', `Sukses Menambahkan Kelompok BBQ Baru dengan nama : ${kelompok.namaKelompok}`)
            req.flash('alertStatus', 'success')
            res.redirect('/admin/kelompok-bbq/ikhwan')
        }).catch(err => {
            req.flash('alertMessage', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/kelompok-bbq/ikhwan')
        })
    },
    createAkhwatInKelompokBBQ: (req, res) => {
        let {
            namaKelompok,            
            jadwal,
            tempat,
            bacaQuran,
            TutorId,
            AstorId
        } = req.body

        Kelompok.create({
            namaKelompok,
            jenis: 'akhwat',
            jadwal,
            tempat,
            bacaQuran,
            TutorId,
            AstorId
        }).then(kelompok => {
            req.flash('alertMessage', `Sukses Menambahkan Kelompok BBQ Baru dengan nama : ${kelompok.namaKelompok}`)
            req.flash('alertStatus', 'success')
            res.redirect('/admin/kelompok-bbq/akhwat')
        }).catch(err => {
            req.flash('alertMessage', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/kelompok-bbq/akhwat')
        })
    },    

    deleteKelompokBBQIkhwan: (req, res) => {
        const idKelompok = req.params.id
        Kelompok.findOne({ where: { id: { [Op.eq]: idKelompok } } })
            .then(kelompok => {
                return kelompok.destroy().then(() => {
                    req.flash('alertMessage', `Sukses Menghapus Kelompok BBQ Ikhwan dengan nama : ${kelompok.namaKelompok}`)
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/kelompok-bbq/ikhwan')
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/kelompok-bbq/ikhwan')
            });
    },
    
    deleteKelompokBBQAkhwat: (req, res) => {
        const idKelompok = req.params.id
        Kelompok.findOne({ where: { id: { [Op.eq]: idKelompok } } })
            .then(kelompok => {
                return kelompok.destroy().then(() => {
                    req.flash('alertMessage', `Sukses Menghapus Kelompok BBQ Akhwat dengan nama : ${kelompok.namaKelompok}`)
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/kelompok-bbq/akhwat')
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/kelompok-bbq/akhwat')
            });
    },

    viewIkhwanKelompokBBQ: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const userLogin = req.session.user;
        const idKelompok = req.params.id;        

        const kelompok = await Kelompok.findOne({
            where: {
                jenis: { [Op.eq]: 'ikhwan' },
                id: { [Op.eq]: idKelompok }
            },
            include: [
                {
                    model: Mahasiswa
                },
                {
                    model: Tutor,
                },
                {
                    model: Astor,
                }
            ]
        });

        if (kelompok) {
            const mahasiswas = await Mahasiswa.findAll({
            where: {
                jenisKelamin: { [Op.eq]: 'Pria' },
                status: { [Op.eq]: 'aktif' },
                isHaveKelompok: { [Op.eq]: 'no' },
                bacaQuran: { [Op.eq]: kelompok.bacaQuran },
                jadwalKosong: { [Op.eq]: kelompok.jadwal }
            },
            include: [
                {
                    model: Jurusan,
                },
                {
                    model: User
                },
                {
                    model: Kelas
                },
                {
                    model: Dosen
                }
            ]
            });
            res.render("admin/kelompok_bbq_ikhwan_detail", {
                alert: alert,
                user: userLogin,
                kelompok: kelompok,
                mahasiswas,
                action: "view"
            });
        }
    },

    addIkhwanInKelompokBBQ: (req, res) => {        
        const { idKelompok, idMahasiswa } = req.params;
        const isHaveKelompok = "yes";

        Mahasiswa.findOne({ where: { id: { [Op.eq]: idMahasiswa } } })
            .then(mahasiswa => {
                return mahasiswa.update({ 
                        isHaveKelompok,
                        KelompokId: idKelompok
                    }).then(() => {
                        // create nilai siswa
                        Nilai.create({
                            MahasiswaId: mahasiswa.id,
                            KelompokId: idKelompok,
                            KelasId: mahasiswa.KelasId,
                            absensi: 0,
                            mutabaah: 0,
                            mid: 0,
                            kegiatan: 0,
                            uasP: 0,
                            uasT: 0,
                            totalNilai: 0,
                            hm: "E",
                            keterangan: "Sangat Buruk"
                        })
                        .then(() => {
                            req.flash('alertMessage', `Sukses Menambahkan Peserta BBQ dengan Nama : ${mahasiswa.nama}`);
                            req.flash('alertStatus', 'success');
                            res.redirect(`/admin/kelompok-bbq/ikhwan/${idKelompok}`);
                        })
                        .catch(err => {
                            req.flash('alertMessage', err.message);
                            req.flash('alertStatus', 'danger');
                            res.redirect(`/admin/kelompok-bbq/ikhwan/${idKelompok}`);
                        });
                });
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect(`/admin/kelompok-bbq/ikhwan/${idKelompok}`)
            });
    },

    deleteIkhwanInKelompokBBQ: (req, res) => {
        const { idKelompok, idMahasiswa } = req.params;        
        const isHaveKelompok = "no"

        Mahasiswa.findOne({ where: { id: { [Op.eq]: idMahasiswa } } })
            .then(mahasiswa => {
                return mahasiswa.update({ 
                    isHaveKelompok,
                    KelompokId: null
                }).then(() => {
                    Nilai.findOne({
                        where: {
                            MahasiswaId: { [Op.eq]: mahasiswa.id}
                        }
                    })
                    .then(nilaiMahasiswa =>{
                        return nilaiMahasiswa.destroy().then( () => {
                            req.flash('alertMessage', `Sukses Menghapus Peserta BBQ dengan Nama : ${mahasiswa.nama}`)
                            req.flash('alertStatus', 'danger')
                            res.redirect(`/admin/kelompok-bbq/ikhwan/${idKelompok}`)
                        });
                    });
                });
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect(`/admin/kelompok-bbq/ikhwan/${idKelompok}`)
            });
    },
    viewAkhwatKelompokBBQ: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const userLogin = req.session.user;
        const idKelompok = req.params.id;        

        const kelompok = await Kelompok.findOne({
            where: {
                jenis: { [Op.eq]: 'akhwat' },
                id: { [Op.eq]: idKelompok }
            },
            include: [
                {
                    model: Mahasiswa
                },
                {
                    model: Tutor,
                },
                {
                    model: Astor,
                }
            ]
        });

        if (kelompok) {
            const mahasiswas = await Mahasiswa.findAll({
            where: {
                jenisKelamin: { [Op.eq]: 'Wanita' },
                status: { [Op.eq]: 'aktif' },
                isHaveKelompok: { [Op.eq]: 'no' },
                bacaQuran: { [Op.eq]: kelompok.bacaQuran },
                jadwalKosong: { [Op.eq]: kelompok.jadwal }
            },
            include: [
                {
                    model: Jurusan,
                },
                {
                    model: User
                },
                {
                    model: Kelas
                },
                {
                    model: Dosen
                }
            ]
            });
            res.render("admin/kelompok_bbq_akhwat_detail", {
                alert: alert,
                user: userLogin,
                kelompok: kelompok,
                mahasiswas,
                action: "view"
            });            
        }
    },
    addAkhwatInKelompokBBQ: (req, res) => {        
        const { idKelompok, idMahasiswa } = req.params;
        const isHaveKelompok = "yes";

        Mahasiswa.findOne({ where: { id: { [Op.eq]: idMahasiswa } } })
            .then(mahasiswa => {
                return mahasiswa.update({ 
                    isHaveKelompok,
                    KelompokId: idKelompok
                }).then(() => {
                    // create nilai siswa
                    Nilai.create({
                        MahasiswaId: mahasiswa.id,
                        KelompokId: idKelompok,
                        KelasId: mahasiswa.KelasId,
                        absensi: 0,
                        mutabaah: 0,
                        mid: 0,
                        kegiatan: 0,
                        uasP: 0,
                        uasT: 0,
                        totalNilai: 0,
                        hm: "E",
                        keterangan: "Sangat Buruk"
                    })
                    .then(() => {
                        req.flash('alertMessage', `Sukses Menambahkan Peserta BBQ dengan Nama : ${mahasiswa.nama}`);
                        req.flash('alertStatus', 'success');
                        res.redirect(`/admin/kelompok-bbq/akhwat/${idKelompok}`);
                    })
                    .catch(err => {
                        req.flash('alertMessage', err.message);
                        req.flash('alertStatus', 'danger');
                        res.redirect(`/admin/kelompok-bbq/ikhwan/${idKelompok}`);
                    });
                });
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect(`/admin/kelompok-bbq/akhwat/${idKelompok}`)
            });
    },
    deleteAkhwatInKelompokBBQ: (req, res) => {
        const { idKelompok, idMahasiswa } = req.params;        
        const isHaveKelompok = "no"

        Mahasiswa.findOne({ where: { id: { [Op.eq]: idMahasiswa } } })
            .then(mahasiswa => {                
                return mahasiswa.update({ 
                        isHaveKelompok,
                        KelompokId: null
                    }).then(() => {
                        Nilai.findOne({
                            where: {
                                MahasiswaId: { [Op.eq]: mahasiswa.id}
                            }
                        })
                        .then(nilaiMahasiswa =>{
                            return nilaiMahasiswa.destroy().then( () => {
                                req.flash('alertMessage', `Sukses Menghapus Peserta BBQ dengan Nama : ${mahasiswa.nama}`)
                                req.flash('alertStatus', 'danger')
                                res.redirect(`/admin/kelompok-bbq/akhwat/${idKelompok}`)
                            });
                        });
                });
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect(`/admin/kelompok-bbq/akhwat/${idKelompok}`)
            });
    },

    showEditFormKelompokBBQIkhwan: async (req, res) => {
        const idKelompok = req.params.idKelompok;
        const userLogin = req.session.user;

        try {            
            const kelompok = await Kelompok.findOne({
                where: {
                    id: { [Op.eq]: idKelompok }
                },
                include: [
                    { model: Tutor },
                    { model: Astor }
                ]
            });

            const tutor = await Tutor.findAll({
                where: {
                    jenisKelamin: { [Op.eq]: 'Pria' }
                }
            });
            
            const astor = await Astor.findAll({
                where: {
                    jenisKelamin: { [Op.eq]: 'Pria' }
                }
            });

            res.render("admin/kelompok_bbq_ikhwan", {
                user: userLogin,
                kelompok,
                tutor,
                astor,
                action: "edit"
            });

        } catch (error) {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/kelompok-bbq/ikhwan');
        }
    },

    editKelompokBBQIkhwan: (req, res) => {
        const idKelompok = req.params.idKelompok;
        Kelompok.findOne({
            where: {
                id: { [Op.eq]: idKelompok } 
            }
        }).then( kelompok => {
            return kelompok.update(req.body).then(() => {
                req.flash('alertMessage', `Sukses Mengubah Data Kelompok dengan nama : ${kelompok.namaKelompok}`);
                req.flash('alertStatus', 'success');
                res.redirect('/admin/kelompok-bbq/ikhwan');
            });
        }).catch(err => {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/kelompok-bbq/ikhwan');
        });
    },

    editKelompokBBQAkhwat: (req, res) => {
        const idKelompok = req.params.idKelompok;
        Kelompok.findOne({
            where: {
                id: { [Op.eq]: idKelompok } 
            }
        }).then( kelompok => {
            return kelompok.update(req.body).then(() => {
                req.flash('alertMessage', `Sukses Mengubah Data Kelompok dengan nama : ${kelompok.namaKelompok}`);
                req.flash('alertStatus', 'success');
                res.redirect('/admin/kelompok-bbq/akhwat');
            });
        }).catch(err => {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/kelompok-bbq/akhwat');
        });
    },

    showEditFormKelompokBBQAkhwat: async (req, res) => {
        const idKelompok = req.params.idKelompok;
        const userLogin = req.session.user;

        try {
            const kelompok = await Kelompok.findOne({
                where: {
                    id: { [Op.eq]: idKelompok }
                },
                include: [
                    { model: Tutor },
                    { model: Astor }
                ]
            });

            const tutor = await Tutor.findAll({
                where: {
                    jenisKelamin: { [Op.eq]: 'Wanita' }
                }
            });
            
            const astor = await Astor.findAll({
                where: {
                    jenisKelamin: { [Op.eq]: 'Wanita' }
                }
            });

            res.render("admin/kelompok_bbq_akhwat", {
                user: userLogin,
                kelompok,
                tutor,
                astor,
                action: "edit"
            });

        } catch (error) {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/kelompok-bbq/akhwat');
        }
    },

    informasiBBQ: (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const userLogin = req.session.user

        BbqInformasi.findAll()
            .then(informasiBBQ => {
                res.render("admin/informasi/informasi_bbq", {
                    user: userLogin,
                    alert: alert,
                    informasiBBQ: informasiBBQ,
                    action: "view"
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.render("admin/informasi/informasi_bbq", {
                    user: userLogin,
                    alert: alert,
                    action: "view"
                })
            })
    },
    createInformasiBBQ: (req, res) => {
        let {
            judul,
            deskripsi
        } = req.body

        BbqInformasi.create({
            judul,
            deskripsi
        }).then(informasiBBQ => {
            req.flash('alertMessage', `Sukses Menambahkan Informasi BBQ Baru dengan judul : ${informasiBBQ.judul}`)
            req.flash('alertStatus', 'success')
            res.redirect('/admin/informasi/bbq')
        }).catch(err => {
            req.flash('alertMessage', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/informasi/bbq')
        })
    },
    showEditFormInformasiBBQ: (req, res) => {
        const idInformasiBBQ = req.params.id
        const userLogin = req.session.user
        BbqInformasi.findOne({
            where: {
                id: { [Op.eq]: idInformasiBBQ }
            }
        }).then(informasiBBQ => {
            res.render("admin/informasi/informasi_bbq", {
                user: userLogin,
                informasiBBQ: informasiBBQ,
                action: "edit"
            })
        })
    },
    editInformasiBBQ: (req, res) => {
        const idInformasiBBQ = req.params.id
        BbqInformasi.findOne({ where: { id: { [Op.eq]: idInformasiBBQ } } })
            .then(informasiBBQ => {
                return informasiBBQ.update(req.body).then(() => {
                    req.flash('alertMessage', `Sukses Mengubah Informasi BBQ dengan judul : ${informasiBBQ.judul}`)
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/informasi/bbq')
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/informasi/bbq')
            })
    },
    deleteInformasiBBQ: (req, res) => {
        const idInformasiBBQ = req.params.id
        BbqInformasi.findOne({ where: { id: { [Op.eq]: idInformasiBBQ } } })
            .then(informasiBBQ => {
                return informasiBBQ.destroy().then(() => {
                    req.flash('alertMessage', `Sukses Menghapus Informasi BBQ dengan judul : ${informasiBBQ.judul}`)
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/informasi/bbq')
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/informasi/bbq')
            });
    },
    informasiAgenda: (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const userLogin = req.session.user

        AgendaInformasi.findAll()
            .then(informasiAgenda => {
                res.render("admin/informasi/informasi_agenda", {
                    user: userLogin,
                    alert: alert,
                    informasiAgenda: informasiAgenda,
                    action: "view"
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.render("admin/informasi/informasi_agenda", {
                    user: userLogin,
                    alert: alert,
                    action: "view"
                })
            })
    },
    createInformasiAgenda: (req, res) => {
        let {
            judul,
            deskripsi
        } = req.body

        AgendaInformasi.create({
            judul,
            deskripsi
        }).then(informasiAgenda => {
            req.flash('alertMessage', `Sukses Menambahkan Informasi Agenda Baru dengan judul : ${informasiAgenda.judul}`)
            req.flash('alertStatus', 'success')
            res.redirect('/admin/informasi/agenda')
        }).catch(err => {
            req.flash('alertMessage', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/informasi/agenda')
        })
    },
    showEditFormInformasiAgenda: (req, res) => {
        const idInformasiAgenda = req.params.id
        const userLogin = req.session.user
        AgendaInformasi.findOne({
            where: {
                id: { [Op.eq]: idInformasiAgenda }
            }
        }).then(informasiAgenda => {
            res.render("admin/informasi/informasi_agenda", {
                user: userLogin,
                informasiAgenda: informasiAgenda,
                action: "edit"
            })
        })
    },
    editInformasiAgenda: (req, res) => {
        const idInformasiAgenda = req.params.id
        AgendaInformasi.findOne({ where: { id: { [Op.eq]: idInformasiAgenda } } })
            .then(informasiAgenda => {
                return informasiAgenda.update(req.body).then(() => {
                    req.flash('alertMessage', `Sukses Mengubah Informasi Agenda dengan judul : ${informasiAgenda.judul}`)
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/informasi/agenda')
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/informasi/agenda')
            })
    },
    deleteInformasiAgenda: (req, res) => {
        const idInformasiAgenda = req.params.id
        AgendaInformasi.findOne({ where: { id: { [Op.eq]: idInformasiAgenda } } })
            .then(informasiAgenda => {
                return informasiAgenda.destroy().then(() => {
                    req.flash('alertMessage', `Sukses Menghapus Informasi Agenda dengan judul : ${informasiAgenda.judul}`)
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/informasi/agenda')
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/informasi/agenda')
            });
    },
    informasiTutor: (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const userLogin = req.session.user;

        TutorInformasi.findAll()
            .then(informasiTutor => {
                res.render("admin/informasi/informasi_tutor", {
                    user: userLogin,
                    alert: alert,
                    informasiTutor: informasiTutor,
                    action: "view"
                });
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.render("admin/informasi/informasi_tutor", {
                    user: userLogin,
                    alert: alert,
                    action: "view"
                })
            })
    },
    createInformasiTutor: (req, res) => {
        let {
            judul,
            deskripsi
        } = req.body

        TutorInformasi.create({
            judul,
            deskripsi
        }).then(informasiTutor => {
            req.flash('alertMessage', `Sukses Menambahkan Informasi Tutor Baru dengan judul : ${informasiTutor.judul}`)
            req.flash('alertStatus', 'success')
            res.redirect('/admin/informasi/tutor')
        }).catch(err => {
            req.flash('alertMessage', err.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/informasi/tutor')
        })
    },
    showEditFormInformasiTutor: (req, res) => {
        const idInformasiTutor = req.params.id;
        const userLogin = req.session.user;
        TutorInformasi.findOne({
            where: {
                id: { [Op.eq]: idInformasiTutor }
            }
        }).then(informasiTutor => {
            res.render("admin/informasi/informasi_tutor", {
                user: userLogin,
                informasiTutor: informasiTutor,
                action: "edit"
            })
        })
    },
    editInformasiTutor: (req, res) => {
        const idInformasiTutor = req.params.id
        TutorInformasi.findOne({ where: { id: { [Op.eq]: idInformasiTutor } } })
            .then(informasiTutor => {
                return informasiTutor.update(req.body).then(() => {
                    req.flash('alertMessage', `Sukses Mengubah Informasi Tutor dengan judul : ${informasiTutor.judul}`)
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/informasi/tutor')
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/informasi/tutor')
            })
    },
    deleteInformasiTutor: (req, res) => {
        const idInformasiTutor = req.params.id
        TutorInformasi.findOne({ where: { id: { [Op.eq]: idInformasiTutor } } })
            .then(informasiTutor => {
                return informasiTutor.destroy().then(() => {
                    req.flash('alertMessage', `Sukses Menghapus Informasi Tutor dengan judul : ${informasiTutor.judul}`)
                    req.flash('alertStatus', 'success')
                    res.redirect('/admin/informasi/tutor')
                })
            })
            .catch(err => {
                req.flash('alertMessage', err.message)
                req.flash('alertStatus', 'danger')
                res.redirect('/admin/informasi/tutor')
            });
    },

    nilaiMahasiswaPerKelas: async (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const userLogin = req.session.user;

        const kelas = await Kelas.findOne({
            where: {
                id: {[Op.eq]: req.params.idKelas}
            }
        });

        const RaportKelas = await Nilai.findAll({
            where: {
                KelasId: {[Op.eq]: req.params.idKelas}
            },
            include: [
                {
                    model: Mahasiswa
                }
            ]
        });

        res.render("admin/mahasiswa/nilai_raport_kelas", {
            user: userLogin,
            alert: alert,
            kelas: kelas,
            RaportKelas: RaportKelas,
        });
        
    },
    
    actionViewLimitMahasiswa: async (req, res) => {
        try {
            const user = req.session.user;
            const limitMahasiswa = await LimitMahasiswa.findAll({
                include: [{ 
                    model: Kelas,
                    include: [{
                        model: Dosen
                    }]
                }]
            });
            const kelas = await Kelas.findAll();

            return res.render("admin/limit-mahasiswa/view", {
                user,
                kelas,
                limitMahasiswa
            });
        } catch (error) {
            console.log(error);
        }
    },
    
    actionCreate: async (req, res) => {
        const { npm, nama, KelasId } = req.body;
        await LimitMahasiswa.create({
            npm,
            nama,            
            KelasId
        }).then(() => {
            res.redirect('/admin/mahasiswa/limit-mahasiswa');
        }).catch(error => {
            console.log(error);
        });


    },

    actionUpdate: async (req, res) => {
        const { idMahasiswa, npm, nama, KelasId } = req.body;

        try {
            const updateLimitMahasiswa = await LimitMahasiswa.findOne({
                where: {
                  id: { [Op.eq]: idMahasiswa }
                }
              })
            
              if (updateLimitMahasiswa) {
                updateLimitMahasiswa.npm = npm
                updateLimitMahasiswa.nama = nama
                updateLimitMahasiswa.KelasId = KelasId
                await updateLimitMahasiswa.save()
                return res.redirect('/admin/mahasiswa/limit-mahasiswa');
              }
        } catch (error) {
            console.log(error);
            res.redirect('/admin/mahasiswa/limit-mahasiswa');
        }
    },

    actionDelete: async (req, res) => {
        const { idMahasiswa } = req.params;

        try {
            const updateLimitMahasiswa = await LimitMahasiswa.findOne({
                where: {
                  id: { [Op.eq]: idMahasiswa }
                }
              })
            
              if (updateLimitMahasiswa) {
                updateLimitMahasiswa.destroy().then(() => {
                    return res.redirect('/admin/mahasiswa/limit-mahasiswa');
                });
              }
        } catch (error) {
            console.log(error);
            res.redirect('/admin/mahasiswa/limit-mahasiswa');
        }
    },

}