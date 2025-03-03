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
        localStorage.getItem('fit')
        return {
            success: true
        }
    }
}

async function refreshToken(){
    /*if(!localStorage.getItem('fitbit-token')){
        return {
            success: false,
            msg: 'No token available'
        }
    }*/

    let res = await fetch('https://api.fitbit.com/oauth2/token', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: new URLSearchParams({
            'grant_type': 'refresh_token',
            'client_id': '23Q7WF',
            'refresh_token': JSON.parse(localStorage.getItem('fitbit-token')).refresh_token 
        }).toString()
    })

    res = await res.json();

    if('errors' in res && res.errors.length > 0){
        return {
            success: false,
            errors: res.errors
        }
    } else {
        console.log(res);
        return {
            success: true
        }
    }
}

export {
    getAuthUrl,
    getToken,
    refreshToken
}