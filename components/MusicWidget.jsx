'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './MusicWidget.module.css';
import { MUSIC_TRACKS } from '@/lib/musicLibrary';

const STORAGE_KEY = 'divine-portfolio:last-music-track';

function PlayPauseIcon({ playing }) {
  return playing ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5h3v14H8zM14 5h3v14h-3z" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l10-6.5z" fill="currentColor" />
    </svg>
  );
}

function PlaylistIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h12M4 11h12M4 16h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 14v6m-2-2 2 2 2-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrackArtwork({ track, small = false }) {
  return (
    <span className={small ? styles.trackArtworkSmall : styles.trackArtwork}>
      <Image
        src={track.coverSrc}
        alt=""
        fill
        sizes={small ? '34px' : '48px'}
        style={{ objectFit: 'cover' }}
      />
    </span>
  );
}

export default function MusicWidget() {
  const audioRef = useRef(null);
  const shouldPlayAfterSourceChange = useRef(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCollection, setActiveCollection] = useState('my-music');
  const [audioError, setAudioError] = useState(false);

  const currentTrack = MUSIC_TRACKS[currentTrackIndex];
  const visibleTracks = useMemo(
    () => MUSIC_TRACKS.filter((track) => track.collection === activeCollection),
    [activeCollection],
  );

  // Restore the last selected track for this browser profile.
  // The audio position is deliberately not saved: every visit starts at 0:00.
  useEffect(() => {
    try {
      const savedTrackId = window.localStorage.getItem(STORAGE_KEY);
      if (savedTrackId) {
        const savedIndex = MUSIC_TRACKS.findIndex((track) => track.id === savedTrackId);
        if (savedIndex >= 0) setCurrentTrackIndex(savedIndex);
      }
    } catch {
      // The player still works when browser storage is unavailable.
    }
    setHasLoadedPreference(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedPreference || !currentTrack) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, currentTrack.id);
    } catch {
      // Ignore storage restrictions; playback remains available.
    }
  }, [currentTrack, hasLoadedPreference]);

  // Load the selected audio file from the beginning. Browsers may reject
  // autoplay until the visitor interacts; the cover then starts playback.
  useEffect(() => {
    if (!hasLoadedPreference || !currentTrack || !audioRef.current) return;

    const audio = audioRef.current;
    setAudioError(false);
    audio.pause();
    audio.src = currentTrack.audioSrc;
    audio.load();

    if (shouldPlayAfterSourceChange.current) {
      audio.play().catch(() => {
        setIsPlaying(false);
        shouldPlayAfterSourceChange.current = false;
      });
    }
  }, [currentTrackIndex, currentTrack, hasLoadedPreference]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.paused) {
      shouldPlayAfterSourceChange.current = true;
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      shouldPlayAfterSourceChange.current = false;
      audio.pause();
    }
  }

  function selectTrack(track) {
    const nextIndex = MUSIC_TRACKS.findIndex((item) => item.id === track.id);
    if (nextIndex < 0) return;

    shouldPlayAfterSourceChange.current = true;
    setAudioError(false);
    setIsExpanded(false);

    if (nextIndex === currentTrackIndex) {
      const audio = audioRef.current;
      if (audio?.paused) audio.play().catch(() => setIsPlaying(false));
      return;
    }

    setCurrentTrackIndex(nextIndex);
  }

  function playNextTrack() {
    if (MUSIC_TRACKS.length < 1) return;
    shouldPlayAfterSourceChange.current = true;
    setCurrentTrackIndex((index) => (index + 1) % MUSIC_TRACKS.length);
  }

  useEffect(() => {
    if (!isExpanded) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsExpanded(false);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  if (!currentTrack) return null;

  return (
    <div className={styles.musicWidget}>
      {isExpanded && (
        <section className={styles.playlistPanel} aria-label="Music playlist">
          <header className={styles.panelHeader}>
            <span className={styles.panelTitle}>MUSIC</span>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsExpanded(false)}
              aria-label="Minimise music playlist"
            >
              <CloseIcon />
            </button>
          </header>

          <div className={styles.tabs} role="tablist" aria-label="Music collections">
            <button
              type="button"
              role="tab"
              aria-selected={activeCollection === 'my-music'}
              className={activeCollection === 'my-music' ? styles.activeTab : styles.tab}
              onClick={() => setActiveCollection('my-music')}
            >
              My Music
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeCollection === 'inspiration'}
              className={activeCollection === 'inspiration' ? styles.activeTab : styles.tab}
              onClick={() => setActiveCollection('inspiration')}
            >
              Inspiration
            </button>
          </div>

          <div className={styles.trackList} role="tabpanel">
            {visibleTracks.length > 0 ? (
              visibleTracks.map((track) => {
                const isCurrentTrack = track.id === currentTrack.id;
                return (
                  <button
                    type="button"
                    key={track.id}
                    className={`${styles.trackRow} ${isCurrentTrack ? styles.currentTrack : ''}`}
                    onClick={() => selectTrack(track)}
                    aria-current={isCurrentTrack ? 'true' : undefined}
                  >
                    <TrackArtwork track={track} small />
                    <span className={styles.trackText}>
                      <span className={styles.trackTitle}>{track.title}</span>
                      <span className={styles.trackArtist}>{track.artist}</span>
                    </span>
                    {isCurrentTrack && isPlaying && (
                      <span className={styles.playingMark} aria-label="Playing"><i /><i /><i /></span>
                    )}
                  </button>
                );
              })
            ) : (
              <p className={styles.emptyMessage}>No tracks in this collection yet.</p>
            )}
          </div>

          {audioError && (
            <p className={styles.errorMessage}>Couldn&apos;t load this audio file. Check its file path.</p>
          )}
        </section>
      )}

      <div className={styles.compactPlayer}>
        <button
          type="button"
          className={styles.coverButton}
          onClick={togglePlayback}
          aria-label={`${isPlaying ? 'Pause' : 'Play'} ${currentTrack.title}`}
          title={`${isPlaying ? 'Pause' : 'Play'} music`}
        >
          <TrackArtwork track={currentTrack} />
          <span className={styles.coverControl}><PlayPauseIcon playing={isPlaying} /></span>
          {isPlaying && <span className={styles.soundIndicator} aria-hidden="true"><i /><i /><i /></span>}
        </button>
        <button
          type="button"
          className={`${styles.playlistButton} ${isExpanded ? styles.playlistButtonActive : ''}`}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-label={isExpanded ? 'Close music playlist' : 'Open music playlist'}
          aria-expanded={isExpanded}
          title="Open music playlist"
        >
          <PlaylistIcon />
        </button>
      </div>

      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={playNextTrack}
        onError={() => {
          setAudioError(true);
          setIsPlaying(false);
        }}
      />
    </div>
  );
}
