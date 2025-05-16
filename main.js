let player;
let playlist;
const playButton = document.querySelector("#play");
const volumeUp = document.querySelector("#vol-up");
const volumeDown = document.querySelector("#vol-down");
const wheel = document.querySelector("#wheel");

const volDelta = 5;

volumeUp.addEventListener("click", () => {
  const volume = player.getVolume();
  const newVolume = Math.min(volume + volDelta, 100);
  player.setVolume(newVolume);
  wheel.style.backgroundPosition = `0% ${newVolume}%`;
});

volumeDown.addEventListener("click", () => {
  const volume = player.getVolume();
  const newVolume = Math.min(volume - volDelta, 100);
  player.setVolume(newVolume);
  wheel.style.backgroundPosition = `0% ${newVolume + 20}%`;
});

function togglePlayer() {
  const playerState = player.getPlayerState();
  console.log("TOGGLING PLAYER", playerState);
  if (playerState === 1) {
    player.pauseVideo();
  } else if (player.getPlayerState() === 2) {
    player.playVideo();
  }
}

function syncVolumeLabels() {
  const volume = player.getVolume();
  console.log("SYNCING VOLUME", volume);
  wheel.style.backgroundPosition = `0% ${volume / 140}%`;
}

function syncPlayButton() {
  const playing = player.getPlayerState() === 1;
  if (playing) {
    playButton.classList.add("pressed");
    if (!playing) {
      player.playVideo();
    }
  } else {
    playButton.classList.remove("pressed");
    if (playing) {
      player.pauseVideo();
    }
  }
}

playButton.addEventListener("click", () => {
  togglePlayer();
  syncPlayButton();
});

function onYouTubeIframeAPIReady() {
  player = new YT.Player("grooves", {
    playerVars: {
      listType: "playlist",
      list: "PL8oy4JGFJfJJTvJ6jKONBclrc7G1j9Kmo",
      // disablekb: 1,
      controls: 0,
      playsinline: 1, // Important for mobile browsers
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onvolumechange: () => {
        syncVolumeLabels();
      },
    },
  });
}

const tracks = document.querySelectorAll(".track");
const numTracks = tracks.length;
let seed = 0;

tracks.forEach((track, i) => {
  track.addEventListener("click", () => {
    seed = i;
    const d = playlist.length / numTracks;
    const random = Math.round(seed * d + Math.random() * d);
    player.playVideoAt(random);
    playButton.classList.toggle("pressed");
  });
});

function onPlayerReady() {
  playlist = player.getPlaylist();
  const random = Math.trunc(Math.random() * playlist.length);
  player.playVideoAt(random);
  syncPlayButton();
  syncVolumeLabels();
}
function onPlayerStateChange(event) {
  syncPlayButton();
  if (event.data == YT.PlayerState.ENDED) {
    const d = playlist.length / numTracks;

    const random = Math.trunc(seed * d + Math.random() * d);
    player.playVideoAt(playlist[random]);
  }
}
