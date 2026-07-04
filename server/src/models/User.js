import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isFirstLogin: { type: Boolean, default: true },
  accessibleCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true })

userSchema.methods.toSafeObject = function () {
  const { password, __v, ...rest } = this.toObject()
  return rest
}

export default mongoose.model('User', userSchema)
