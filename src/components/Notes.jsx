import React, { useContext, useEffect, useRef, useState } from 'react';
import noteContext from '../context/notes/NoteContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote';

const Notes = () => {
  const context = useContext(noteContext);
  const { notes, getNotes , editNote} = context;

  const [currentNote, setCurrentNote] = useState({ id: '', title: '', description: '', tag: '' });

  useEffect(() => {
    getNotes();
    // Adding `getNotes` as a dependency might cause infinite loop if `getNotes` is not memoized
  }, []); // [] means it runs only once after the initial render

  const ref = useRef(null);
  const refClose = useRef(null);
  const updateNote = (note) => {
    setCurrentNote(note);
    ref.current.click();
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log("Updating a note here")
    editNote(currentNote._id, currentNote.title, currentNote.description, currentNote.tag)
    refClose.current.click();
    // Save the changes to the note here
  };

  const onChange = (e) => {
    setCurrentNote({ ...currentNote, [e.target.id]: e.target.value });
  };

  return (
    <>
      <AddNote />
      <button
        ref={ref}
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
        style={{ display: 'none' }} // Hide the button
      >
        Open Modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label><br />
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={currentNote.title}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label><br />
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={currentNote.description}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">Tag</label><br />
                  <input
                    type="text"
                    className="form-control"
                    id="tag"
                    value={currentNote.tag}
                    onChange={onChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" ref={refClose}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleClick}>Edit Notes</button>
            </div>
          </div>
        </div>
      </div>

      <div className='row my-3'>
        {notes.map((note) => (
          <NoteItem key={note._id} updateNote={updateNote} note={note} />
        ))}
      </div>
    </>
  );
};

export default Notes;
