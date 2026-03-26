const express = require('express')
const app = express()
const authRoute = require('./routes/authRoutes')
app.use(express.json())

app.use('/api/auth',authRoute)

module.exports = app