import { createError } from "../utils/error.js";
import models from "../models/index.js";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));


const { Blog } = models;

const blogController = {
    // This controller is to create a new blog
    addBlog: async (req, res, next) => {
        try {
            const imgData = req.file;
            const { title, tags, categories, content } = req.body;
            if (!req.body || !imgData) return next(createError(400, "Some fields are empty"));
            const blog = await Blog.create({
                title: title,
                tags: tags,
                categories: categories,
                content: content,
                img: imgData.filename,
            });

            return res.status(200).json(blog);
        } catch (error) {
            next(error)
        }
    },
    // This controller is to get a blog by id
    getBlog: async (req, res, next) => {
        try {
            const blog = await Blog.findById(req.params.id);
            if (!blog) return next(createError(404, `No blog with given _id: ${req.params.id}`));
            return res.status(200).json(blog);
        } catch (error) {
            next(error)
        }
    },
    // This controller is to get all blogs
    getAllBlogs: async (req, res, next) => {
        try {
            const blogs = await Blog.find();
            if (!blogs || blogs.length === 0) return next(createError(404, "Blog list is empty"));
            return res.status(200).json(blogs);
        } catch (error) {
            next(error)
        }
    },
    // This controller is to update a blog
    updateBlog: async (req, res, next) => {
        try {
            const id = req.params.id;
            const { title, tags, categories, content } = req.body;

            // // Check if the blog already exists
            const blog = await Blog.findById(id);
            if (!blog) return next(createError(404, `No blog with given _id: ${id}`));

            // Update blog fields
            blog.title = title;
            blog.tags = tags;
            blog.categories = categories;
            blog.content = content;

            // Check if there is an img to update
            if (req.file) {

                const filePath = join(CURRENT_DIR, `../../uploads/${blog.img}`);
                if (!fs.existsSync(filePath)) {
                    return res.status(404).json({ error: 'File not found.' });
                }
                fs.unlinkSync(filePath);

                console.log("img updated (deleted from directory) successfully")

                // Upload new img to s3 and then get the url
                blog.img = req.file.filename;
            }

            // Storage updated blog changed
            await blog.save();

            return res.status(200).json(blog);
        } catch (error) {
            next(error);
        }
    },
    // This controller is to delete a blog
    deleteBlog: async (req, res, next) => {
        try {
            const id = req.params.id
            const blog = await Blog.findById(id);
            if (!blog) return next(createError(404, `No blog with given _id: ${id}`));
            if (id.length !== 24) return next(createError(400, "Invalid _id"));
            const filePath = join(CURRENT_DIR, `../../uploads/${blog.img}`);
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'File not found.' });
            }
            fs.unlinkSync(filePath);
            await Blog.findByIdAndRemove(id);
            res.status(200).json(`blog ${id} deleted successfully!`)
        } catch (error) {
            next(error)
        }
    },
    getBlogImg: async (req, res, next) => {
        const { id } = req.params;

        try {
            const blog = await Blog.findById(id);
            if (!blog) {
                return res.status(400).send('blog not found');
            }
            const filePath = join(CURRENT_DIR, `../../uploads/${blog.img}`);
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'Archivo no encontrado.' });
            }

            const readStream = fs.createReadStream(filePath);

            res.setHeader('Content-Type', 'image/*');
            res.setHeader('Content-Disposition', `attachment; filename=${blog.img}`);

            readStream.pipe(res);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error retrieving IMG');
        }
    }
}

export default blogController;