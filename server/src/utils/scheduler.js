import cron from 'node-cron'
import Lesson from '../models/Lesson.js'
import { notifyLessonAvailable } from '../routes/notifications.js'

export async function startScheduler() {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const lessons = await Lesson.find({
        availableAt: { $lte: new Date() },
        notified: false,
      })
      for (const lesson of lessons) {
        await notifyLessonAvailable(lesson._id)
        lesson.notified = true
        await lesson.save()
      }
    } catch (err) {
      console.error('Scheduler error:', err.message)
    }
  })
  console.log('Scheduler started')
}
