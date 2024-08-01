import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function UserForm() {
    const navigate = useNavigate();
    let {id} = useParams();
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        group: '',
        role:'',
    })
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const {setNotification} = useStateContext()

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
                .then(({data}) => {
                    setLoading(false)
                    setUser(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = ev => {
        console.log('Leuser',user.group);
        ev.preventDefault()
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification('User was successfully updated')
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            console.log('Updating room with data:', user);
            axiosClient.post('/users', user)
                .then(() => {
                    setNotification('User was successfully created')
                    navigate('/users')
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
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>New User</h1>}
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
                        <input value={user.name} onChange={ev => setUser({...user, name: ev.target.value})} placeholder="Name"/>
                        </div>
                        <div className="form-group">
                                 <label >Email:</label>
                        <input value={user.email} onChange={ev => setUser({...user, email: ev.target.value})} placeholder="Email"/>
                        </div>
                        <div className="form-group">
                                 <label >Password:</label>
                        <input type="password" onChange={ev => setUser({...user, password: ev.target.value})} placeholder="Password"/>
                        </div>
                        <div className="form-group">
                                 <label ></label>
                        <input type="password" onChange={ev => setUser({...user, password_confirmation: ev.target.value})} placeholder="Password Confirmation"/>
                        </div>
                        <div className="form-group">
                                 <label >Select_Gp</label>
                        <select className="select-room" value={user.group} onChange={ev => setUser({...user, group: ev.target.value})}>
                            <option value="">Select Group</option>
                            <option value="TAC-TIC">TAC-TIC</option>
                            <option value="Smart-Advising">Smart-Advising</option>
                            <option value="Smart Skills">Smart Skills</option>
                            <option value="Elastic-Solutions">Elastic-Solutions</option>
                            <option value="Other">Other</option>
                        </select>
                        </div>
                        <div className="form-group">
                                 <label >Select_Gp</label>
                        <select  className="select-room" value={user.role} onChange={ev => setUser({...user, role: ev.target.value})}>
                            <option value="">Select Role</option>
                            <option value="manager">manager</option>
                            <option value="admin">admin</option>
                            <option value="choufeur">choufeur</option>
                            
                            <option value="simple user">simple user</option>
                          
                            <option value="Other">Other</option>
                        </select>
                        </div>
                        <button className="btn-add">Save</button>
                    </form>
                )}
            </div>
        </>
    )
}
