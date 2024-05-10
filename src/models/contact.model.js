import mongoose from "mongoose"
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    msg: {
        type: String,
        required: true,
    },

});

export const Contact = mongoose.model('Contact', contactSchema);