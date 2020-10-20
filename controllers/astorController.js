const { Astor } = require("../models");
const Op = require("sequelize").Op;

module.exports = {
    /* all astor */
    getAstor: (req, res) => {
        Astor.findAll()
            .then(astors => {
                console.log(astors);
                res.render("/admin/astors/index", {
                    astors: astors
                });
            })
            .catch(err => {
                console.log(err);
                res.render("index", { err: err });
            });
    },

    /* redirec ke view astor/tambah.ejs */
    create: (req, res) => {
        res.render('/admin/astor/tambah');
    },

    /* create astor */
    createAstor: (req, res) => {
        let astorFound;
        Astor.create(req.body).then((astor) => {
            astorFound = astor;
            req.flash('alertMessage', `Sukses Menambahkan Data astor dengan nama : ${astorFound.nama}`);
            req.flash('alertStatus', 'success');
            res.redirect('/astor');
        }).catch((err) => {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/astor/tambah');
        });
    },

    /* get single astor */
    findAstor: (req, res) => {
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus };
        const id = req.params.id;
        Astor.findOne({ where: { id: { [Op.eq]: id } } }).then((astor) => {
            res.render('/admin/astor/edit', {
                alert: alert,
                astor: astor
            });
        });
    },

    /* update astor single id */
    editAstor: (req, res) => {
        const id = req.params.id;
        let astorFound;
        Astor.findOne({ where: { id: { [Op.eq]: id } } }).then((astor) => {
            astorFound = astor;
            return astor.update(req.body).then(() => {
                req.flash('alertMessage', `Sukses Mengubah Data astor dengan nama : ${astor.nama}`);
                req.flash('alertStatus', 'success');
                res.redirect('/astor');
            })
        }).catch((err) => {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/astor/edit');
        });
    },

    /* hapus astor single id */
    hapusAstor: (req, res) => {
        let id = req.params.id;
        let astorFound;
        Astor.findOne({ where: { id: { [Op.eq]: id } } }).then((astor) => {
            astorFound = astor;
            return astor.destroy().then(() => {
                req.flash('alertMessage', `Sukses Menghapus Data astor dengan nama : ${astorFound.nama}`);
                req.flash('alertStatus', 'success');
                res.redirect('/admin/astor/edit');
            })
        }).catch((err) => {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.redirect('/astor');
        });
    },

    notFound: (req, res) => {
        res.render('main/notfound');
    }

};
