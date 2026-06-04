const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 4242
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/corelab_lms'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

// Middlewares
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}))

app.use(express.json())

// Route de test
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Corelab API is running'
  })
})

// Route de santé pour vérifier l'API + MongoDB
app.get('/api/health', (req, res) => {
  res.status(200).json({
    api: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// Route inconnue
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  })
})

// Connexion MongoDB puis lancement du serveur
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  })