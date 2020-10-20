<h2 align="center">Website BBQ UKMI Ar-Rahman Teknokrat </h2>

Alamat Web:
https://bbq-ukmi-arrahman.herokuapp.com

## Prasyarat
- Sudah terinstall Node.js Minimal Versi 8.0.
- Memiliki RDBMS MySQL atau Postgre.

## Cara Install
1. Masuk ke dalam folder project ini di terminal.
2. Ketikkan perintah `npm install` untuk melakukan pemasangan library yang diperlukan.
3. Pastikan anda sudah menginstall 'sequelize-cli' secara global, kalau belum jalankan perintah ini di terminal `npm install -g sequelize-cli`, perintah ini di gunakan untuk memasang command line interface untuk memudahkan menjalankan ORM yang berkaitan dengan database.
4. Langkah selanjutnya adalah berkaitan dengan database, ada 2 cara untuk memprosesnya : 
1 - Import database dari yang sudah disediakan ke ke `phpmyadmin - bila menggunakan XAMPP` atau ke `PG Admin - bila menggunakan Postgre`.
2 - Lakukan create database, create table, create isi table sample, hanya dengan 1 perintah yaitu : `npm run db_start`.
5. Ketikkan perintah `npm start` untuk menjalankan project Web ini yang menggunakan Node.js dengan Framework Express.js.
6. Lalu, buka browser di alamat 'http://localhost:3100', untuk mengakses web secara local.
7. Selesai.
