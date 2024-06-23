const { Project } = require('../models/projectModel');
const { Task } = require('../models/taskModel');
const mongoose = require('mongoose');

class TaskController {

    // Method untuk membuat Tugas baru di dalam Proyek sesuai dengan Id Proyek
    static async createTask(req, res, next) {
        try {
            // Mengambil Id Project dari parameter
            const { projectId } = req.params;
            // Validasi Id Project
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                throw {
                    name: "InvalidIDProject",
                }
            }
            // Mengambil inputan title, description, startTime, dan endTime dari body
            const { title, description, startTime, endTime } = req.body;

            // Validasi inputan title, startTime, dan endTime
            if (!title) {
                throw {
                    name: "TitleIsEmpty",
                }
            }
            if (!startTime) {
                throw {
                    name: "StartTimeIsEmpty",
                }
            }
            if (!endTime) {
                throw {
                    name: "EndTimeIsEmpty",
                }
            }
            // Mengonversi startTime dan endTime menjadi tipe data Date
            const startTimeDate = new Date(startTime);
            const endTimeDate = new Date(endTime);
            // Validasi startTime lebih awal dari endTime
            if (startTimeDate >= endTimeDate) {
                throw {
                    name: "StartTimeAndEndTimeInvalid",
                }
            }
            // Melihat apakah ada Tugas yang tumpang tindih dengan waktu yang sama
            const overlappingTasks = await Task.find({
                projectId,
                $or: [
                    { startTime: { $lt: endTimeDate }, endTime: { $gt: startTimeDate } }
                ]
            });
            // Validasi Tugas tidak boleh tumpang tindih
            if (overlappingTasks.length > 0) {
                throw {
                    name: "TaskOverlap"
                }
            }
            // Membuat Tugas baru
            const newTask = await Task.create({ projectId, title, description, startTime, endTime });
            // Menambahkan Id Tugas ke dalam Array tasks di Project
            await Project.findByIdAndUpdate(projectId, { $push: { tasks: newTask._id } });
            // Menampilkan pesan sukses dan data Tugas yang baru dibuat
            res.status(201).json({ message: `Task at Project id ${projectId} created successfully`, Task: newTask });
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }

    // Method untuk melihat seluruh Tugas di dalam Proyek sesuai dengan Id Proyek
    static async readTasks(req, res, next) {
        try {
            // Mengambil Id Project dari parameter
            const { projectId } = req.params;
            // Validasi Id Project
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                throw {
                    name: "InvalidIDProject"
                }
            }
            // Menampilkan seluruh Tugas di dalam Proyek sesuai dengan Id Project, termasuk populasi tugas
            const tasks = await Project.findById(projectId).populate('tasks');
            // Validasi Tugas di dalam Proyek sesuai dengan Id Project
            if (!tasks) {
                throw {
                    name: "TaskNotFound"
                }
            }
            // Menampilkan pesan sukses dan data Tugas di dalam Proyek sesuai dengan Id Project
            res.status(200).json({ message: `Task at Project Id ${projectId} `, Task: tasks });
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }

    // Method untuk melihat seluruh Tugas yang sudah selesai di dalam Proyek sesuai dengan Id Proyek
    static async readCompletedTask(req, res, next) {
        try {
            // Mengambil Id Project dari parameter
            const { projectId } = req.params;
            // Validasi Id Project
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                throw {
                    name: "InvalidIDProject"
                }
            }
            // Menampilkan seluruh Tugas yang sudah selesai di dalam Proyek sesuai dengan Id Project
            const tasks = await Task.find({ projectId, completed: true });
            // Validasi Tugas yang sudah selesai di dalam Proyek sesuai dengan Id Project
            if (tasks.length === 0) {
                throw {
                    name: "TaskCompletedNotFound"
                }
            }
            // Menampilkan pesan sukses dan data Tugas yang sudah selesai di dalam Proyek sesuai dengan Id Project
            res.status(200).json({ message: `Tasks at Project Id ${projectId}`, Task: tasks });
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }

    // Method untuk melihat seluruh Tugas yang belum selesai di dalam Proyek sesuai dengan Id Proyek
    static async readUncompletedTask(req, res, next) {
        try {
            // Mengambil Id Project dari parameter
            const { projectId } = req.params;
            // Validasi Id Project
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                throw {
                    name: "InvalidIDProject"
                }
            }
            // Menampilkan seluruh Tugas yang belum selesai di dalam Proyek sesuai dengan Id Project
            const tasks = await Task.find({ projectId, completed: false });
            // Validasi Tugas yang belum selesai di dalam Proyek sesuai dengan Id Project
            if (tasks.length === 0) {
                throw {
                    name: "TaskUncompletedNotFound"
                }
            }
            // Menampilkan pesan sukses dan data Tugas yang belum selesai di dalam Proyek sesuai dengan Id Project
            res.status(200).json({ message: `Tasks at Project Id ${projectId}`, Task: tasks });
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }

    // Method untuk mengupdate Tugas sesuai dengan Id Tugas
    static async updateTask(req, res, next) {
        try {
            // Mengambil Id Tugas dari parameter
            const { id } = req.params;
            // Validasi Id Tugas
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw {
                    name: "InvalidIDTask"
                }
            }
            // Mengambil inputan title, description, startTime, dan endTime dari body
            const { title, description, startTime, endTime } = req.body;
            // Validasi inputan title, startTime, dan endTime
            if (!title) {
                throw {
                    name: "TitleIsEmpty"
                }
            }
            if (!startTime) {
                throw {
                    name: "StartTimeIsEmpty"
                }
            }
            if (!endTime) {
                throw {
                    name: "EndTimeIsEmpty"
                }
            }
            // Menampilkan Tugas sesuai dengan Id Tugas
            const tasks = await Task.findByIdAndUpdate(id);
            // Validasi Tugas sesuai dengan Id Tugas
            if (!tasks) {
                throw {
                    name: "TaskNotFound"
                }
            }
            // Mengonversi startTime dan endTime menjadi tipe data Date
            const startTimeDate = new Date(startTime);
            const endTimeDate = new Date(endTime);

            // Validasi startTime lebih awal dari endTime
            if (startTimeDate >= endTimeDate) {
                throw {
                    name: "StartTimeAndEndTimeInvalid",
                }
            }
            // Melihat apakah ada Tugas lain yang tumpang tindih dengan waktu yang sama
            const overlappingTasks = await Task.find({
                projectId: tasks.projectId,
                _id: { $ne: id }, // Mengecualikan tugas yang sedang diperbarui
                $or: [
                    { startTime: { $lt: endTimeDate }, endTime: { $gt: startTimeDate } }
                ]
            });

            // Validasi Tugas tidak boleh tumpang tindih
            if (overlappingTasks.length > 0) {
                throw {
                    name: "TaskOverlap"
                }
            }
            // Menyimpan data Tugas yang sudah diupdate
            tasks.title = title;
            tasks.description = description;
            tasks.startTime = startTime;
            tasks.endTime = endTime;
            await tasks.save();
            // Menampilkan pesan sukses dan data Tugas yang sudah diupdate
            res.status(200).json({ message: `Task id ${id} success updated`, Task: tasks });
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }

    // Method untuk mengupdate status Tugas menjadi selesai sesuai dengan Id Tugas
    static async updateTaskCompleted(req, res, next) {
        try {
            // Mengambil Id Tugas dari parameter
            const { id } = req.params;
            // Validasi Id Tugas
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw {
                    name: "InvalidIDTask"
                }
            }
            // Menampilkan Tugas sesuai dengan Id Tugas
            const tasks = await Task.findByIdAndUpdate(id);
            // Validasi Tugas sesuai dengan Id Tugas
            if (!tasks) {
                throw {
                    name: "TaskNotFound"
                }
            }
            // Menyimpan status Tugas yang sudah selesai dan menyimpan data Tugas yang sudah diupdate
            tasks.completed = !tasks.completed;
            await tasks.save();

            // Menampilkan pesan sukses dan data Tugas yang sudah diupdate
            res.status(200).json({ message: `Task id ${id} success completed`, Task: tasks });
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }

    // Method untuk menghapus Tugas sesuai dengan Id Tugas
    static async deleteTask(req, res, next) {
        try {
            // Mengambil Id Tugas dari parameter
            const { id } = req.params;
            // Validasi Id Tugas
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw {
                    name: "InvalidIDTask",
                }
            }
            // Menghapus Tugas sesuai dengan Id Tugas
            const tasks = await Task.findByIdAndDelete(id);
            // Validasi Tugas sesuai dengan Id Tugas
            if (!tasks) {
                throw {
                    name: "TaskNotFound"
                }
            }
            // Menampilkan pesan sukses
            res.status(200).json({ message: `Task id ${id} deleted successfully`, Task: tasks});
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }

    static async searchTask(req, res, next) {
        try {
            // Mengambil q dari query
            const { q } = req.query;
            // Validasi q
            if (!q) {
                throw {
                    name: "KeywordIsEmpty"
                }
            }
            // Mencari Tugas sesuai dengan q
            const tasks = await Task.find({
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } }
                ]
            });
            // Validasi Tugas sesuai dengan q
            if (tasks.length === 0) {
                throw {
                    name: "TaskKeywordNotFound"
                }
            }
            // Menampilkan pesan sukses dan data Tugas yang ditemukan
            res.status(200).json({ message: `Tasks found with keyword ${q}`, Task: tasks });
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }
}

module.exports = {
    TaskController
};

