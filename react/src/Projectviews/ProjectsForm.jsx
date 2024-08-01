import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client";


export default function ProjectsForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [project, seProject] = useState({
      id: null,
      name: '',
      description: '',
      manager_id: '',
      status: '',
      start_date: '',
      end_date: '',
  })
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()
  useEffect(() => {
  
    getUsers();
 
    console.log("users data:",users);

}, [])
  if (id) {
      useEffect(() => {
     
          setLoading(true)
          axiosClient.get(`/users/${id}`)
              .then(({data}) => {
                  setLoading(false)
                  seProject(data)
              })
              .catch(() => {
                  setLoading(false)
              })
      }, [])
  }
  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/users')
        .then(({ data }) => {
          setLoading(false)
          const managers = data.data.filter(user => user.role === 'manager');
            setUsers(managers);

        })
        .catch(() => {
            setLoading(false)
        })
}
  const onSubmit = ev => {
      
      ev.preventDefault()
      if (project.id) {
          axiosClient.put(`/projects/${project.id}`, project)
              .then(() => {
                  setNotification('Project was successfully updated')
                  navigate('/projects')
              })
              .catch(err => {
                  const response = err.response;
                  if (response && response.status === 422) {
                      setErrors(response.data.errors)
                  }
              })
      } else {
          console.log('Updating project with data:', project);
          axiosClient.post('/projects', project)
              .then(() => {
                  setNotification('project was successfully created')
                  navigate('/projects')
              })
              .catch(err => {
                  const response = err.response;
                  if (response && response.status === 422) {
                      setErrors(response.data.errors)
                  }
              })
      }
  }

  return (
      <>
          {project.id && <h1>Update project: {project.name}</h1>}
          {!project.id && <h1>New project</h1>}
          <div className="card animated fadeInDown">
              {loading && (
                  <div className="text-center">
                      Loading...
                  </div>
              )}
              {errors &&
                  <div className="alert">
                      {Object.keys(errors).map(key => (
                          <p key={key}>{errors[key][0]}</p>
                      ))}
                  </div>
              }
              {!loading && (
                  <form onSubmit={onSubmit} style={{ alignItems: 'normal' }}>
                     <div className="form-group">
                                 <label >Name:</label>
                      <input value={project.name} onChange={ev => seProject({...project, name: ev.target.value})} placeholder="Name"/>
                      </div>
                      <div className="form-group">
                                 <label >Descripion:</label>
                      <input value={project.description} onChange={ev => seProject({...project, description: ev.target.value})} placeholder="description"/>
                      </div>
                      <div className="form-group">
                                 <label >Manager:</label>
                      <select  className="select-room" value={project.manager_id}
                                onChange={ev => seProject({...project, manager_id: ev.target.value})}>
                            <option value="" className="select-room">Manager</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} - {user.group}
                                </option>
                            ))}
                        </select>
                        </div>
                        <div className="form-group">
                                 <label >Status :</label>
                        <select className="select-room" value={project.group} onChange={ev => seProject({...project, status: ev.target.value})}>
                        <option value="" className="select-room">Status</option>
                          <option value="Completed">Completed</option>
                          <option value="ToDo">ToDo</option>
                          <option value="Backlog">Backlog</option>
                          <option value="InReview">InReview</option>
                      </select>
                      </div>
                      <div className="form-group">
                                 <label >Start_Date:</label>
                      <input type="datetime-local" value={project.start_date}
                               onChange={ev => seProject({...project, start_date: ev.target.value})}
                               placeholder="start_date"/>
                                 </div>
                                 <div className="form-group">
                                 <label >End_Date:</label>
                        <input type="datetime-local" value={project.end_date}
                               onChange={ev => seProject({...project, end_date: ev.target.value})}
                               placeholder="end_date"/>
                                   </div>
                 
                      
                      <button className="btn-add">Save</button>
                  </form>
              )}
          </div>
      </>
  )
}

