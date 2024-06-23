// Middleware untuk mencatat waktu respon untuk setiap permintaan
function responseTime(req, res, next) {
    // Mengambil waktu saat permintaan mulai diproses
    const startHrTime = process.hrtime();

    // Menangkap event 'finish' pada response
    res.on('finish', () => {
        // Menghitung selisih waktu antara waktu awal dan waktu selesai
        const elapsedHrTime = process.hrtime(startHrTime);
        // Mengonversi waktu yang telah berlalu ke dalam ms
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        // Mencetak informasi permintaan dan waktu respons
        console.log(`Method : ${req.method}, URL : ${req.url}, Status : [${res.statusCode}], Time : ${elapsedTimeInMs} ms`);
    });

    // Melanjutkan ke middleware berikutnya
    next();
}

module.exports = responseTime;
