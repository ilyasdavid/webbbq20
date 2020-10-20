// const models = require("../models");
const { User } = require("../models");
const Op = require("sequelize").Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  getUsers: (req, res) => {
    if (req.query.name) {
      // let name = req.query.name;
      let name = "Fari";
      User.all({
        where: {
          name: {
            [Op.iLike]: `%${req.query.name}%`
          }
        }
      })
        .then(users => {
          res.status(200).json({
            message: `Get All User where name like ${req.query.name} `,
            users
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });
        });
    } else {
      User.findAll()
        .then(users => {
          res.status(200).json({
            message: "Get All User",
            users
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });
        });
    }
  },
  getUser: (req, res) => {
    const id = req.params.id;
    User.findOne({ where: { id: { [Op.eq]: id } } })
      .then(userFind => {
        if (userFind) {
          res.status(200).json({
            message: "Success Find User",
            data: userFind
          });
        } else {
          res.status(404).json({
            message: "User Not Found!"
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: err.message
        });
      });
  },
  createUser: (req, res) => {
    User.create(req.body)
      .then(user => {
        res.status(200).json({
          message: "Success Created New User",
          data: user
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err.message
        });
      });
  },
  deleteUser: (req, res) => {
    const id = req.params.id;
    User.findOne({ where: { id: { [Op.eq]: id } } })
      .then(user => {
        let userFind = user;
        if (user) {
          return user.destroy().then(user => {
            res.status(200).json({
              message: "Success Deleted an User",
              data: userFind
            });
          });
        } else {
          res.status(404).json({
            message: "Address Not Found!"
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: err.message
        });
      });
  },
  updateUser: (req, res) => {
    const id = req.params.id;
    User.findById(id)
      .then(user => {
        return user.update(req.body);
      })
      .then(user => {
        res.status(200).json({
          message: `Success Updated an User`,
          user
        });
      })
      .catch(err => {
        res.status(404).json({
          message: err.message
        });
      });
  }
};
