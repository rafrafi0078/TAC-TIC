import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";
import { gapi } from "gapi-script";
export default function ReservationsForm() {
   
    var CLIENT_ID = "36930002908-v0vrk0ekcmt4g6op5ptn88bh5pat3c2u.apps.googleusercontent.com"
    var API_KEY = "AIzaSyC8C1H6n8YBaglVgtvBu0c6nSAYHRNNkj8"
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    var SCOPES = "https://www.googleapis.com/auth/calendar.events"
    
    const [attendees, setAttendees] = useState('');
      
     
    const navigate = useNavigate();
    let {id} = useParams();
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);


    useEffect(() => {
        getRooms();
        getUsers();
      

    }, [])
    function getEmailsByGroupName(users, groupName) {
        // Filter users by the specified group name
        const filteredUsers = users.filter(user => user.group === groupName);
        
        // Map to the format expected by Google Calendar API
        const attendeeObjects = filteredUsers.map(user => ({ email: user.email }));
        return attendeeObjects;
      }
    const getUserIdFromLocalStorage = () => {
        const userId = localStorage.getItem('userId');
    if (userId) {
        return userId;
    } else {
        console.error('No user ID found in local storage');
        // Handle the case where there is no user ID, e.g., by setting a default value or showing an error message.
        return ''; // or some default value
    }
      }
      const usercnx = getUserIdFromLocalStorage(); 
    useEffect(() => {
      
        // Supposons que `axiosClient` est déjà configuré avec des credentials
        axiosClient.get('/users')
            .then(({ data }) => {
                setReservations({ ...reservation, user_id: data.id });
                console.log("User ID:",localStorage.getItem('userId'));
               
                console.log(typeof usercnx); // Afficher l'ID de l'utilisateur dans la console
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération de l'utilisateur", error);
            });
    }, []);
    const [reservation, setReservations] = useState({
        id: null,
        user_id: '',
        room_id: '',
        start_time: '',
        end_time: '',
        name: '',
        google_calendar_event_id:'',
        
    })
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const {setNotification} = useStateContext()
    const getRooms= ()=>{
        fetch("http://127.0.0.1:8000/api/rooms")
        .then(res=>{ return res.json()})
        .then(response=>{ 
            console.log(response.rooms)
            setRooms(response.rooms)
        })
        .catch(error=>{ console.log(error)});
    }
   
    const getUsers = () => {
        setLoading(true)
        axiosClient.get('/users')
            .then(({ data }) => {
                setLoading(false)
                setUsers(data.data)
            })
            .catch(() => {
                setLoading(false)
            })
    }
   

    if (id) {

        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/reservations/${id}`)
                .then(({data}) => {
                    setLoading(false)
                    setReservations(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = ev => {
       
       console.log("befooore adding");
       const reservationToSubmit = {
        ...reservation,
        user_id: getUserIdFromLocalStorage()
    };
      
          console.log("LA RESERVATION"+reservation);
          console.log("after adding");
        console.log("la reservation========="+reservation)
        ev.preventDefault()
        if (reservation.id) {
            
            axiosClient.put(`/reservations/${reservation.id}`, reservationToSubmit)

                .then(() => {
                    setNotification('reservations was successfully updated')
                    navigate('/reservations')
                    
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            console.log('adding reservations with data:', reservationToSubmit);
          
                  
                    gapi.load('client:auth2', () => {
                        console.log('loaded client');
                    
                        // Initialize the Google API client
                        gapi.client.init({
                          apiKey: API_KEY,
                          clientId: CLIENT_ID,
                          discoveryDocs: DISCOVERY_DOCS,
                          scope: SCOPES,
                        }).then(() => {
                          console.log("Google API client initialized");
                          
                          // Load the calendar API
                          return gapi.client.load('calendar', 'v3');
                        }).then(() => {
                          console.log('Calendar API loaded, signing in');
                    
                          // Sign in the user
                          return gapi.auth2.getAuthInstance().signIn();
                        }).then(() => {
                          console.log('User signed in, inserting event');
                          //get list of emails
                          const attendeeEmailsArray = getEmailsByGroupName(users, attendees);
                          console.log(attendeeEmailsArray);
                    
                          // Get current date and time
                          const startDateTime = new Date(reservation.start_time);
                          const endDateTime = new Date(reservation.end_time);
                          
                          // Create an event object
                          var event = {
                            'summary': reservation.name,
                            'attendees': attendeeEmailsArray
                              ,
                            // ... additional event properties ...
                            'start': {
                              'dateTime': startDateTime,
                              'timeZone': 'Africa/Tunis'
                            },
                            'end': {
                              'dateTime': endDateTime,
                              'timeZone': 'Africa/Tunis'
                            },
                            // ... additional event properties ...
                          };
                    
                          // Insert the event
                          return gapi.client.calendar.events.insert({
                            'calendarId': 'primary',
                            'resource': event
                          });
                        }).then((response) => {
                          // Event inserted
                          console.log('Event created: ' + response.result.htmlLink);
                          const googleCalendarEventId = response.result.id;
                            setReservations(prevReservation => ({
                                ...prevReservation,
                                google_calendar_event_id: googleCalendarEventId,
                            }));

                            // Wait for the state to update with the new Google Calendar event ID
                            // Then submit the updated reservation data to the backend
                            submitReservationToBackend({
                                ...reservation,
                                google_calendar_event_id: googleCalendarEventId, // Use the ID directly from the response
                                user_id: getUserIdFromLocalStorage(),
                            });
                       
                          if (response.result.htmlLink) {
                              window.open(response.result.htmlLink, '_blank');
                            }
                        }).catch((error) => {
                          // Handle errors
                          console.error('Error:', error);
                        });
                      });
                    
                    console.log("old reserrvation"+reservation);
                    setNotification('reservation was successfully created');
              
        }
        function submitReservationToBackend(updatedReservation) {
            axiosClient.post('/reservations', updatedReservation)
                .then(() => {
                    setNotification('Reservation was successfully created/updated');
                    navigate('/reservations');
                })
                .catch(error => {
                    console.error('Error submitting reservation:', error);
                    setErrors({submit: 'Failed to create/update the reservation.'});
                });
        }
    }

    return (

        <>
            {reservation.id && <h1>Update User: {reservation.name}</h1>}
            {!reservation.id && <h1>New Reservation</h1>}
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
                    <>
                    <form onSubmit={onSubmit}style={{ alignItems: 'normal' }}>
                    <div className="form-group" >
                                 <label >Room:</label>
                        <select  className="select-room" value={reservation.room_id}
                                onChange={ev => setReservations({...reservation, room_id: ev.target.value})}>
                            <option value="" className="select-room">Sélectionnez une chambre</option>
                            {rooms &&  rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    {room.id} - {room.name}
                                </option>
                            ))}
                        </select>
                        </div>
                        <div className="form-group">
                             <label >Start_Time:</label>
                                 <input type="datetime-local" value={reservation.start_time}
                               onChange={ev => setReservations({...reservation, start_time: ev.target.value})}
                               placeholder="start_time"/>
                         </div>
                         <div className="form-group">
                             <label >End_Time:</label>
                             <input type="datetime-local" value={reservation.end_time}
                               onChange={ev => setReservations({...reservation, end_time: ev.target.value})}
                               placeholder="end_time"/>
                          </div>
                          <div className="form-group">
                             <label >Name:</label>
                                <input value={reservation.name}
                                    onChange={ev => setReservations({...reservation, name: ev.target.value})}
                                    placeholder="Name"/>

                            </div>      
                            <div className="form-group">
                             <label >Select_Gp:</label>
                        <select className="select-room" value={attendees} onChange={ev => setAttendees(ev.target.value)}>
                            <option value="">Select Group</option>
                            <option value="TAC-TIC">TAC-TIC</option>
                            <option value="Smart-Advising">Smart-Advising</option>
                            <option value="Smart Skills">Smart Skills</option>
                            <option value="Elastic-Solutions">Elastic-Solutions</option>
                            <option value="Other">Other</option>
                        </select>   
                        </div> 

                        <button className="btn-add">Save</button>
                    </form>
                 
                    </>
                )}
            </div>  
        </>
    )
}
