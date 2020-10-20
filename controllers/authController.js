const bcrypt = require("bcrypt");
const Op = require("sequelize").Op;
const { User, Mahasiswa, LimitMahasiswa } = require("../models");

module.exports = {
  signup: async (req, res) => {
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

      // Proses Pembatasan Peserta BBQ, Mahasiswa yang boleh daftar hanya yang sedang ngambil matkul agama.      

      const mahasiswaRegister = await LimitMahasiswa.findOne({
        where: {
          npm: { [Op.eq]: npm }
        }
      });

      if(!mahasiswaRegister){
        // mahasiswa yang gak boleh daftar
        req.flash('alertMessage', "Akun dengan NPM ini Tidak diperbolehkan mendaftar di Sistem, silahkan hubungi Admin!");
        req.flash('alertStatus', 'danger');
        return res.redirect("/register");
      } else {
        // mahasiswa yang boleh daftar
        const findUsername = await User.findOne({
          where: {
            [Op.or]: [
              {
                username: { [Op.eq]: username },
              },
              {
                email: { [Op.eq]: email }
              }
            ]
          }
        });
        
        const mahasiswa = await Mahasiswa.findOne({ 
          where: { 
            npm: { [Op.eq]: npm } 
          } 
        });
        
        if (!files) {
          req.flash('alertMessage', "Tidak ada Foto yang di Upload, Segera Pilih Foto!");
          req.flash('alertStatus', 'danger');
          return res.redirect("/register");
        }      
  
        if (files.foto.mimetype == "image/jpeg" || files.foto.mimetype == "image/png" || files.foto.mimetype == "image/jpg") {
          await files.foto.mv("public/foto-peserta-bbq/" + files.foto.name, (err) => {
            if (err) return res.status(500).send(err);
          });
        } else {
          req.flash('alertMessage', "This format is not allowed , please upload file with '.png','.gif','.jpg'");
          req.flash('alertStatus', 'danger');
          return res.redirect("/register");
        }
  
        if (findUsername) {
          if (mahasiswa) {
            if (username == findUsername.username && email == findUsername.email) {
              req.flash('alertMessage', 'Username, Email dan NPM sudah ada yang memakai, silahkan ganti dengan yang lain!');
              req.flash('alertStatus', 'danger');
              return res.redirect("/register");
            } else if (username == findUsername.username) {
              req.flash('alertMessage', 'Username dan NPM sudah ada yang memakai, silahkan ganti dengan yang lain!');
              req.flash('alertStatus', 'danger');
              return res.redirect("/register");
            } else if (email == findUsername.email) {
              req.flash('alertMessage', 'Email dan NPM sudah ada yang memakai, silahkan ganti dengan yang lain!');
              req.flash('alertStatus', 'danger');
              return res.redirect("/register");
            }
          }
  
          if (username == findUsername.username && email == findUsername.email) {
            req.flash('alertMessage', 'Username dan Email sudah ada yang memakai, silahkan ganti dengan yang lain!');
            req.flash('alertStatus', 'danger');
            return res.redirect("/register");
          } else if (username == findUsername.username) {
            req.flash('alertMessage', 'Username sudah ada yang memakai, silahkan ganti dengan yang lain!');
            req.flash('alertStatus', 'danger');
            return res.redirect("/register");
          } else if (email == findUsername.email) {
            req.flash('alertMessage', 'Email sudah ada yang memakai, silahkan ganti dengan yang lain!');
            req.flash('alertStatus', 'danger');
            return res.redirect("/register");
          }
        } else {        
          if (mahasiswa) {
            req.flash('alertMessage', 'NPM sudah ada yang memakai, silahkan ganti dengan yang lain!');
            req.flash('alertStatus', 'danger');
            return res.redirect("/register");
          } else {
            User.create({
              nama,
              username,
              email,
              password,
              role,
            }).then(user => {
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
                UserId: user.id
              }).then(() => {
                req.flash('alertMessage', `Sukses Menambahkan Data Mahasiswa Baru dengan nama : ${nama} dan Username: ${username}, Silahkan Login Kembali!`);
                req.flash('alertStatus', 'success');
                res.redirect("/bbq");
              }).catch(err => {
                req.flash('alertMessage', err.parent.detail);
                req.flash('alertStatus', 'danger');
                res.redirect("/register");
              });
            }).catch(err => {
              req.flash('alertMessage', err.parent.detail);
              req.flash('alertStatus', 'danger');
              res.redirect("/register");
            });
          }
        }
      }            
    } catch (err) {
      req.flash('alertMessage', err);
      req.flash('alertStatus', 'danger');
      res.redirect("/register");
    }        
  },

  signin: async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username: { [Op.eq]: username } } });

    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword) {
        
        req.session.user = {
          id: user.id,
          username: user.username,
          nama: user.nama,
          role: user.role,
          email: user.email,          
        }

        if (user.role === "admin") {
          res.redirect("/admin");
        } else if (user.role === "mahasiswa") {
          res.redirect("/mahasiswa");
        } else if (user.role === "tutor") {
          res.redirect("/tutor");
        }
      } else {
        req.flash("alertMessage", "Password yang kamu masukkan salah!");
        req.flash("alertStatus", "danger");
        res.redirect("/bbq");
      }
    } else {
      req.flash("alertMessage", "Username yang kamu masukkan tidak ada!");
      req.flash("alertStatus", "danger");
      res.redirect("/bbq");
    }
  },

  signout: (req, res) => {
    req.session.destroy(function (err) {
      // cannot access session here
      if (err) {
        console.log(err);
      } else {
        res.redirect("/bbq");
      }
    });
  }
};
