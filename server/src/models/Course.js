import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  icon: { type: String, default: '📚' },
  color: { type: String, default: '#3b82f6' },
}, { timestamps: true })

export default mongoose.model('Course', courseSchema)
