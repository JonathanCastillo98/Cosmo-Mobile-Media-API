import { Router } from 'express';
import controllers from '../controllers/index.js'
const { authController } = controllers;

const authRoutes = Router();

authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);

export default authRoutes;