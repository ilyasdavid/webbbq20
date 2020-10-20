const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = {
  signup: (req, res) => {
    const { nama, password, username, email } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    // cek apakah username sudah ada ?
    User.findOne({ where: { username: username } }).then(findUsername => {
      if (findUsername) {
        res.status(403).json({ message: "Username sudah terpakai" });
      } else {
        User.create({
          nama: nama,
          username: username,
          email: email,
          password: hashPassword,
          role: "mahasiswa"
        })
          .then(user => {
            res.status(201).json({
              message: "Success Sign Up New User Mahasiswa",
              data: user
            });
          })
          .catch(err => {
            res.status(500).json({
              message: "Email sudah terpakai"
            });
          });
      }
    });
  },
  signin: (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    User.findOne({
      where: {
        username: username
      }
    })
      .then(user => {
        if (user != null) {
          const checkLogin = bcrypt.compareSync(password, user.password);
          if (checkLogin) {
            var token = jwt.sign({ user: user }, "key_rahasia");
            if (token) {
              res.status(200).json({
                message: "Success Sign In",
                data: { token: token, user: { role: user.role } }
              });
            }
          } else {
            res.status(200).json({
              message: "Failed Sign In"
            });
          }
        } else {
          res.status(403).json({ message: "Invalid Sign In" });
        }
      })
      .catch(err => {
        res.status(200).json({
          message: err.message
        });
      });
  }
};
