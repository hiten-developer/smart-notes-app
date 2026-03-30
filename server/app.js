const express = require('express')
const cors = require('cors')
const app = express()
const authRoute = require('./routes/authRoutes')
const noteRoute = require('./routes/noteRoutes')
app.use(express.json())
app.use(cors())
app.use('/api/auth',authRoute)
app.use('/api/notes',noteRoute)

module.exports = app