import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['lesson', 'quiz'], required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  score: { type: Number },
  passed: { type: Boolean },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true })

progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true, sparse: true })
progressSchema.index({ userId: 1, quizId: 1 })
progressSchema.index({ userId: 1, type: 1, completedAt: -1 })

export default mongoose.model('Progress', progressSchema)
