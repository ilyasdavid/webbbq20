var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
// const layouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require('express-session');
const fileUpload = require("express-fileupload");

var indexRouter = require("./routes/index");
// Define routes view server
let authRouter = require("./routes/auth");
let userRouter = require("./routes/user");
let dosenRouter = require("./routes/dosen");
let kelasRouter = require("./routes/kelas");
let jurusanRouter = require("./routes/jurusan");
let nilaiRouter = require("./routes/nilai");
let astorRouter = require("./routes/astor");
let kelompokRouter = require("./routes/kelompok");

let mahasiswaRouter = require("./routes/mahasiswa");
let tutorRouter = require("./routes/tutor");
let adminRouter = require("./routes/admin");

// Define routes api
let indexRouterApi = require("./routes/indexApi");

var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// app.use(layouts);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: {} }));
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
// membuat dependency (package) admin-lte di dalam node_modules menjadi static dan bisa di akses
app.use(
  "/script-adminlte",
  express.static(path.join(__dirname, "/node_modules/admin-lte/"))
);

app.use(function (req, res, next) {
  res.locals.stuff = {
    url: req.originalUrl
  }
  next();
});

app.use(fileUpload());

// rute view server
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/dosen", dosenRouter);
app.use("/kelas", kelasRouter);
app.use("/jurusan", jurusanRouter);
app.use("/nilai", nilaiRouter);
app.use("/tutor", tutorRouter);
app.use("/astor", astorRouter);
app.use("/kelompok", kelompokRouter);

// mahasiswa
app.use("/mahasiswa", mahasiswaRouter);
app.use("/tutor", tutorRouter);
app.use("/admin", adminRouter);

// rute API web services
app.use("/api/v1", indexRouterApi);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/dosen", dosenRouter);
app.use("/api/v1/kelas", kelasRouter);
app.use("/api/v1/jurusan", jurusanRouter);
app.use("/api/v1/mahasiswa", mahasiswaRouter);
app.use("/api/v1/nilai", nilaiRouter);
app.use("/api/v1/tutor", tutorRouter);
app.use("/api/v1/astor", astorRouter);
app.use("/api/v1/kelompok", kelompokRouter);

// all routes | rute api dan view server gabung
// pending

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
