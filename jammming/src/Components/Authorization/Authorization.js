import React, { useState, useEffect } from 'react';

// Generate random string for code verifier
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// Transform code verifier using SHA 256 algorithm. This value will be sent within user authorization request.
const sha256 = async (plain) => {
    const encode = new TextEncoder()
    const data = encode.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

// Returns base64 representation of the digest from sha256
const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

// Request User Authorization
const clientId = "6bc7dfe2ca024756bf79ff934bf15a0d";
const redirectUri = 'http://localhost:3000'
const scope = 'user-read-private user-read-email';


export const initiateAuthorization = async() => {

    alert('Initiating authorization...');

    // Clear old tokens/verifiers
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('access_token');

    // Debugging -- Check if values were removed from storage
    // const removedVerifier = localStorage.getItem('code_verifier');
    // const removedToken = localStorage.getItem('access_token');
    // alert('Code Verifier and Access Token removed from storage:', removedVerifier, removedToken);


    const codeVerifier = generateRandomString(64);
    localStorage.setItem('code_verifier', codeVerifier);

    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const authURL = new URL('https://accounts.spotify.com/authorize');
    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    }
    
    authURL.search = new URLSearchParams(params).toString();
    window.location.href = authURL.toString();
}

// Request an Access Token with a function
export const getToken = async (code) => {
    const url = 'https://accounts.spotify.com/api/token';
    const codeVerifier = localStorage.getItem('code_verifier');

    // Debugging
    // console.log("Authorization Code:", code);
    // console.log("Code Verifier:", codeVerifier);
    // console.log("Redirect URI:", redirectUri);

    const payload = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    };

    try {
        const response = await fetch(url, payload);
        const data = await response.json();

        // Debugging
        // console.log('Full token response:', data);

        if (data.access_token) {
            console.log("Access Token:", data.access_token);
            localStorage.setItem('access_token', data.access_token);
        } else {
            console.error('Failed to retrieve access token:', data);
        }
    } catch (error) {
        console.error('Error fetching token:', error);
    }
};



const Authorization = () => {
    const [accessToken, setAccessToken] = useState('');
  
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const existingToken = localStorage.getItem('access_token');

        // Check if there's already an access token.
        if (code && !existingToken) {
            getToken(code);

        } else if (existingToken) {
            setAccessToken(existingToken)
        }

    }, []);

    return (
        <div>
            <h1>Spotify Authorization</h1>
            {!accessToken && <button onClick={initiateAuthorization}>Log in with Spotify</button>}
            {accessToken && <button onClick={() => alert("You are already logged in!")}>You are logged in!</button>}
        </div>
    );
};

export default Authorization;

