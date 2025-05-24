let player;
let playlist;
const playButton = document.querySelector("#play");
const nextButton = document.querySelector("#next");
const prevButton = document.querySelector("#prev");
const shuffleButton = document.querySelector("#shuffle");
const volumeUp = document.querySelector("#vol-up");
const volumeDown = document.querySelector("#vol-down");
const wheel = document.querySelector("#wheel");

const volDelta = 20;

let holdingMouse = false;
let increasing = 0;

volumeUp.addEventListener("mousedown", () => {
  increasing = 1;
  holdingMouse = true;
});

volumeUp.addEventListener("mouseup", () => {
  increasing = 1;
  holdingMouse = false;
});

volumeDown.addEventListener("mousedown", () => {
  increasing = -1;
  holdingMouse = true;
});

volumeDown.addEventListener("mouseup", () => {
  increasing = -1;
  holdingMouse = false;
});

let then = performance.now();

function frame(timestamp) {
  const elapsed = timestamp - then;
  if (elapsed >= 200 && holdingMouse) {
    const handle = () => {
      if (increasing == 1) {
        const volume = player.getVolume();
        const newVolume = Math.min(volume + volDelta, 100);
        console.log("INCREASING VOLUME", newVolume);
        player.setVolume(newVolume);
        syncVolumeLabels(newVolume);
      } else if (increasing == -1) {
        const volume = player.getVolume();
        const newVolume = Math.max(volume - volDelta, 0);
        console.log("DECREASING VOLUME", newVolume);
        player.setVolume(newVolume);
        syncVolumeLabels(newVolume);
      }
      then = performance.now();
    };
    handle();
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

function syncVolumeLabels(volume) {
  const height = 20.0 + (volume / 100) * 80.0;
  console.log("SYNCING VOLUME", volume);
  wheel.style.backgroundPosition = `0% ${height}%`;
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

nextButton.addEventListener("click", () => {
  player.nextVideo();
});

prevButton.addEventListener("click", () => {
  player.previousVideo();
});

playButton.addEventListener("click", () => {
  const playerState = player.getPlayerState();
  console.log("TOGGLING PLAYER", playerState);
  if (playerState === 1) {
    player.pauseVideo();
  } else if (player.getPlayerState() === 2) {
    player.playVideo();
  }

  syncPlayButton();
});

let shuffle = false;
shuffleButton.addEventListener("click", (e) => {
  player.setShuffle(shuffle);
  shuffle = !shuffle;
  shuffleButton.classList.toggle("pressed");
});

function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube", {
    width: 128,
    height: 128,
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
  player.setVolume(80);
  syncVolumeLabels(80);
}
function onPlayerStateChange(event) {
  syncPlayButton();
  if (event.data == YT.PlayerState.ENDED) {
    const d = playlist.length / numTracks;

    const random = Math.trunc(seed * d + Math.random() * d);
    player.playVideoAt(playlist[random]);
  }
}
