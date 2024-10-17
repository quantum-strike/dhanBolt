let playlist = [];
let currentSongIndex = 0;
const player = document.getElementById('audio')
const albumArt = document.getElementById('albumArt')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')

const prevButton = document.getElementById('prev-button')
const nextButton = document.getElementById('next-button')
const playPauseButton = document.getElementById('play-pause-button')
const shuffleButton = document.getElementById('shuffle-button')
const loopButton = document.getElementById('loop-button')


let playlistEnded = false;
let loopStatus = false;
let isShuffle = false;
let popupStatus = false;
let play_id = 0;
let prevSongs = [];

function verifyUser() {
  if (!Cookies.get().username) {
    console.log('Error')
    location.replace('/login.html')
  } else{
    console.log('Good to Go')
    const username = Cookies.get().username;
    const name = Cookies.get().name;
    document.getElementById('name').innerText = name;
    getPlaylists(username)


  }
}

function getPlaylists(username) {
  fetch(`https://dhantune.pythonanywhere.com/get/user_playlists?email=${username}`)
  .then(response => response.json())
  .then(data => {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      document.getElementById('playlists').innerHTML += `
        <div class="card">
        <div class="card-body">
          <h5 class="card-title">${element[1]}</h5>
          <button onclick="playPlaylist(${element[0]})" class="btn btn-primary">Listen</button>
        </div>
      </div>
      <br>
      `
      
    }
  });
}
function loadCurrentSong() {
  const song = playlist[currentSongIndex];
  player.src = song.url;
  albumArt.src = song.image;
  songName.innerText = song.name;
  songArtist.innerText = song.artist;
  document.getElementById('bottom-name').innerText = song.name
  document.getElementById('bottom-art').src = song.image
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: song.name,
        artist: song.artist,
        album: 'DhanTune Bolt',
        artwork: [
            { src: song.image, sizes: '96x96', type: 'image/jpeg' }
        ]
    });
}
displayQueue()
}
function loopToggle() {
  if (loopStatus === false) {
      loopStatus = true
      loopButton.style.color = "green";
  } else {
      loopStatus = false
      loopButton.style.color = "rgb(212, 4, 133)";
  }
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  console.log(playlist);
}

function playSong() {
  player.play();
  playPauseButton.innerHTML = '<i class="fa-regular fa-circle-pause"></i>';
}

function pauseSong() {
  player.pause();
  playPauseButton.innerHTML = '<i class="fa-regular fa-circle-play"></i>';
}

function playPause() {
  if (player.paused) {
      playSong();
  } else {
      pauseSong();
  }
}
function shuffleToggle() {
  if (isShuffle === false) {
      isShuffle = true
      shuffleArray(playlist)
      currentSongIndex = 0

      loadCurrentSong();
      setTimeout(() => {
          playPause()
          console.log("starting song")
      }, 10);


      playPauseButton.innerHTML = '<i class="fa-regular fa-circle-play"></i>';
      shuffleButton.style.color = "green";
  } else {
      isShuffle = false
      currentSongIndex = 0

      playPlaylist(play_id)
      playPauseButton.innerHTML = '<i class="fa-regular fa-circle-play"></i>';
      shuffleButton.style.color = "rgb(212, 4, 133)";
  }
  prevSongs = []
  displayQueue()
}
function nextSong() {
  song_id = playlist[currentSongIndex].id
  prevSongs.push(song_id)
  if (playlist.length == currentSongIndex + 1 && loopStatus == false) {
    player.src = ''
    playlistEnded = true
    return
  }
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadCurrentSong()
  playSong()
}
function prevSong() {
  currentSongIndex = (currentSongIndex - 1) % playlist.length;
  loadCurrentSong()
  playSong()
  
}

function playPlaylist(id) {
  play_id = id;
  fetch(`https://dhantune.pythonanywhere.com/playlist_data?id=${id}`)
  .then(response => response.json())
  .then(data => {
    playlist = data;
    loadCurrentSong()
    playSong()
    console.log("starting song")
  });
}
verifyUser()


player.addEventListener('ended', () => {
  if (playlist.length == currentSongIndex + 1 && loopStatus == false) {
    playlistEnded = true
  }
  if (playlistEnded) {
      setTimeout(player.src = '', 100);
  } else {
      // Schedule the next song after a short delay to ensure the flag update
      setTimeout(nextSong, 100);
  }
});

function popup() {
  document.getElementById('player').style.display = 'block'
  document.getElementById('queue').style.display = 'none'
  setTimeout(() => {
    document.getElementById('dis').style.display = 'none'
  }, 10000);

}

function logout() {
  Cookies.remove('username')
  Cookies.remove('pass')
  location.reload()
  
}

if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', () => {
      // Handle play action
      player.play();
  });

  navigator.mediaSession.setActionHandler('pause', () => {
      // Handle pause action
      player.pause();
  });
  navigator.mediaSession.setActionHandler('previoustrack', () => {
      // Handle previous track action
      prevSong();
  });

  navigator.mediaSession.setActionHandler('nexttrack', () => {
      // Handle next track action
      nextSong();
  });
  }


  document.getElementById('logout').addEventListener('click', logout);

  window.addEventListener('nextTrack', nextSong);
  window.addEventListener('prevTrack', prevSong);
  window.addEventListener('ShuffleList', shuffleToggle);
  window.addEventListener('loopList', loopToggle);
  function queueToggle() {
    document.getElementById('queue').style.display = 'block'
    
  }
  window.addEventListener('queueToggle', queueToggle);


  function displayQueue() {
    const container = document.getElementById("queue");
    // Clear previous content
    container.innerHTML = `<span style='color: rgb(74, 73, 73); text-align: center; font-size: smaller;'><i class="fa-solid fa-rectangle-xmark"></i> Pinch in to close</span><br />`;
    run = -1
    for (const [index, song] of playlist.entries()) {
        if (!prevSongs.includes(song.id)) {
            run ++
            if (run == 0) {
                container.innerHTML += `
                <h5><b>Now Playing: </b></h5>
                `
            }
            if (run == 1) {
                container.innerHTML += `
                <br>
                <h5><b>Up Next: </b></h5>
                `

            }
            container.innerHTML += `
          <div class="card greyish-back p-0" style="text-align: start;">
            <div class="card-body p-1" style='border-color: transparent;'>
              <img src="${song.image}" alt="" style="width:25px; border-radius: 5px;">
              <button id='queue-name' style="text-align: left; background-color: transparent; color: white; border-style: none; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 90%;">${song.name}</button>
              <br>
              <span style="color: gray; font-size: smaller; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 95%;" id='queue-artist'>${song.artist}</span>
            </div>
          </div>
            `
        }

    }
}