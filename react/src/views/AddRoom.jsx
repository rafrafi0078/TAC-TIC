import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
 
export default function AddRoom() {

    const navigate = useNavigate();
     
     
    const[txtname, setName]= useState('');
    const[capacity, setCapacity]= useState('');
    const [available, setAvailable] = useState(false);
    const[txtdescription, setdescription]= useState('');
    const[fileimage, setPhoto]= useState('');
    const[message, setMessage]= useState('');

    const [selectedEquipments, setSelectedEquipments] = useState([]);

    const roomEquipments = [
      { label: 'Chairs', value: 'Chairs' },
      { label: 'Projector', value: 'Projector' },
      { label: 'Conference Table', value: 'Conference Table' },
      { label: 'Whiteboard', value: 'Whiteboard' },
      { label: 'Video Conferencing System', value: 'Video Conferencing System' },
      { label: 'Flip Chart', value: 'Flip Chart' },
      { label: 'Speaker System', value: 'Speaker System' },
      { label: 'Microphone', value: 'Microphone' },
      { label: 'Television', value: 'Television' },
      { label: 'WiFi Access', value: 'WiFi Access' },
      // ... other equipments
  ];
    // Handler for when items are selected
    const handleSelect = (selectedList) => {
      const description = selectedList.map(e => e.label).join(', ');
      setdescription(description);
    };
    
    // Handler for when items are removed
    const handleRemove = (selectedList) => {
      const description = selectedList.map(e => e.label).join(', ');
      setdescription(description);
    };
    const uploadProduct = async () => {
      console.log("i'm herreeeee")
        const formData = new FormData();
        formData.append('name', txtname);
        formData.append('capacity', capacity);
 
        formData.append('description', txtdescription);
        formData.append('image', fileimage);
      
        try {
            console.log('Sending data', formData);
          const response = await axios.post("http://127.0.0.1:8000/api/rooms", formData, {
            headers: { 'Content-Type': "multipart/form-data" },
          });
      
          console.log(response);
          setMessage(response.data.message);
          setTimeout(() => {
            navigate('/rooms');
          }, 2000);
        } catch (error) {
          if (error.response && error.response.status === 422) {
            // Log or display the validation errors here
            console.log('Validation errors:', error.response.data.errors);
            // Set the validation errors in the state to display them in the UI, if desired
          } else {
            console.error('An unexpected error occurred:', error);
          }
        }
      };    


    const handleIncrease = () => {
        setCapacity((prev) => (prev === '' ? 1 : Math.max(0, Number(prev) + 1)));
      };
      
      const handleDecrease = () => {
        setCapacity((prev) => (prev === '' ? 0 : Math.max(0, Number(prev) - 1)));
      };
    const handleSubmit= async(e)=>{
      e.preventDefault();
      console.log('Form submitted');
      await uploadProduct();
 
   }
    return (
        <React.Fragment>
            <div className="container">
            <div className="row">
              <div className="col-md-8 mt-4">
                <h5 className="mb-4">Add Room </h5> 
                <p className="text-warning">{ message}</p>                              
                 
                    <form onSubmit={ handleSubmit} style={{ alignItems: 'normal' }}>             
                    <div className="mb-3 row">
                    <label  className="col-sm-3">Room Title </label>
                    <div className="col-sm-9">
                    <input type="text" className="form-control" onChange={ (e)=>setName(e.target.value)}/>
                    </div>
                    </div>
 
                    <div className="mb-3 row">
                    <label htmlFor="roomEquipments">Description:</label>
                      <Multiselect
                          options={roomEquipments} // Options to display in the dropdown
                          selectedValues={selectedEquipments} // Preselected value to persist in dropdown
                          onSelect={handleSelect} // Function will trigger on select event
                          onRemove={handleRemove} // Function will trigger on remove event
                          displayValue="label" // Property name to display in the dropdown options
                      />
                    </div>

                  
                    <div className="mb-3 row">
                    <label  className="col-sm-3">Product Image</label>
                    <div className="col-sm-9">
                    <input type="file" className="form-control" onChange={(e)=>setPhoto(e.target.files[0])} />
                    </div>
                    </div>

                    <div className="mb-3 row">
                    <label className="col-sm-3 col-form-label">Capacity</label>
                    <div className="col-sm-9">
                        <div className="input-group">
                        
                        <input 
                            type="number" 
                            className="form-control" 
                            value={capacity} 
                            onChange={(e) => setCapacity(e.target.value)} 
                            placeholder="Capacity" 
                        />
                        
                        </div>
                    </div>
                    </div>

                    
                    <div className="mb-3 row">
                    <label className="col-sm-3 "></label>
                    <div className="col-sm-9">
                    <input 
                          type="checkbox" 
                          className="form-check-input" 
                          checked={available} 
                          onChange={(e) => setAvailable(e.target.checked)}
                      />
                    </div>
                    </div>
 
                    <div className="mb-3 row">
                    <label className="col-sm-3"></label>
                    <div className="col-sm-9">
                    <button type="submit" className="btn btn-success">Submit</button>
                    </div>
                    </div>
 
                    </form>
 
             </div>
            </div>
        </div>
        </React.Fragment>
    );
}
