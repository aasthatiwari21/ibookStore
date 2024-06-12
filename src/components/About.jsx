import React from 'react'
import noteContext from '../context/notes/NoteContext'
const About = () => {
  const a = useContext(noteContext)
  useEffect(()=> {
    a.update()
  },[])
  return (
    <div>
      This is About {a.state.name} , {a.state.age}, {a.state.education}
    </div>
  )
}

export default About
