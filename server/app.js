const express = require('express')
const app = express()
const authRoute = require('./routes/authRoutes')
const noteRoute = require('./routes/noteRoutes')
app.use(express.json())

app.use('/api/auth',authRoute)
app.use('/api/notes',noteRoute)

module.exports = app