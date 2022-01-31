"use strict";
const clientId = 'ca000ee4f7eb40b993c71aaeb3bc3813';
const clientSecret = '9063ae6add144f209f9c44135da9b92a';

let okBtn = document.getElementById('ok').onclick = function() {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + window.btoa(clientId + ':' + clientSecret),
    },
    body: "grant_type=client_credentials",
  };

  fetch( 'https://accounts.spotify.com/api/token', fetchOptions )
    .then(response => response.json() )
    .then(response => response.access_token)
    .then(getTracks);



  function getTracks(token) {
    let interpret = document.getElementById('interpret').value;
    let album = document.getElementById('album').value;
    const url = "https://api.spotify.com/v1/search/"
    + '?type=track'
    + `&q=${album}+artist:${interpret}`

    const fetchOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    fetch(url, fetchOptions)
      .then(result => result.json())
      .then(showResult)
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

