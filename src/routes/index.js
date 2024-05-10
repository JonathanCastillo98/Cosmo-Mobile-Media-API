import { Router } from "express";
import blogsRouter from "./blog.routes.js";
import authRoutes from "./auth.routes.js";
import postulantRouter from "./postulant.routes.js";
import contactRouter from "./contact.routes.js";

const mainRouter = Router();

mainRouter.use('/blogs', blogsRouter);
mainRouter.use('/auth', authRoutes);
mainRouter.use('/postulants', postulantRouter);
mainRouter.use('/contacts', contactRouter);

mainRouter.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})

export default mainRouter;