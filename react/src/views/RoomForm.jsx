import React, { useState } from "react";
 
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function RoomForm() {
  const navigate = useNavigate();
     
  const[txtname, setName]= useState('');
  const[capacity, setCapacity]= useState('');
  const[available, setAvailable]= useState(true);
  const[txtdescription, setdescription]= useState('');
  const[fileimage, setPhoto]= useState('');
  const[message, setMessage]= useState('');

  const uploadProduct= async()=>{
      console.log(fileimage)
      const formData= new FormData();
      formData.append('name', txtname);
      formData.append('capacity',capacity);
      formData.append('available',available);
      formData.append('description',txtdescription);
      formData.append('image', fileimage);
      
      const responce= await axios.post("http://127.0.0.1:8000/api/rooms", formData, {
          headers:{'Content-Type':"multipart/form-data"},
      } );

      if(responce)
      {
          console.log(responce)
          setMessage(responce.message); //"message": "Product successfully created."
          setTimeout(()=>{
              navigate('/rooms');
          }, 2000);
      }
  }

  
 const handleIncrease = () => {
    setCapacity((prev) => (prev === '' ? 1 : Math.max(0, Number(prev) + 1)));
  };
  
  const handleDecrease = () => {
    setCapacity((prev) => (prev === '' ? 0 : Math.max(0, Number(prev) - 1)));
  };
  const handleSubmit= async(e)=>{
    console.log("dataaaa");
    e.preventDefault();
    await uploadProduct();

 }
    return (
       
            <div className="container">
            <div className="row">
              <div className="col-md-8 mt-4">
                <h5 className="mb-4">Add Product </h5> 
                <p className="text-warning">{ message}</p>                              
                 
                    <form onSubmit={ handleSubmit}>             
                    <div className="mb-3 row">
                    <label  className="col-sm-3">Product Title </label>
                    <div className="col-sm-9">
                    <input type="text" className="form-control" onChange={ (e)=>setName(e.target.value)}/>
                    </div>
                    </div>
 
                    <div className="mb-3 row">
                    <label  className="col-sm-3">Description </label>
                    <div className="col-sm-9">
                    <input type="text" className="form-control" onChange={(e)=>setdescription(e.target.value)}  />
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
                    <label  className="col-sm-3">Product Image</label>
                    <div className="col-sm-9">
                    <input type="file" className="form-control" onChange={(e)=>setPhoto(e.target.files[0])} />
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
    )
}
