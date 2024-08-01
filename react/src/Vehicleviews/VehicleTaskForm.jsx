import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client";


export default function VehicleTaskForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [task, seTaskes] = useState({
      id: null,
      start_date: '',
      end_date: '',
      vehicle_id: '',
      user_id: '',
      start_point: '',
      end_point: '',
      description: '',
      status: '',
    
  })
  const [users, setUsers] = useState([]);
  const[vehicles,setVehicle]=useState([]);
 
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()
  useEffect(() => {
  
    getUsers();
    getVehicle();
    console.log("users data:",users);
    console.log("Vehicul;e data:",vehicles);

}, [])
  if (id) {
      useEffect(() => {
     
          setLoading(true)
          axiosClient.get(`/tasks/${id}`)
              .then(({data}) => {
                  setLoading(false)
                  seTaskes(data)
              })
              .catch(() => {
                  setLoading(false)
              })
      }, [])
  }
  const getVehicle = () => {
    setLoading(true)
    axiosClient.get('/vehicles')
        .then(({ data }) => {
          setLoading(false)
          setVehicle(data.data);
       

        })
        .catch(() => {
            setLoading(false)
        })
}
const getUsers = () => {
    setLoading(true)
    axiosClient.get('/users')
        .then(({ data }) => {
          setLoading(false)
          const managers = data.data.filter(user => user.role === 'choufeur');
            setUsers(managers);

        })
        .catch(() => {
            setLoading(false)
        })
}
  const onSubmit = ev => {
      
      ev.preventDefault()
      if (task.id) {
        console.log("le taaske est:",task)
          axiosClient.put(`/vehiculetasks/${task.id}`, task)
              .then(() => {
                  setNotification('task was successfully updated')
                  navigate('/vehiculetasks')
              })
              .catch(err => {
                  const response = err.response;
                  if (response && response.status === 422) {
                      setErrors(response.data.errors)
                  }
              })
      } else {
          console.log('Updating task with data:', task);
          axiosClient.post('/vehiculetasks', task)
              .then(() => {
                  setNotification('task was successfully created')
                  navigate('/vehiculetasks')
              })
              .catch(err => {
                  const response = err.response;
                  if (response && response.status === 422) {
                      setErrors(response.data.errors)
                  }
              })
      }
  }
  const handleStartPointChange = (event) => {
    const selectedStartPoint = event.target.value;
    const updatedTask = { ...task };
    updatedTask.start_point = selectedStartPoint;
    if (selectedStartPoint === 'Souse') {
      updatedTask.start_point = { lat: 36.838292, lng: 10.192418 };
    }
    seTaskes(updatedTask);
    console.log("sdqsdqsd",task)
  };

  const handleEndPointChange = (event) => {
    const selectedEndPoint = event.target.value;
    const updatedTask = { ...task };
    updatedTask.end_point = selectedEndPoint;
    if (selectedEndPoint === 'Souse') {
      updatedTask.end_point = { lat: 36.838292, lng: 10.192418 };
    }
    seTaskes(updatedTask);
    console.log("sdqsdqsd",task)
  };
  return (
      <>
          {task.id && <h1>Update Task: {task.name}</h1>}
          {!task.id && <h1>New Task</h1>}
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
                                 <label >Car:</label>
                        <select  className="select-room" value={task.vehicle_id}
                                onChange={ev => seTaskes({...task, vehicle_id: ev.target.value})}>
                            <option value="" className="select-room">Select Car </option>
                            {vehicles.map(vehicle => (
                                <option key={vehicle.id} value={vehicle.id}>
                                    {vehicle.make}
                                </option>
                            ))}
                          
                        </select>
                        </div>
                     

                        <div className="form-group">
                                 <label >Driver:</label>
                     <select  className="select-room" value={task.user_id}
                                onChange={ev => seTaskes({...task, user_id: ev.target.value})}>
                            <option value="" className="select-room">Select  Driver</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} - {user.group}
                                </option>
                            ))}
                        </select> 
                        </div>
                       

                        <div className="form-group">
                                 <label >Start_Date:</label>
                     <input type="datetime-local" value={task.start_date}
                               onChange={ev => seTaskes({...task, start_date: ev.target.value})}
                               placeholder="start_date"/>
                        </div>
                      
                        
                        <div className="form-group">
                                 <label >End_Date:</label>
                     <input type="datetime-local" value={task.end_date}
                               onChange={ev => seTaskes({...task, end_date: ev.target.value})}
                               placeholder="end_date"/>
                        </div>
                     


                        <div className="form-group">
                                 <label >Start_Point:</label>
                     <select className="select-room" 
                        id="startPoint"
                        value={task.start_point}
                        onChange={handleStartPointChange}
                    >
                        <option value="">Select Start Point</option>
                        <option value="Souse">Souse</option>
                        <option value="Dougga">Dougga</option>
                        <option value="El Djem">El Djem</option>
                        <option value="Kairouan">Kairouan</option>
                        {/* Add more places as needed */}
                    </select>
                        </div>
                       

                        <div className="form-group">
                                 <label >End_Point:</label>
                     <select className="select-room" 
                        id="startPoint"
                        value={task.end_point}
                        onChange={handleEndPointChange}
                    >
                        <option value="">Select Start Point</option>
                        <option value="Souse">Souse</option>
                        <option value="Dougga">Dougga</option>
                        <option value="El Djem">El Djem</option>
                        <option value="Kairouan">Kairouan</option>
                        {/* Add more places as needed */}
                    </select>
                        </div>
                       

                        <div className="form-group">
                                 <label >Description:</label>
                     <input value={task.description} onChange={ev => seTaskes({...task, description: ev.target.value})} placeholder="description"/>
                     
                        </div>
                    
                        <div className="form-group">
                                 <label >Status:</label>
                     <select className="select-room" value={task.status} onChange={ev => seTaskes({...task, status: ev.target.value})}>
                            <option value="" className="select-room">Status</option>
                            <option value="Completed">Completed</option>
                          <option value="ToDo">ToDo</option>
                          <option value="Backlog">Backlog</option>
                          <option value="InReview">InReview</option>
                        
                        </select>
                     
                        </div>
                     


                       
                      
                 
                      
                      <button className="btn-add">Save</button>
                  </form>
            
              )}
          </div>
      </>
  )
}

