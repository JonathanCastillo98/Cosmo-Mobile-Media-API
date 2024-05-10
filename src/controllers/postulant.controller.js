import models from "../models/index.js";
import { createError } from "../utils/error.js";
import transporter from "../utils/mailer.js";

const { Postulant } = models;

const postulantController = {
    // This controller is to create a new Postulant
    addPostulant: async (req, res, next) => {
        try {
            const postulantVerify = await Postulant.find({
                email: req.body.email
            });
            if (postulantVerify.length = 0) return next(createError(400, "The email aready exists in database, please try with another one"));
            const resumeData = req.file.buffer;
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: "drivers@cosmomobilemedia.com",
                subject: `RECRUITMENT PROCESS - ${req.body.username}`,
                text: `${req.body.username} has been postulated, check it out`,
                html: `<p>${req.body.username} has been postulated, check it out</p> <br />
            <p>${req.body.comments}</p>
            `,
                attachments: [{ filename: `Resume_${req.body.username}.pdf`, content: resumeData }],
            })

            await transporter.sendMail({
                from: process.env.EMAIL,
                to: req.body.email,
                subject: `RECRUITMENT PROCESS - ${req.body.username}`,
                text: `You have been postulated successfully`,
                html: `<p>You have been postulated successfully, Thank you for applying to Cosmo, we look forward to work with you!</p>`,
            })

            // Guardar los datos en MongoDB usando Mongoose
            const postulant = await Postulant.create({
                username: req.body.username,
                email: req.body.email,
                questions: req.body.questions,
                resume: resumeData,
                howMany: req.body.howMany,
                comments: req.body.comments,
            });

            return res.status(200).send(postulant);
        } catch (error) {
            next(error)
        }
    },
    getPostulants: async (req, res, next) => {
        try {
            const postulants = await Postulant.find();
            if (!postulants) return next(createError(404, "Postulant list is empty"));
            res.status(200).json(postulants);
        } catch (error) {
            next(error)
        }
    },
    getPostulant: async (req, res, next) => {
        try {
            const postulant = await Postulant.findById(req.params.id);
            if (!postulant) return next(createError(404, "Postulant not found"));
            res.status(200).json(postulant);
        } catch (error) {
            next(error)
        }
    },
    getPostulantResume: async (req, res, next) => {
        const { id } = req.params;

        try {
            const postulant = await Postulant.findById(id);

            if (!postulant) {
                return res.status(400).send('Postulant not found');
            }

            res.set('Content-Type', 'application/pdf');
            res.send(postulant.resume);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error retrieving PDF');
        }
    },
}

export default postulantController;