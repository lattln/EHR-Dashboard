import { EncryptJWT, jwtDecrypt } from "jose";
import { Meteor } from 'meteor/meteor';
/*
    CONSTANTS:

        token duration: amount of time a token is valid for in seconds
*/

const TOKEN_DURATION = 28800;
const JWT_SECRET = Meteor.settings.public.JWT_SECRET || process.env.JWT_SECRET;

//helper functions to create code verifier/challenges for OAuth2
function sha256(plain){
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

function hexToUINT8(str){
    const arr = new Uint8Array(str.length / 2);
    for (let i = 0; i < str.length; i += 2) {
        arr[i / 2] = parseInt(str.substring(i, i + 2), 16);
    }
    return arr;
}

function base64urlencode(a){
    let str = "";
    let bytes = new Uint8Array(a);

    for(let b of bytes) {
        str += String.fromCharCode(b);
    }
    
    let chall = btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    return chall;
}

async function genCodeChallenge(v) {
    let hashed = await sha256(v);
    let challenge = base64urlencode(hashed);
    return challenge;
}

//Converts decimal to hex
function dec2hex(dec){
    return ('0' + dec.toString(16)).substring(-2);
}

//Generates a verifer used in OAuth2, stores it for the session
function genVerifier(){
    var array = new Uint8Array(56 / 2);
    window.crypto.getRandomValues(array);
    let verifier = Array.from(array, dec2hex).join('');
    sessionStorage.setItem('verifier', verifier);
    return verifier; 
}

//Generates the URL for the user to click on to start the OAuth2 process.
async function getAuthUrl(currUrl){
    let chall = await genCodeChallenge(genVerifier());
    let url = 'https://www.fitbit.com/oauth2/authorize?' + new URLSearchParams({
        client_id: Meteor.settings.public.FITBIT_CLIENT_ID,
        scope: 'activity cardio_fitness heartrate oxygen_saturation respiratory_rate sleep temperature',
        code_challenge: chall,
        code_challenge_method: 'S256',
        redirect_uri: currUrl + '/toke',
        response_type: 'code',
        state: currUrl
    });

    return url;
}

//Uses the access code given by FitBit to request an access token for the user, encrypts the token an puts in in localStorage
async function getToken(code, url){
    let res = await fetch('https://api.fitbit.com/oauth2/token', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: new URLSearchParams({
            'grant_type': 'authorization_code',
            'redirect_uri': url + '/toke',
            'code': code,
            'client_id': Meteor.settings.public.FITBIT_CLIENT_ID,
            'code_verifier': sessionStorage.getItem('verifier')
        }).toString()
    })

    res = await res.json();

    if('errors' in res && res.errors.length > 0){
        return {
            success: false,
            errors: res.errors
        }
    } else {

        const jwt = await encJWT(res);
        localStorage.setItem('fitbit-token', jwt);

        return {
            success: true
        }
    }
}

//Decrypts the encrypted token
async function decJWT(JWE){
    const sec = hexToUINT8(JWT_SECRET);
    const { payload } = await jwtDecrypt(JWE, sec);
    return payload;
}

//Encrypts the passed object
async function encJWT(token){
    const sec = hexToUINT8(JWT_SECRET);
    const jwt = await new EncryptJWT(token).setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' }).setIssuedAt().encrypt(sec);
    return jwt;
}

//Checks if the token has expired and needs to be renewed
async function isValidToken(jwe){
    let jwt = await decJWT(jwe);
    let expiresAt = jwt.iat + TOKEN_DURATION;
    let dateInSeconds = Math.floor(Date.now() / 1000);
    if(dateInSeconds >= expiresAt){
        return false;
    }
    return true;
}

//Grabs the current access token and uses the refresh_token property to request a new access token. Used when access expires
async function refreshToken(token){
    console.log('refreshing');
    let jwt = await decJWT(token);
    let res = await fetch('https://api.fitbit.com/oauth2/token', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: new URLSearchParams({
            'grant_type': 'refresh_token',
            'client_id': Meteor.settings.public.FITBIT_CLIENT_ID,
            'refresh_token': jwt.refresh_token 
        }).toString()
    })

    res = await res.json();

    if('errors' in res && res.errors.length > 0){
        return {
            success: false,
            errors: res.errors
        }
    } else {

        //encrypt the token that was received and store it in local storage
        const jwt = await encJWT(res);
        localStorage.setItem('fitbit-token', jwt);

        return {
            success: true
        }
    }
}

export {
    decJWT,
    getAuthUrl,
    getToken,
    isValidToken,
    refreshToken
}