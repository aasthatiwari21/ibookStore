const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// GET all the notes, login required
router.get('/fetchAllNotes', fetchUser, async (req, res) => {
    try {
        debugger
        const notes = await Note.find({ user: req.user.id });
        res.send(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// POST add notes, login required
router.post('/addnotes', fetchUser, [
    body('title', "Enter a valid title").isLength({ min: 3 }).not().isEmpty().withMessage('Title cannot be empty'),
    body('description', "Enter a description which is at least 5 characters").isLength({ min: 5 }).not().isEmpty().withMessage('Description cannot be empty')
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id
        });
        const saveNote = await note.save();
        res.send(saveNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



router.put('/updateNote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return after sending response
    }

    const newNote = {};
    if (title) { newNote.title = title; }
    if (description) { newNote.description = description; }
    if (tag) { newNote.tag = tag; }

    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found"); // Return after sending response
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed"); // Return after sending response
        }

        const Newnote = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        return res.json(Newnote); // Return after sending response
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error"); // Return after sending response
    }
});
router.delete('/deleteNote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    //Find the Note and Delete it 
    try{
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found"); // Return after sending response
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed"); // Return after sending response
        }

        note = await Note.findByIdAndDelete(req.params.id);
        return res.json({"Note": "Note Has been Deleted", note: note}); // Return after sending response
    }catch (error) {
            console.error(error.message);
            return res.status(500).send("Internal Server Error"); // Return after sending response
        }
});

module.exports = router;
