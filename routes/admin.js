let express = require("express")
let router = express.Router()
let adminController = require("../controllers/adminController")
const { checkAuth } = require("../middlewares/auth")

router.use(checkAuth)
router.get("/", adminController.home)
// Mahasiswa
router.get("/mahasiswa/view", adminController.viewInMahasiswa)
router.get("/mahasiswa/nilai", adminController.nilaiInMahasiswa)
router.post("/mahasiswa/create", adminController.createMahasiswa)
router.get("/mahasiswa/edit/:id", adminController.showEditFormMahasiswa)
router.post("/mahasiswa/edit/:id", adminController.editMahasiswa)
router.post("/mahasiswa/edit-password/:id", adminController.editPassword)
router.get("/mahasiswa/delete/:id", adminController.deleteMahasiswa)

router.get("/mahasiswa/status", adminController.statusInMahasiswa)
router.get("/mahasiswa/aktifasi/:id", adminController.aktivateStatusPeserta)
router.get("/mahasiswa/nonaktifasi/:id", adminController.nonAktivateStatusPeserta)

router.get("/mahasiswa/nilai-kelas/:idKelas", adminController.nilaiMahasiswaPerKelas)

router.get("/status-mahasiswa", function (req, res, next) {
  res.render("admin/status-mahasiswa");
});

// BBQ
router.get("/bbq/tutor", adminController.tutorInBBQ)
router.post("/tutor/create", adminController.createTutor)
router.get("/tutor/edit/:id", adminController.showEditFormTutor)
router.post("/tutor/edit/:id", adminController.editTutor)
router.get("/tutor/delete/:id", adminController.deleteTutor)

router.get("/bbq/astor", adminController.astorInBBQ)
router.post('/astor/create', adminController.createAstor)
router.get("/astor/edit/:id", adminController.showEditFormAstor)
router.post("/astor/edit/:id", adminController.editAstor)
router.get("/astor/delete/:id", adminController.deleteAstor)

router.get("/bbq/jadwal", adminController.jadwalInBBQ)

// router.get("/kelompok-bbq", adminController.jadwalInBBQ);
router.get("/kelompok-bbq/ikhwan", adminController.viewIkhwanInKelompokBBQ);
router.get("/kelompok-bbq/akhwat", adminController.viewAkhwatInKelompokBBQ);
router.post("/kelompokbbq_ikhwan/create", adminController.createIkhwanInKelompokBBQ);
router.post("/kelompokbbq_akhwat/create", adminController.createAkhwatInKelompokBBQ);
router.get("/kelompokbbq_ikhwan/delete/:id", adminController.deleteKelompokBBQIkhwan);
router.get("/kelompokbbq_akhwat/delete/:id", adminController.deleteKelompokBBQAkhwat);

router.get("/kelompok-bbq/ikhwan/:id", adminController.viewIkhwanKelompokBBQ);
router.get("/kelompok-bbq/ikhwan/:idKelompok/add-peserta/:idMahasiswa", adminController.addIkhwanInKelompokBBQ);
router.get("/kelompok-bbq/ikhwan/:idKelompok/delete-peserta/:idMahasiswa", adminController.deleteIkhwanInKelompokBBQ);
router.get("/kelompok-bbq/akhwat/:id", adminController.viewAkhwatKelompokBBQ);
router.get("/kelompok-bbq/akhwat/:idKelompok/add-peserta/:idMahasiswa", adminController.addAkhwatInKelompokBBQ);
router.get("/kelompok-bbq/akhwat/:idKelompok/delete-peserta/:idMahasiswa", adminController.deleteAkhwatInKelompokBBQ);

router.get("/kelompok-bbq/ikhwan/edit/:idKelompok", adminController.showEditFormKelompokBBQIkhwan);
router.post("/kelompok-bbq/ikhwan/edit/:idKelompok", adminController.editKelompokBBQIkhwan);
router.get("/kelompok-bbq/akhwat/edit/:idKelompok", adminController.showEditFormKelompokBBQAkhwat);
router.post("/kelompok-bbq/akhwat/edit/:idKelompok", adminController.editKelompokBBQAkhwat);

router.get("/informasi/bbq", adminController.informasiBBQ)
router.post("/informasi_bbq/create", adminController.createInformasiBBQ)
router.get("/informasi_bbq/edit/:id", adminController.showEditFormInformasiBBQ)
router.post("/informasi_bbq/edit/:id", adminController.editInformasiBBQ)
router.get("/informasi_bbq/delete/:id", adminController.deleteInformasiBBQ)

router.get("/informasi/agenda", adminController.informasiAgenda)
router.post("/informasi_agenda/create", adminController.createInformasiAgenda)
router.get("/informasi_agenda/edit/:id", adminController.showEditFormInformasiAgenda)
router.post("/informasi_agenda/edit/:id", adminController.editInformasiAgenda)
router.get("/informasi_agenda/delete/:id", adminController.deleteInformasiAgenda)

router.get("/informasi/tutor", adminController.informasiTutor)
router.post("/informasi_tutor/create", adminController.createInformasiTutor)
router.get("/informasi_tutor/edit/:id", adminController.showEditFormInformasiTutor)
router.post("/informasi_tutor/edit/:id", adminController.editInformasiTutor)
router.get("/informasi_tutor/delete/:id", adminController.deleteInformasiTutor)

router.get("/mahasiswa/limit-mahasiswa", adminController.actionViewLimitMahasiswa)
router.post("/mahasiswa/limit-mahasiswa/create", adminController.actionCreate)
router.post("/mahasiswa/limit-mahasiswa/update", adminController.actionUpdate)
router.get("/mahasiswa/limit-mahasiswa/delete/:idMahasiswa", adminController.actionDelete)

////// Wait ////////////

router.get("/jadwal/input", function (req, res, next) {
  res.render("admin/jadwal-input");
});

router.get("/kelompok-jadwal-kosong", function (req, res, next) {
  res.render("admin/kelompok-jadwal-kosong");
});

router.get("/kelompok-jadwal-peserta", function (req, res, next) {
  res.render("admin/kelompok-jadwal-peserta");
});

router.get("/informasi-bbq", function (req, res, next) {
  res.render("admin/informasi-bbq");
});

router.get("/informasi-agenda", function (req, res, next) {
  res.render("admin/informasi-agenda");
});

router.get("/informasi-tutor", function (req, res, next) {
  res.render("admin/informasi-tutor");
});

module.exports = router;
