import mongoose from "mongoose"
const Schema = mongoose.Schema;

const postulantSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    questions: {
        type: [String],
        required: true,
    },
    resume: {
        type: Buffer,
        required: true,
    },
    howMany: {
        type: Number,
    },
    comments: {
        type: String,
    },
});

export const Postulant = mongoose.model('Postulant', postulantSchema);