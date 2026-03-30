const express = require('express')
const router = express.Router()
const {createNote,getNotes,updateNote,deleteNote} = require('../controllers/noteController')
const {protect} = require('../middlewares/authMiddleware')

router.use(protect)
router.route('/')
.get(getNotes)
.post(createNote)

router.put('/:id',updateNote)
router.delete('/:id',deleteNote)

module.exports = router