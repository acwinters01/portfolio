import React, { useState, useEffect } from 'react';


// Request User Authorization
const clientId = "6bc7dfe2ca024756bf79ff934bf15a0d";
const redirectUri = 'http://localhost:3000'
const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private';

// Generate random string for code verifier
export const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// Transform code verifier using SHA 256 algorithm. This value will be sent within user authorization request.
export const sha256 = async (plain) => {
    const encode = new TextEncoder()
    const data = encode.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

// Returns base64 representation of the digest from sha256
export const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

// Initate Spotify Authorization 
export async function initiateAuthorization (){

    // Clear old tokens/verifiers
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Debugging -- Check if values were removed from storage
    const removedVerifier = localStorage.getItem('code_verifier');
    const removedToken = localStorage.getItem('access_token');
    console.log('Code Verifier and Access Token removed from storage:', removedVerifier, removedToken);

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
    };
    
    authURL.search = new URLSearchParams(params).toString();
    window.location.href = authURL.toString();
}

// Request an Access Token with a function
export async function getToken (code) {
    const url = 'https://accounts.spotify.com/api/token';
    const codeVerifier = localStorage.getItem('code_verifier');

    // Debugging
    console.log("Authorization Code:", code);
    console.log("Code Verifier:", codeVerifier);
    console.log("Redirect URI:", redirectUri);

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

        if (data.access_token) {
            console.log("Access Token:", data.access_token);
            localStorage.setItem('access_token', data.access_token);

            // Store expiration and refresh token
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('expires_in', Date.now() + data.expires_in * 1000);
        } else {
            console.error('Failed to retrieve access token:', data);
        }
    } catch (error) {
        console.error('Error fetching token:', error);
    }
};

// Refresh the access token when it has expired
export async function refreshToken () {
    const refresh_token = localStorage.getItem('refresh_token');
    
    if (!refresh_token) {
        window.alert("Session expired, please log in again.");
        initiateAuthorization();  // Redirect user to login
        return null;
    }

    const url = 'https://accounts.spotify.com/api/token';

    const payload = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
        }),
    };

    try {
        const response = await fetch(url, payload);
        const data = await response.json();

        if (data.access_token) {
            console.log("Refreshed Access Token:", data.access_token);
            localStorage.setItem('access_token', data.access_token);  // Store the new access token
            localStorage.setItem('expires_in', Date.now() + data.expires_in * 1000);  // Store new expiration time
            return data.access_token;
        } else {
            console.error('Failed to refresh access token:', data);
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
    }
};

// Check if the current access token is expired
export function isTokenExpired() {
    const expiresIn = localStorage.getItem('expires_in');
    if (!expiresIn) return true;
    return Date.now() > expiresIn;
};

// Authorization Component
export default function Authorization() {
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const existingToken = localStorage.getItem('access_token');

        // Check if there's already an access token.
        if (code && !existingToken) {
            getToken(code);
        } else if (existingToken) {
            setAccessToken(existingToken);
        }

    }, []);

    return (
        <div className='displayAuthorization'>
            {!accessToken && (
                <div className='needAuthorization'>
                    <h1>Spotify Authorization</h1>
                    <button onClick={initiateAuthorization}>Log in with Spotify</button>
                </div>
            )}
            {accessToken && (
                <div className='loggedIn'>
                    <h2>You are logged in!</h2>
                    <button onClick={initiateAuthorization}>Refresh</button>
                </div>
            )}
        </div>
    );
};


