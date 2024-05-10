import models from "../models/index.js";
import { createError } from "../utils/error.js";
import transporter from "../utils/mailer.js";

const { Contact } = models;

const contactController = {
    // This controller is to create a new contact
    addContact: async (req, res, next) => {
        try {
            const contactVerify = await Contact.find({
                email: req.body.email
            });
            if (contactVerify.length = 0) return next(createError(400, "The email aready exists in database, please try with another one"));
            // Guardar los datos en MongoDB usando Mongoose
            const contact = await Contact.create(req.body);
            await transporter.sendMail({
                from: process.env.EMAIL,
                to: "drivers@cosmomobilemedia.com",
                subject: `Contact MSG - ${req.body.name}`,
                html: `<p>Name: ${req.body.name}</p> 
                        <br />
                        <p>Email: ${req.body.email}</p>
                        <br />
                        <p>Comments: ${req.body.msg}</p>
                `,
            })

            await transporter.sendMail({
                from: process.env.EMAIL,
                to: req.body.email,
                subject: `Contact MSG - ${req.body.name}`,
                text: `Your message was sent successfully`,
                html: `<p>Your message was sent successfully, Thank you for contacting us!</p>`,
            })


            return res.status(200).send(contact);
        } catch (error) {
            next(error)
        }
    },
}

export default contactController;