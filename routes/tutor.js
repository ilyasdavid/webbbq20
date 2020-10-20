var express = require("express");
var router = express.Router();

let tutorController = require("../controllers/tutorController");
const { checkAuth } = require("../middlewares/auth");

router.use(checkAuth)

router.get("/", tutorController.home);

router.get("/nilaiMahasiswas/:id", tutorController.getNilaiMahasiswas);
router.post("/nilaiMahasiswa", tutorController.simpanNilaiMahasiswa);

router.get("/peserta", function (req, res, next) {
  res.render("tutor/peserta");
});

router.get("/nilai", function (req, res, next) {
  res.render("tutor/nilai");
});

router.get("/keahlian", function (req, res, next) {
  res.render("tutor/keahlian");
});

router.get("/profile/:id", tutorController.findTutorProfileMine);
router.get("/profile/edit/:id", tutorController.showEditFormProfileTutor);
router.post("/profile/edit/:id", tutorController.editTutor);
router.post("/profile/edit-password/:id", tutorController.editPassword);

module.exports = router;
