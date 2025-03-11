import { EncryptJWT, jwtDecrypt } from "jose";
/*
    CONSTANTS:

        token duration: amount of time a token is valid for in milliseconds
        jwt secret: until we figure out env
*/

const TOKEN_DURATION = 1;
const JWT_SECRET = new Uint8Array([225, 141, 211, 39, 40, 184, 115, 65, 186, 157, 142, 105, 92, 110, 156, 143, 105, 85, 145, 239, 172, 35, 179, 190, 78, 223, 53, 224, 219, 249, 33, 143]);

function sha256(plain){
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
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

function dec2hex(dec) {
    return ('0' + dec.toString(16)).substring(-2);
}

function genVerifier() {
    var array = new Uint8Array(56 / 2);
    window.crypto.getRandomValues(array);
    let verifier = Array.from(array, dec2hex).join('');
    sessionStorage.setItem('verifier', verifier);
    return verifier; 
}

async function getAuthUrl(){
    let chall = await genCodeChallenge(genVerifier());
    let url = 'https://www.fitbit.com/oauth2/authorize?' + new URLSearchParams({
        client_id: '23Q7WF',
        scope: 'activity cardio_fitness heartrate oxygen_saturation respiratory_rate sleep temperature',
        code_challenge: chall,
        code_challenge_method: 'S256',
        response_type: 'code' 
    });

    return url;
}

async function getToken(code){
    let res = await fetch('https://api.fitbit.com/oauth2/token', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: new URLSearchParams({
            'grant_type': 'authorization_code',
            'redirect_uri': 'http://localhost:3000/auth',
            'code': code,
            'client_id': '23Q7WF',
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

        res.issued_at = Date.now();
        const jwt = await encJWT(res);
        localStorage.setItem('fitbit-token', jwt);

        return {
            success: true
        }
    }
}

async function decJWT(JWE){
    const { payload } = await jwtDecrypt(JWE, JWT_SECRET);
    return payload;
}

async function encJWT(token){
    const jwt = await new EncryptJWT(token).setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' }).setIssuedAt().encrypt(JWT_SECRET);
    console.log(jwt);

    return jwt;
}

//Checks if the token has expired and needs to be renewed
function isValidToken(jwe){
    let jwt = decJWT(jwe);
    let diff = Date.now() - TOKEN_DURATION;
    if(diff > jwt.issued_at){
        return false;
    }
    return true;
}

async function refreshToken(token){
    let jwt = decJWT(token);
    let res = await fetch('https://api.fitbit.com/oauth2/token', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: new URLSearchParams({
            'grant_type': 'refresh_token',
            'client_id': '23Q7WF',
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

        res.issued_at = Date.now();
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