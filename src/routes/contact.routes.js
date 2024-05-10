import { Router } from "express";
import controllers from "../controllers/index.js";
const { contactController } = controllers;

const contactRouter = Router();


contactRouter.post('/', contactController.addContact);


export default contactRouter;