import React from 'react';
import Authorization from '../Authorization/Authorization'

const GetAccess = async() => {

    const storedToken = localStorage.getItem('access_token');
    setAccessToken(storedToken);

    if (storedToken) {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${storedToken}`
            },
        });
        const data = await response.json();
        console.log(data)
    }
 
};

const getStoredToken = () => { 
    
}