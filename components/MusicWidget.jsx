
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./MusicWidget.module.css";
import { MUSIC_COLLECTIONS, MUSIC_TRACKS } from "@/lib/musicLibrary";

const STORAGE_KEY = "divine-portfolio-last-played-track";

// Keep only tracks with the information needed for playback.
const TRACKS = Array.isArray(MUSIC_TRACKS)
  ? MUSIC_TRACKS.filter((track) => track?.id && track?.audioSrc)
  : [];

function Icon({ name, size = 16 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (name) {
    case "play":
      return (
        <svg {...common}>
          <path d="m8 5 12 7-12 7V5Z" fill="currentColor" stroke="none" />
        </svg>
      );

    case "pause":
      return (
        <svg {...common}>
          <path d="M9 5v14M15 5v14" strokeWidth="2.5" />
        </svg>
      );

    case "list":
      return (
        <svg {...common}>
          <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" strokeWidth="2.2" />
        </svg>
      );

    case "minimise":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
        </svg>
      );

    case "music":
      return (
        <svg {...common}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );

    default:
      return null;
  }
}

export default function MusicWidget() {
  const audioRef = useRef(null);
  const activeTrackIdRef = useRef(TRACKS[0]?.id ?? null);
  const loadedTrackIdRef = useRef(null);
  const playIntentRef = useRef(false);

  const [activeTrackId, setActiveTrackId] = useState(TRACKS[0]?.id ?? null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeCollection, setActiveCollection] = useState(
    MUSIC_COLLECTIONS.MY_MUSIC
  );
  const [coverFailed, setCoverFailed] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const activeTrack = TRACKS.find((track) => track.id === activeTrackId) ?? null;

  // Keep this ref current for the audio-ended event.
  activeTrackIdRef.current = activeTrackId;

  // Load a track from the beginning, optionally starting playback.
  const loadTrack = useCallback((track, shouldPlay = false) => {
    const audio = audioRef.current;

    if (!audio || !track) return;

    audio.pause();
    audio.src = track.audioSrc;
    audio.load();

    try {
      audio.currentTime = 0;
    } catch {
      // The audio file may not have loaded metadata yet.
    }

    loadedTrackIdRef.current = track.id;
    playIntentRef.current = shouldPlay;
    setAudioError(false);
    setAutoplayBlocked(false);

    if (shouldPlay) {
      const playRequest = audio.play();

      if (playRequest) {
        playRequest.catch((error) => {
          playIntentRef.current = false;
          setIsPlaying(false);

          if (error?.name === "NotAllowedError") {
            setAutoplayBlocked(true);
          } else if (error?.name !== "AbortError") {
            setAudioError(true);
          }
        });
      }
    }
  }, []);

  // Create one audio element and keep it alive while the website is mounted.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = 0.20; // Default background music volume: 20%
    audioRef.current = audio;

    const handlePlay = () => {
      setIsPlaying(true);
      setAutoplayBlocked(false);
      setAudioError(false);
    };
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      if (TRACKS.length === 0) return;

      const currentIndex = TRACKS.findIndex(
        (track) => track.id === activeTrackIdRef.current
      );

      const nextIndex = (currentIndex + 1) % TRACKS.length;
      const nextTrack = TRACKS[nextIndex];

      if (nextTrack.id === activeTrackIdRef.current) {
        // A collection containing one song should still loop continuously.
        loadTrack(nextTrack, true);
      } else {
        // The track-loading effect starts the next song automatically.
        playIntentRef.current = true;
        setActiveTrackId(nextTrack.id);
      }
    };

    const handleError = () => {
      if (!audio.src) return;

      playIntentRef.current = false;
      setIsPlaying(false);
      setAudioError(true);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeAttribute("src");
      audioRef.current = null;
    };
  }, [loadTrack]);

  // Retrieve the last selected track for this browser.
  // Playback does NOT automatically resume when the visitor returns.
  useEffect(() => {
    try {
      const savedTrackId = window.localStorage.getItem(STORAGE_KEY);

      if (savedTrackId && TRACKS.some((track) => track.id === savedTrackId)) {
        setActiveTrackId(savedTrackId);
      }
    } catch {
      // The player can still work if browser storage is unavailable.
    }

    setIsHydrated(true);
  }, []);

  // Load the remembered track from 0:00 when the player is ready.
  useEffect(() => {
  if (!isHydrated || !activeTrack) return;

  if (loadedTrackIdRef.current !== activeTrack.id) {
    // Attempt to start the remembered song automatically.
    // The browser may require the visitor to click Play.
    playIntentRef.current = true;
    loadTrack(activeTrack, true);
  }
}, [activeTrack, isHydrated, loadTrack]);

  // Remember the selected track, never its playback position.
  useEffect(() => {
    if (!isHydrated || !activeTrackId) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, activeTrackId);
    } catch {
      // Playback remains available without local storage.
    }
  }, [activeTrackId, isHydrated]);

  // Reset the cover fallback when a different song is selected.
  useEffect(() => {
    setCoverFailed(false);
  }, [activeTrackId]);

  const togglePlayback = () => {
    const audio = audioRef.current;

    if (!activeTrack || !audio) {
      setIsPlaylistOpen(true);
      return;
    }

    if (playIntentRef.current || !audio.paused) {
      playIntentRef.current = false;
      audio.pause();
      return;
    }

    if (loadedTrackIdRef.current !== activeTrack.id) {
      loadTrack(activeTrack, true);
      return;
    }

    playIntentRef.current = true;
    setAudioError(false);

    const playRequest = audio.play();

    if (playRequest) {
      playRequest.catch(() => {
        playIntentRef.current = false;
        setAudioError(true);
      });
    }
  };

  const selectTrack = (track) => {
    // Selecting a song always begins it at 0:00.
    setActiveTrackId(track.id);
    activeTrackIdRef.current = track.id;
    setIsPlaylistOpen(false);
    loadTrack(track, true);
  };

  const visibleTracks = TRACKS.filter(
    (track) => track.collection === activeCollection
  );

  const handleMinimise = () => {
    setIsPlaylistOpen(false);
    setIsMinimized(true);
  };

  // The widget can be reduced to a tiny button without stopping the music.
  if (isMinimized) {
    return (
      <div className={styles.player}>
        <button
          type="button"
          className={styles.restoreButton}
          onClick={() => setIsMinimized(false)}
          aria-label="Show music player"
          title="Show music player"
        >
          <Icon name="music" size={15} />
          <span className={styles.statusIndicator} />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.player}>
      {/* Compact playlist pop-up */}
      {isPlaylistOpen && (
        <div className={styles.playlistPanel} role="dialog" aria-label="Music playlist">
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Music</span>

            <button
              type="button"
              className={styles.panelClose}
              onClick={() => setIsPlaylistOpen(false)}
              aria-label="Close playlist"
              title="Close playlist"
            >
              <Icon name="minimise" size={15} />
            </button>
          </div>

          <div className={styles.collectionTabs}>
            <button
              type="button"
              className={`${styles.collectionTab} ${
                activeCollection === MUSIC_COLLECTIONS.MY_MUSIC
                  ? styles.activeTab
                  : ""
              }`}
              onClick={() => setActiveCollection(MUSIC_COLLECTIONS.MY_MUSIC)}
              aria-pressed={activeCollection === MUSIC_COLLECTIONS.MY_MUSIC}
            >
              My Music
            </button>

            <button
              type="button"
              className={`${styles.collectionTab} ${
                activeCollection === MUSIC_COLLECTIONS.INSPIRATION
                  ? styles.activeTab
                  : ""
              }`}
              onClick={() => setActiveCollection(MUSIC_COLLECTIONS.INSPIRATION)}
              aria-pressed={activeCollection === MUSIC_COLLECTIONS.INSPIRATION}
            >
              Inspiration
            </button>
          </div>

          <div className={styles.trackList}>
            {visibleTracks.length > 0 ? (
              visibleTracks.map((track) => {
                const isCurrentTrack = track.id === activeTrackId;

                return (
                  <button
                    type="button"
                    key={track.id}
                    className={`${styles.trackRow} ${
                      isCurrentTrack ? styles.currentTrack : ""
                    }`}
                    onClick={() => selectTrack(track)}
                    aria-current={isCurrentTrack ? "true" : undefined}
                  >
                    <span className={styles.trackMarker}>
                      {isCurrentTrack && isPlaying ? (
                        <span className={styles.equaliser} aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </span>
                      ) : (
                        <Icon name="play" size={12} />
                      )}
                    </span>

                    <span className={styles.trackText}>
                      <span className={styles.trackTitle}>
                        {track.title || "Untitled track"}
                      </span>
                      <span className={styles.trackArtist}>
                        {track.artist || "Unknown artist"}
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <p className={styles.emptyState}>No tracks added yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Controls appear on hover, focus or touch devices. */}
      <div className={styles.quickControls}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          title={isPlaying ? "Pause music" : "Play music"}
          disabled={!activeTrack}
        >
          <Icon name={isPlaying ? "pause" : "play"} size={15} />
        </button>

        <button
          type="button"
          className={`${styles.controlButton} ${
            isPlaylistOpen ? styles.controlActive : ""
          }`}
          onClick={() => setIsPlaylistOpen((open) => !open)}
          aria-label="Open music playlist"
          aria-expanded={isPlaylistOpen}
          title="Open music playlist"
        >
          <Icon name="list" size={16} />
        </button>

        <button
          type="button"
          className={styles.controlButton}
          onClick={handleMinimise}
          aria-label="Minimise music player"
          title="Minimise music player"
        >
          <Icon name="minimise" size={15} />
        </button>
      </div>

      {/* Album artwork is the main visible part of the player. */}
      <button
        type="button"
        className={`${styles.coverButton} ${
          isPlaying ? styles.coverPlaying : ""
        }`}
        onClick={togglePlayback}
        aria-label={
          isPlaying
            ? "Pause background music"
            : "Play background music"
        }
        title={
          audioError
            ? "Unable to load this music file."
            : autoplayBlocked
              ? "Click to start music. Your browser blocked autoplay."
              : activeTrack
                ? `${activeTrack.title || "Music"} — ${activeTrack.artist || "Unknown artist"}`
                : "Open music player"
        }
      >
        {activeTrack?.coverSrc && !coverFailed ? (
          <Image
            src={activeTrack.coverSrc}
            alt=""
            fill
            sizes="48px"
            className={styles.coverImage}
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <span className={styles.coverFallback}>
            <Icon name="music" size={19} />
          </span>
        )}

        <span
          className={`${styles.statusIndicator} ${
            isPlaying ? styles.statusPlaying : ""
          }`}
        />
      </button>
    </div>
  );
}