const Note = require('../models/Note')

const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;


        const notes = await Note.create({
            title: title,
            content: content,
            userId: userId
        })

        return res.status(201).json({
            message: "Note Created Successfully",
            note: notes
        })

    }
    catch (err) {
        return res.status(500).json({
            message: "Server Err",
            err_msg: err.message
        })
    }
}

const getNotes = async (req, res) => {
    try {
        const id = req.user.id;

        const notes = await Note.find({userId : id})
        return res.status(200).json({
            message: "All Notes Are:",
            count: notes.length,
            notes: notes
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Server Err",
            err_msg: err.message
        })
    }
}

const updateNote = async (req, res) => {
    try{
        const noteId = req.params.id;
        const userId = req.user.id
        const {title,content} = req.body;

       
        const note = await Note.findById(noteId)
        if(!note){
            return res.status(404).json({
                message : "Note is Not Found!"
            })
        }

         if(note.userId.toString() !== userId){
            return res.status(401).json({
                message : "Not authorized."
            })
        }
        const updatedNote = await Note.findByIdAndUpdate(noteId,{title,content},{new:true})
        return res.status(200).json({
            message : "Note is Updated",
            updated_note : updatedNote
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Server Err",
            err_msg: err.message
        })
    }
}

const deleteNote = async (req, res) => {
    try{
        const noteId = req.params.id
        const userId = req.user.id;

        const note = await Note.findById(noteId)
        if(!note){
            return res.status(404).json({
                message : "Note is Not Found!"
            })
        }

        if(note.userId.toString() !== userId){
            return res.status(401).json({
                message : "Not Authorized.."
            })
        }

        const deletedNote = await Note.findByIdAndDelete(noteId)

        return res.status(200).json({
            message : "Note is Deleted..",
            deleted_note : deletedNote
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Server Err",
            err_msg: err.message
        })
    }
}

module.exports = {createNote,getNotes,updateNote,deleteNote}