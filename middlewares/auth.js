const checkAuth = (req, res, next) => {
    if (req.session.user === null | req.session.user === undefined) {
        req.flash('alertMessage', 'Sesi anda telah berakhir! Silahkan Login lagi, Terimakasih.');
        req.flash('alertStatus', 'warning');
        res.redirect('/')
    } else {
        next()
    }
}

module.exports = {
    checkAuth
}