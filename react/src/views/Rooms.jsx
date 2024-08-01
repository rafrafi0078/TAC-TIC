import React, { useState, useEffect } from "react";
 
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading.jsx";
import { TableOutlined, UnorderedListOutlined } from "@ant-design/icons";
 
export default function Rooms() {
    const[product, setProduct]= useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 6;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const currentUsers = product.slice(firstIndex, lastIndex);
    const npage = Math.ceil(product.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);
    
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

    useEffect( ()=>{
        const getProduct= ()=>{
            fetch("http://127.0.0.1:8000/api/rooms")
            .then(res=>{ return res.json()})
            .then(response=>{ 
                console.log(response.rooms)
                setProduct(response.rooms)
            })
            .catch(error=>{ console.log(error)});
        }
        getProduct();
    },[]);
    const cardStyle = {
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        width: '300px',
        background: 'white',
        marginBottom: '20px' // Ensure spacing between cards
    };

    const tableStyle = {
        width: '100%',
        marginBottom: '20px',
        borderCollapse: 'collapse'
    };

    const thTdStyle = {
        padding: '8px',
        border: '1px solid #ddd',
        textAlign: 'left'
    };
    const prePage = () => setCurrentPage(current => Math.max(current - 1, 1));
    const nextPage = () => setCurrentPage(current => Math.min(current + 1, npage));
    const changeCPage = (id) => setCurrentPage(id);

    const deleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this room?")) {
            axios.delete('http://127.0.0.1:8000/api/productdelete/'+id)
            .then(function(response){
                console.log(response.data);
                alert("Successfully Deleted");
            });
        }
      
    }

    return (
        <>
        <div>
        <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ color: 'navy', fontSize: '36px', textAlign: 'center', margin: '20px 0', fontFamily: 'Arial, sans-serif' }}>Rooms</h1>
             
                <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
               
                    <button  style={{ border: '0' ,backgroundColor:'white'}} onClick={() => setViewMode('cards')}> <TableOutlined /></button>
                    <button  style={{ border: '0' ,backgroundColor:'white'}}onClick={() => setViewMode('table')}><UnorderedListOutlined /></button>
                    <Link to="/addRoom" className="btn-add">Add Room</Link>
                   
                </div>
            </div>
            {loading ?  <Loading message="Loading Rooms..." /> : viewMode === 'table' ? (
               <div className="container container_overflow">
          
               <div className="row">
                   <div className="col-12">
                       <h5 className="mb-4">Rooms List</h5> 
                       <p className="text-danger"> </p>                 
                               <table className="table table-bordered">
                               <thead>
                               <tr>
                               <th scope="col">Room Id</th>
                               <th scope="col">Room Title</th>
                               <th scope="col">Room Description</th>
                               <th scope="col">Room Image</th>
                               <th scope="col" width="200">Action</th>
                               </tr>
                               </thead>
                               <tbody>
                                   {
                                       product.map((pdata, index)=>(
                                           <tr key={index}>
                                           <td>{index+1 } </td>
                                           <td>{pdata.name } </td>
                                           <td>{pdata.description } </td>
                                           <img src={`http://127.0.0.1:8000/storage/uploads/image/${pdata.image}`} alt="" height={50} width={90} />
                                           <td>
                                               <Link to={`/editproduct/${pdata.id}/edit`} className="btn btn-success mx-2">Edit</Link>
                                               <button onClick={() => deleteProduct(pdata.id)} className="btn btn-danger">Delete</button>
                                           </td>
                                           </tr>
                                       ))
                                   }
                              
                                                               
                               </tbody>
                               </table>  
                   </div>
               </div>
           </div>
            ) : (
                <div className="rooms-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '20px' }}>
                {product.map(produc => (
                    <div className="room-card" key={produc.id} style={{
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                        transition: '0.3s',
                        width: '300px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundColor: '#fff',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                      
                        <img src={`http://127.0.0.1:8000/storage/uploads/image/${produc.image}`}alt={produc.name} style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover'
                        }} />
                        <div className="room-details" style={{
                            padding: '15px',
                            flexGrow: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>{produc.name}</h3>
                            <p><strong>Capacity:</strong> {produc.capacity}</p>
                            <p><strong>Availability:</strong> {produc.available ? "Yes" : "No"}</p>
                            <p><strong>Description:</strong> {produc.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', gap: '10px' }}>
                           
                                <Link  to={`/editproduct/${produc.id}/edit`} style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '5px',
                                    textAlign: 'center'
                                }}>Edit</Link>
                                <button onClick={() => deleteProduct(produc.id)} style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
            <nav>
                <ul className='pagination'>
                    <li className='page-item'>
                        <button className='page-link' onClick={prePage}>Prev</button>
                    </li>
                    {numbers.map((n, i) => (
                        <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                            <button className='page-link' onClick={() => changeCPage(n)}>
                                {n}
                            </button>
                        </li>
                    ))}
                    <li className='page-item'>
                        <button className='page-link' onClick={nextPage}>Next</button>
                    </li>
                </ul>
            </nav>
        </div>


  

    </>
    );
}
