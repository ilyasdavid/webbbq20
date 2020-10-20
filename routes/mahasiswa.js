const express = require("express");
const router = express.Router();

const mahasiswaController = require("../controllers/mahasiswaController");
const { checkAuth } = require("../middlewares/auth");

router.use(checkAuth);

router.get("/", mahasiswaController.home);

router.get("/profile/:id", mahasiswaController.findMahasiswaProfileMine);

router.get("/profile/edit/:id", mahasiswaController.showEditFormProfileMahasiswa);

router.post("/profile/edit/:id", mahasiswaController.editMahasiswa);

router.post("/profile/edit-password/:id", mahasiswaController.editPassword);

router.get("/jadwal/:id", mahasiswaController.jadwalKelompokBBQ);

router.get("/tutor/:id", mahasiswaController.tutorProfileBBQ);

router.get("/nilai/:id", mahasiswaController.nilaiBBQMahasiswa);

router.get("/cetak-registrasi/:id", mahasiswaController.showFormCetakRegistrasi);

module.exports = router;
