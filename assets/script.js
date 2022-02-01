"use strict";
const clientId = 'your id';
const clientSecret = 'your secret';
/**
 * get the spotify_token on load. 
 * As soon as it is loaded enable the 'ok' button
 * the spotify token is stored as document property
 */
document.addEventListener('DOMContentLoaded', requestSpotifyToken);

/**
 * onclick event for button
 * get the field values and send to spotify
 * documnet.spotify_token should have been set by now
 */
let okBtn = document.getElementById('ok').onclick = async function() {

  let interpret = document.getElementById('interpret').value;
  let album = document.getElementById('album').value;
  const url = "https://api.spotify.com/v1/search/"
  + '?type=track'
  + `&q=${album}+artist:${interpret}`

  const headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + document.spotify_token,
  };
  const options = { method: 'GET', headers: headers };

  try {
    const response = await fetch(url, options);
    if( response.status >= 200 && response.status <= 204 ) {
      let data = await response.json();
      showResult(data.tracks.items);
    } else {
      console.error('Danger '+ response.statusText)
    }
  } catch( error ) {
    alert(error);
  }
};

/**
 * put the results as ul in the div tag
 *
 * @param object[] tracks
 */
function showResult(tracks) {
  const resultDiv = document.getElementById('result');
  
  // Clear the (previous) results
  resultDiv.innerHTML = '';

  let table = document.createElement('ul');

  tracks.forEach( track => {
    let linkElem = document.createElement('a');
    linkElem.href = track.external_urls.spotify;
    linkElem.target = '_blank';
    linkElem.innerText = track.name+' ('+track.album.name+')';

    let listElem = document.createElement('li');
    listElem.appendChild(linkElem)

    table.appendChild(listElem);

    resultDiv.appendChild(table);
  })
}

/**
 * Get a token from spotify
 * store it in document property spotify_token
 * also activates the ok button
 * @param {Event} event 
 */
async function requestSpotifyToken(event) {
  const headers =  {
    'Accept': 'application/json',
    'Content-Type':  'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + window.btoa(clientId + ':' + clientSecret),
  };
  const body = "grant_type=client_credentials";

  const url = 'https://accounts.spotify.com/api/token';
  const options = { method: 'POST', headers: headers, body: body };

  try {
    const response = await fetch( url, options );
    // status between [200 and 204]
    if( 200 <= response.status && response.status <= 204 ) {
      let data = await response.json();

      // save spotify token for later
      document.spotify_token = data.access_token;

      // enable the ok button
      document.getElementById('ok').removeAttribute('disabled');

    } else {
      console.error('Intruder alert '+response.statusText);
    }
  } catch(error) {
    console.error(error);
  }
};