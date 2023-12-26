const {Router} = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {NoteModel} = require("../models/Note.model")


const notesController = Router();

notesController.get("/", async(req, res)=>{
    const notes = await NoteModel.find({userId: req.body.userId})
    res.send(notes)
})


notesController.post("/create", async(req, res)=>{
    const {Heading, Note, Tag, userId} = req.body;
    const note = new NoteModel ({
     Heading,
     Note,
     Tag,
     userId
    })
    try {
        await note.save()
        res.send("notes created")
    } catch (error) {
        res.send("something went wrong")
    }
    
})

notesController.delete("/delete/:noteId", async (req, res)=>{
    const {noteId} = req.params
    const deleteNote = await NoteModel.findByIdAndDelete({_id: noteId})
    res.send("deleted" )
})

notesController.patch("/edit/:noteId", async (req, res)=>{
    const {noteId} = req.params
    const updateNote = await NoteModel.findByIdAndUpdate({_id: noteId, userId : req.body.userId}, {...req.body})
    if(updateNote){
    res.send("update" )
    }else{
        res.send("couldn't update")
    }
})



module.exports = {notesController}