import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  order: { type: Number, required: true, default: 1 },
  availableAt: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.model('Lesson', lessonSchema)
