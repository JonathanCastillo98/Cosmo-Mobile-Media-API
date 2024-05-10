import mongoose from "mongoose"
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  categories: {
    type: [String],
    required: true
  },
  content: {
    type: [Object],
    required: true
  },
  img: {
    type: String,
    required: true
  },
}, { timestamps: true });

export const Blog = mongoose.model('Blog', blogSchema);