import React, { useState , useContext} from "react";
import NoteContext from "./NoteContext";

const NoteState = (props)=>{
    const notesInitial = []

        //fetch all notes 
        const getNotes = async () => {
          try {
            // API Call
            
            const response = await fetch('http://localhost:5000/api/notes/fetchAllNotes', {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY2MDExNTQxMmEyNDZjY2Y5ZWVmNGU3In0sImlhdCI6MTcxNzU3MTkyNH0.Qc8ikUdB0-DrBqTqc3mkPt7qfi8zb0wW-4aKzj_wR8I"
              },
            });
        
            // Check if the response is successful
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            // Parse JSON response
            const data = await response.json();
            console.log(data);
        
            // Assuming setNotes is defined somewhere
            setNotes(data); // Update state with fetched notes
        
          } catch (error) {
            console.error('There was an error!', error);
          }
        }
        
    //Add a note
    const addNote = async ( title, description, tag)=> {
        //todo api call
        //APi Call
        const response = await fetch(`http://localhost:5000/api/notes/addnotes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY2MDExNTQxMmEyNDZjY2Y5ZWVmNGU3In0sImlhdCI6MTcxNzU3MTkyNH0.Qc8ikUdB0-DrBqTqc3mkPt7qfi8zb0wW-4aKzj_wR8I"
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({title, description, tag})
          });
        console.log("Adding a New Note")
        
      const  note = {
            "_id": "6662c9ad1bdf56a95492489e",
            "user": "6662c74c1bdf56a954924896",
            "title": title,
            "description": description,
            "tag": tag,
            "date": "2024-06-07T08:49:49.524Z",
            "__v": 0
        }
        setNotes(notes.concat(note))
    }
    //Delete  a note
    const deleteNote = async (id)=> {

      const response = await fetch(`http://localhost:5000/api/notes/deleteNote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY2MDExNTQxMmEyNDZjY2Y5ZWVmNGU3In0sImlhdCI6MTcxNzU3MTkyNH0.Qc8ikUdB0-DrBqTqc3mkPt7qfi8zb0wW-4aKzj_wR8I"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    console.log("Deleteing a New Note")


        console.log("Deleting Node" +id)
        const newNote = notes.filter((note)=> {return note._id!==id})
        setNotes(newNote);
    }
    //Edit a note
    const editNote = async ( id, title, description, tag, setNotes) => {
      // API Call
      debugger
      const response = await fetch(`http://localhost:5000/api/notes/updateNote/${id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY2MDExNTQxMmEyNDZjY2Y5ZWVmNGU3In0sImlhdCI6MTcxNzU3MTkyNH0.Qc8ikUdB0-DrBqTqc3mkPt7qfi8zb0wW-4aKzj_wR8I"
          },
          body: JSON.stringify({ id, title, description, tag })
      });
      const json = await response.json();
      debugger
      console.log(json)
      // Update notes state
      setNotes(prevNotes => {
          return prevNotes.map(note => {
              if (note._id === id) {
                  return { ...note, title, description, tag };
              } else {
                  return note;
              }
          });
      });
  };
  
    const [notes, setNotes] = useState(notesInitial);
    return(
        <NoteContext.Provider value={{notes, editNote, deleteNote, addNote , getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState