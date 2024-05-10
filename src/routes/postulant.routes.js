import { Router } from "express";
import controllers from "../controllers/index.js";
import verifyToken from "../middlewares/verifyToken.js";
import multer from "multer";
const { postulantController } = controllers;

// Configuración de Multer
const upload = multer();

const postulantRouter = Router();

postulantRouter.get('/', verifyToken, postulantController.getPostulants);
postulantRouter.get('/:id', verifyToken, postulantController.getPostulant);
postulantRouter.get('/:id/resume', verifyToken, postulantController.getPostulantResume);
postulantRouter.post('/', upload.single('resume'), postulantController.addPostulant);


export default postulantRouter;

