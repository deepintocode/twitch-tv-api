'use strict'

const channelURL = 'https://wind-bow.glitch.me/twitch-api/channels/';
const streamURL = 'https://wind-bow.glitch.me/twitch-api/streams/';
const twitchUsers = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "jakenbakelive", "phonecats", "sirtagcr"];
let urls = [];
const users = document.querySelector('.users');
const availability = document.querySelector('.availability');
const status_toggle = document.querySelectorAll('.status-toggle');


for (let i = 0; i < twitchUsers.length; i++) {
  urls.push({
    'user': `${twitchUsers[i]}`,
    'twitchURL': `https://www.twitch.tv/${twitchUsers[i]}`,
    'channelURL': `${channelURL}${twitchUsers[i]}`,
    'streamURL': `${streamURL}${twitchUsers[i]}`
  });
}

for (let i = 0; i < twitchUsers.length; i++) {
  users.innerHTML += `
    <li class="flex-container">
      <a href="${urls[i].twitchURL}"><div class="logo" id="${urls[i].user}-logo"></div></a>  
      <div class="user-stats">
        <div class="user">User: ${urls[i].user}</div>
        <div class="game" id="${urls[i].user}-game"></div>
        <div class="status" id="${urls[i].user}-status"></div>
      </div>
    </li>
  `;
}

const toggleableUsers = document.querySelectorAll('.flex-container');
const status = document.querySelectorAll('.status');

urls.map(url => fetch(url.channelURL)
  .then(res => res.json())
  .then(data => {
    url.logo = data.logo;
    let userLogoDiv = document.body.querySelector(`#${url.user}-logo`);
    userLogoDiv.innerHTML = `<img src="${data.logo}" alt="${url.user}'s Twitch Logo"></img>`;
  }
));

urls.map(url => fetch(url.streamURL)
  .then(res => res.json())
  .then(data => {
    let userGameDiv = document.body.querySelector(`#${url.user}-game`);
    let userStatusDiv = document.body.querySelector(`#${url.user}-status`);
    if (data.stream) {
      url.status = data.stream.channel.status;
      url.game = data.stream.game;
      userGameDiv.textContent = `Game: ${data.stream.game}`;
      userStatusDiv.textContent = `Status: ${data.stream.channel.status}`;
    } else {
      url.status = 'offline';
      userGameDiv.textContent = 'Game: N/A';
      userStatusDiv.textContent = "Status: Offline";
    }
  }));

availability.addEventListener('click', (e) => {
    status_toggle.forEach(status => {
    status.classList.remove('active');
  });
  e.target.classList.add('active');
  switch(e.target.id) {
    case 'availability-all':
      toggleableUsers.forEach(user => {
      user.classList.remove('hidden');
    });
      break;
    case 'availability-online':
    status.forEach(message => {
      if (message.innerText === 'Status: Offline') {
        message.parentElement.parentElement.classList.add('hidden');
      } if (message.innerText !== 'Status: Offline') {
        message.parentElement.parentElement.classList.remove('hidden');
      }
    });
      break;
    case 'availability-offline':
    status.forEach(message => {
      if (message.innerText !== 'Status: Offline') {
        message.parentElement.parentElement.classList.add('hidden');
      } if (message.innerText === 'Status: Offline') {
        message.parentElement.parentElement.classList.remove('hidden');
      }
    });
      break;
  }

});

