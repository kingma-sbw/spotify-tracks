"use strict";
const clientId = 'ca000ee4f7eb40b993c71aaeb3bc3813';
const clientSecret = '9063ae6add144f209f9c44135da9b92a';

let okBtn = document.getElementById('ok').onclick = async function() {
  const headers =  {
      'Accept': 'application/json',
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + window.btoa(clientId + ':' + clientSecret),
  };
  const body = "grant_type=client_credentials";

  const url = 'https://accounts.spotify.com/api/token';
  const options = { method: 'POST', headers: headers, body: body };

  const response = await fetch( url, options );
  if( response.status >= 200 && response.status <= 204 ) {
    let data = await response.json();
    getTracks(data.access_token)
  } else {
    console.log('Intruder alert '+response.status);
  }

  async function getTracks(token) {
    let interpret = document.getElementById('interpret').value;
    let album = document.getElementById('album').value;
    const url = "https://api.spotify.com/v1/search/"
    + '?type=track'
    + `&q=${album}+artist:${interpret}`

    const headers = {
        'Accept': 'application/json',
        //'Authorization': 'Bearer ' + token,
    };
    const options = { method: 'GET', headers: headers };

    const response = await fetch(url, options);
    if( response.status >= 200 && response.status <= 204 ) {
      let data = await response.json();
      showResult(data);
    } else {
      console.log('Danger '+ response.status)
    }
  }
  function showResult(data) {
    let table = document.createElement('ul');
    let tracks = data.tracks.items;
    tracks.forEach( track => {
      let linkElem = document.createElement('a');
      linkElem.href = track.external_urls.spotify;
      linkElem.target = '_blank';
      linkElem.innerText = track.name+' ('+track.album.name+')';

      let listElem = document.createElement('li');
      listElem.appendChild(linkElem)

      table.appendChild(listElem)
    })
    document.getElementsByTagName('body')[0].appendChild(table);
  }
}

