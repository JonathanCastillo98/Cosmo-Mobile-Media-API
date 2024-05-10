import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import { createError } from "../utils/error.js";
import dotenv from 'dotenv';

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;
const {Admin} = models;

const authController = {
    register:async (req, res, next) => {
        try {
            const {password} = req.body;
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const newAdmin = await Admin.create({
                ...req.body,
                password:hash,
            });

            await newAdmin.save();
            res.status(200).json("Admin has been created.")
        } catch (error) {
            next(error)
        }
    },
    login:async (req, res, next) => {
        try {
            const admin = await Admin.findOne({username:req.body.username})

            if(!admin) return next(createError(404, "User doesn't exist!"))

            const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password)
            if(!isPasswordCorrect) return next(createError(400, "Wrong password or username!"))


            const token = jwt.sign({username: admin.username}, JWT_SECRET)
          
            res.status(200).json({token})
        } catch (error) {
            next(error)
        }
    },
}

export default authController;