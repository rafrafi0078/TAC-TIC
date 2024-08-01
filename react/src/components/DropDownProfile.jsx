import React from 'react';
import axiosClient from '../axios-client';

const DropDownProfile = ({ onLogout }) => {
    const handleLogout = () => {
        axiosClient.post('/logout').then(() => {
            setUser({});    
            setToken(null); 
        });
    };

    return (
        <div className="flex flex-col dropDownFile">
            <ul className='flex flex-col gap-4'>
                <li>Profile</li>
                <li>Settings</li>
                <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</li> {/* Ensure onClick is properly handled */}
            </ul>
        </div>
    );
};

export default DropDownProfile;
