const mongoose = require('mongoose');
const { Schema }= mongoose
const NotesSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        unique: true,
        default: "general"
    },
    description:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now        
    }
});

module.exports = mongoose.model("user", NotesSchema);