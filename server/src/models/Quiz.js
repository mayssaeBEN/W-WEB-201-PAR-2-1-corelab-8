import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswers: [{ type: String, required: true }],
}, { _id: true })

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true, trim: true },
  passingScore: { type: Number, required: true, min: 0, max: 100, default: 70 },
  questions: [questionSchema],
}, { timestamps: true })

export default mongoose.model('Quiz', quizSchema)
