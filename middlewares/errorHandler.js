// Middleware untuk menangani error yang terjadi pada aplikasi
const errorHandler = (err, req, res, next) => {
    switch (err.name) {
        // Error ID Project tidak valid
        case "InvalidIDProject":
            res.status(400).json({ message: "Invalid Project ID" });
            break;

        // Error ID Tugas tidak valid
        case "InvalidIDTask":
            res.status(400).json({ message: "Invalid Task ID" });
            break;

        // Error Ketika Name Project Kosong
        case "NameIsEmpty":
            res.status(400).json({ message: "Name Project cannot be Empty" });
            break;

        // Error Ketika Title Tugas Kosong
        case "TitleIsEmpty":
            res.status(400).json({ message: "Title Task cannot be Empty" });
            break;

        // Error Ketika Start Time Tugas Kosong
        case "StartTimeIsEmpty":
            res.status(400).json({ message: "Start Time Task cannot be Empty" });
            break;

        // Error Ketika End Time Tugas Kosong
        case "EndTimeIsEmpty":
            res.status(400).json({ message: "End Time Task cannot be Empty" });
            break;

        // Error Ketika Pencarian Keyword Tugas Kosong
        case "KeywordIsEmpty":
            res.status(400).json({ message: "Keyword cannot be Empty" });
            break;

        // Error Ketika Start Time lebih besar dari End Time
        case "StartTimeAndEndTimeInvalid":
            res.status(400).json({ message: "Start Time must be earlier than End Time for the Task" });
            break;

        // Error Ketika Tugas saling tumpang tindih
        case "TaskOverlap":
            res.status(400).json({ message: "Task should not Overlap" });
            break;

        // Error Ketika Project tidak ditemukan
        case "ProjectNotFound":
            res.status(404).json({ message: "Project Not Found" });
            break;

        // Error Ketika Tugas tidak ditemukan
        case "TaskNotFound":
            res.status(404).json({ message: "Task Not Found" });
            break;

        // Error Ketika Tugas yang sudah selesai tidak ditemukan
        case "TaskCompletedNotFound":
            res.status(404).json({ message: "Task Completed Not Found" });
            break;

        // Error Ketika Tugas yang belum selesai tidak ditemukan
        case "TaskUncompletedNotFound":
            res.status(404).json({ message: "Task Uncompleted Not Found" });
            break;

        // Error Ketika Tugas tidak ditemukan dengan keyword
        case "TaskKeywordNotFound":
            res.status(404).json({ message: "Task Not Found with that keyword" });
            break;

        // Internal Server Error
        default:
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
            break;
    }
};

module.exports = errorHandler;
