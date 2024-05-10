import { Router } from "express";
import controllers from "../controllers/index.js";
import verifyToken from "../middlewares/verifyToken.js";
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

const { blogController } = controllers;

// Configuración de Multer
const MIMETYPES = ["image/jpeg", "image/jpg", "image/png"]

const upload = multer({
    storage: multer.diskStorage({
        destination: join(CURRENT_DIR, '../../uploads'),
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    }),
    fileFilter: (req, file, cb) => {
        if (MIMETYPES.includes(file.mimetype)) cb(null, true)
        else cb(new Error(`Only ${MIMETYPES.join('')} mimetypes are allowed`))
    },

})

const blogsRouter = Router();

blogsRouter.get('/', blogController.getAllBlogs);
blogsRouter.get('/:id', blogController.getBlog);
blogsRouter.get('/:id/blogImg', blogController.getBlogImg);
blogsRouter.post('/', upload.single('img'), verifyToken, blogController.addBlog);
blogsRouter.put('/:id', upload.single('img'), verifyToken, blogController.updateBlog);
blogsRouter.delete('/:id', verifyToken, blogController.deleteBlog);


export default blogsRouter;