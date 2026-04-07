import { useCallback, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/home";
import { Button } from "../components/Button";
import { ButtonGroup } from "../components/ButtonGroup";
import { Keywell } from "../components/Keywell";
import { Progress } from "../components/Progress";
import { Wheel } from "../components/Wheel";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiShuffle,
} from "react-icons/fi";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "grooves and grams" },
    { name: "description", content: "Music player with YouTube integration" },
  ];
}

export default function Home() {
  const playerRef = useRef<YT.Player | null>(null);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const playlistRef = useRef<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [seed, setSeed] = useState(0);
  const seedRef = useRef(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const holdingMouseRef = useRef(false);
  const increasingRef = useRef(0);

  const volDelta = 20;
  const numTracks = 4;

  // Animation frame for volume control and progress syncing
  useEffect(() => {
    let then = performance.now();
    let lastProgressSync = 0;
    let animationFrameId: number;

    function frame(timestamp: number) {
      const elapsed = timestamp - then;
      if (elapsed >= 200 && holdingMouseRef.current && playerRef.current) {
        const player = playerRef.current;
        if (increasingRef.current === 1) {
          const currentVolume = player.getVolume();
          const newVolume = Math.min(currentVolume + volDelta, 100);
          player.setVolume(newVolume);
          syncVolumeLabels(newVolume);
          setVolume(newVolume);
        } else if (increasingRef.current === -1) {
          const currentVolume = player.getVolume();
          const newVolume = Math.max(currentVolume - volDelta, 0);
          player.setVolume(newVolume);
          syncVolumeLabels(newVolume);
          setVolume(newVolume);
        }
        then = performance.now();
      }

      // Sync progress every 500ms
      if (timestamp - lastProgressSync >= 500 && playerRef.current) {
        const player = playerRef.current;
        const current = player.getCurrentTime();
        const duration = player.getDuration();
        if (duration > 0) {
          setProgress((current / duration) * 100);
        }
        lastProgressSync = timestamp;
      }

      animationFrameId = requestAnimationFrame(frame);
    }

    animationFrameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const syncVolumeLabels = (vol: number) => {
    const height = 20.0 + (vol / 100) * 80.0;
    if (wheelRef.current) {
      wheelRef.current.style.backgroundPosition = `0% ${height}%`;
    }
  };

  // Load YouTube IFrame API and create player
  useEffect(() => {
    // If the API is already loaded, create the player directly
    if (window.YT && window.YT.Player) {
      createPlayer();
      return;
    }

    // Load the IFrame API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    // The API will call this global callback when ready
    window.onYouTubeIframeAPIReady = () => {
      createPlayer();
    };

    function createPlayer() {
      playerRef.current = new YT.Player("youtube-player", {
        width: 128,
        height: 128,
        playerVars: {
          listType: "playlist",
          list: import.meta.env.VITE_PLAYLIST_ID,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }

    function onPlayerReady(event: YT.PlayerEvent) {
      const player = event.target;
      playerRef.current = player;

      const pl = player.getPlaylist();
      console.log("Playlist loaded:", pl);
      playlistRef.current = pl || [];
      setPlaylist(pl || []);
      const random = Math.trunc(Math.random() * (pl?.length || 0));
      console.log("Playing random video at index:", random);
      player.playVideoAt(random);
      player.setVolume(80);
      syncVolumeLabels(80);
      setVolume(80);
    }

    function onPlayerStateChange(event: YT.OnStateChangeEvent) {
      if (event.data === YT.PlayerState.PLAYING) {
        setIsPlaying(true);
      } else if (event.data === YT.PlayerState.PAUSED) {
        setIsPlaying(false);
      } else if (event.data === YT.PlayerState.ENDED) {
        setIsPlaying(false);
        if (playerRef.current && playlistRef.current.length > 0) {
          const d = playlistRef.current.length / numTracks;
          const random = Math.trunc(
            seedRef.current * d + Math.random() * d,
          );
          playerRef.current.playVideoAt(random);
        }
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const togglePlayer = useCallback(() => {
    if (!playerRef.current) return;
    const playerState = playerRef.current.getPlayerState();
    console.log("TOGGLING PLAYER", playerState);
    if (playerState === YT.PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, []);

  const handlePlayClick = useCallback(() => {
    togglePlayer();
  }, [togglePlayer]);

  const handleSkipPrevious = useCallback(() => {
    playerRef.current?.previousVideo();
  }, []);

  const handleSkipNext = useCallback(() => {
    playerRef.current?.nextVideo();
  }, []);

  const handleShuffle = useCallback(() => {
    if (playlist.length > 0) {
      const random = Math.trunc(Math.random() * playlist.length);
      playerRef.current?.playVideoAt(random);
    }
  }, [playlist]);

  const handleTrackClick = useCallback(
    (trackIndex: number) => {
      seedRef.current = trackIndex;
      setSeed(trackIndex);
      const d = playlist.length / numTracks;
      const random = Math.round(trackIndex * d + Math.random() * d);
      playerRef.current?.playVideoAt(random);
    },
    [playlist],
  );

  const handleVolumeUp = (isMouseDown: boolean) => {
    if (isMouseDown) {
      increasingRef.current = 1;
      holdingMouseRef.current = true;
    } else {
      holdingMouseRef.current = false;
    }
  };

  const handleVolumeDown = (isMouseDown: boolean) => {
    if (isMouseDown) {
      increasingRef.current = -1;
      holdingMouseRef.current = true;
    } else {
      holdingMouseRef.current = false;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 max-[30rem]:gap-1 relative px-16 pt-6 pb-4 max-[30rem]:px-[18px] max-[30rem]:pt-12 max-[30rem]:pb-[14px] max-w-[640px] shadow-[-4px_8px_32px_rgba(0,0,0,0.5)] border-t-2 border-t-white/10 border-l-2 border-l-black/50 rounded-xl bg-[#1a1a1a] wrap-after">
      <div className="flex flex-col gap-4 max-[30rem]:gap-[14px] relative bg-[#070707] border-b-2 border-b-white/5 border-t-2 border-t-black/50 px-24 py-8 max-[80rem]:px-6 max-[80rem]:py-4 max-[30rem]:px-2 max-[30rem]:py-[14px] rounded-xl max-w-[20rem] box-before box-after">
        <h1 className="text-2xl max-[30rem]:text-xl leading-none font-bold uppercase m-0">
          grooves and grams
        </h1>
        <div className="w-full aspect-square">
          <div id="youtube-player" className="w-full h-full"></div>
        </div>
        <Progress value={progress} />
        <div className="leading-none font-bold uppercase italic self-end flex items-start gap-2 max-[30rem]:gap-1">
          <span>With</span>
          <i className="icon text-2xl max-[80rem]:text-base max-[30rem]:text-xs">
            favorite
          </i>
          <span>by</span>
          <a
            href="https://nishan.rayamajhee.com"
            className="text-white no-underline border-b-[3px] border-b-white border-double pb-0 hover:border-solid"
          >
            nishan
          </a>
        </div>
      </div>
      <Keywell>
        <ButtonGroup>
          <Button onClick={handlePlayClick} isPressed={isPlaying}>
            {isPlaying ? <FiPause /> : <FiPlay />}
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button onClick={handleSkipPrevious}>
            <FiSkipBack />
          </Button>
          <Button onClick={handleSkipNext}>
            <FiSkipForward />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button onClick={handleShuffle}>
            <FiShuffle />
          </Button>
          <Button onClick={() => handleTrackClick(0)} variant="track">
            ♣
          </Button>
          <Button onClick={() => handleTrackClick(1)} variant="track">
            ♦
          </Button>
          <Button onClick={() => handleTrackClick(2)} variant="track">
            ♥
          </Button>
          <Button onClick={() => handleTrackClick(3)} variant="track">
            ♠
          </Button>
        </ButtonGroup>
        <Wheel
          ref={wheelRef}
          onVolumeUp={handleVolumeUp}
          onVolumeDown={handleVolumeDown}
        />
      </Keywell>
    </div>
  );
}
