const { Project } = require('../models/projectModel');
const mongoose = require('mongoose');

class ProjectController {

    // Method untuk membuat Project baru
    static async createProject(req, res, next) {
        try {
            // Mengambil inputan name dan description dari body
            const { name, description } = req.body;
            // Validasi inputan name
            if (!name) {
                throw {
                    name: "NameIsEmpty",
                }
            }

            // Membuat Project baru
            const newProject = await Project.create({ name, description });

            // Menampilkan pesan sukses dan data Project yang baru dibuat
            res.status(201).json({ message: 'Project created successfully', Project: newProject });
        } catch (error) {
            // Menampilkan pesan error 
            next(error)
        }
    }

    // Method untuk melihat seluruh Project
    static async readProjects(req, res, next) {
        try {
            // Menampilkan seluruh Project yang ada
            const projects = await Project.find().populate('tasks');

            // Menampilkan data Project
            res.status(200).json(projects);
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }

    // Method untuk melihat Project sesuai dengan Id Project
    static async readProjectById(req, res, next) {
        try {
            // Mengambil Id Project dari parameter
            const { id } = req.params;
            // Validasi Id Project
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw {
                    name: "InvalidIDProject",
                }
            }
            // Menampilkan Project sesuai dengan Id Project
            const projects = await Project.findById(id).populate('tasks');
            // Validasi Project sesuai dengan Id Project
            if (!projects) {
                throw {
                    name: "ProjectNotFound"
                }
            }
            // Menampilkan data Project sesuai dengan Id Project dan pesan sukses
            res.status(200).json({ message: `Project with id ${id}`, Project: projects });
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }

    // Method untuk mengupdate Project sesuai dengan Id Project
    static async updateProject(req, res, next) {
        try {
            // Mengambil Id Project dari parameter
            const { id } = req.params;
            // Validasi Id Project
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw {
                    name: "InvalidIDProject",
                }
            }
            // Mengambil inputan name dan description dari body
            const { name, description } = req.body;
            // Validasi inputan name
            if (!name) {
                throw {
                    name: "NameIsEmpty",
                }
            }
            // Mengupdate Project sesuai dengan Id Project
            const projects = await Project.findByIdAndUpdate(id);
            // Validasi Project sesuai dengan Id Project
            if (!projects) {
                throw {
                    name: "ProjectNotFound"
                }
            }
            // Menyimpan data Project yang sudah diupdate
            projects.name = name;
            projects.description = description;
            await projects.save();
            // Menampilkan pesan sukses dan data Project yang sudah diupdate
            res.status(200).json({ message: `Project with id ${id} successfully updated`, project: projects });
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }

    // Method untuk menghapus Project sesuai dengan Id Project
    static async deleteProject(req, res, next) {
        try {
            // Mengambil Id Project dari parameter
            const { id } = req.params;
            // Validasi Id Project
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw {
                    name: "InvalidIDProject",
                }
            }
            // Menghapus Project sesuai dengan Id Project
            const projects = await Project.findByIdAndDelete(id);
            // Validasi Project sesuai dengan Id Project
            if (!projects) {
                throw {
                    name: "ProjectNotFound"
                }
            }
            // Menampilkan pesan sukses dan data Project yang sudah dihapus
            res.status(200).json({ Project: projects, message: `Project id ${id} success deleted` });
        } catch (error) {
            // Menampilkan pesan error
            next(error)
        }
    }
}

module.exports = {
    ProjectController
};