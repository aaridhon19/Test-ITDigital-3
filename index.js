const express = require("express");
const { connectDB } = require("./config/connectDb");
const app = express();
const port = process.env.PORT || 4000 ;
const projectRoutes = require("./routers/projectRouter");
const taskRoutes = require("./routers/taskRouter");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const responseTime = require("./middlewares/responseTime");

// Menggunakan cors untuk dapat diakses oleh domain lain
app.use(cors());

// Menggunakan middleware untuk membaca request dari client
app.use(express.urlencoded({ extended: false }));

// Menggunakan middleware untuk membaca request dalam bentuk JSON
app.use(express.json());

// Menggunakan middleware responseTime untuk mencatat waktu respon
app.use(responseTime);

// Menghubungkan ke database MongoDB
connectDB();

// Menggunakan router dari projectRoutes
app.use('/projects', projectRoutes);

// Menggunakan router dari taskRoutes
app.use('/', taskRoutes);

// Menggunakan middleware errorHandler
app.use(errorHandler)

// Menjalankan server pada port 4000
app.listen(port, () => {
    console.log(`Server running on Port : ${port}`);
});

module.exports = app;