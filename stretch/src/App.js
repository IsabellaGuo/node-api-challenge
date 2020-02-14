import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then((response) => {
        console.log("This is response:", response)
        setProjects(response.data)   dfgdfg
      })
      .catch((error) => {
        console.log("oops", error)
      })
  }, [])

  return (
    <div className="App">
      {
        projects.map((project) => {
          return (
            <div key={project.id}>
              <h1> {project.name} </h1>
              <h3> {project.description} </h3>
            </div>
          )
        })
      }
    </div>
  );
}

export default App;
