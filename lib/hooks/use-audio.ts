import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAudioOptions {
  src?: string;
  preload?: "none" | "metadata" | "auto";
  initialVolume?: number; // 0..1
  initialRate?: number; // e.g. 1, 1.25
}

export function useAudio(options: UseAudioOptions = {}) {
  const {
    src,
    preload = "metadata",
    initialVolume = 1,
    initialRate = 1,
  } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(initialRate);
  const [canPlay, setCanPlay] = useState(false);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const a = new Audio();
    a.preload = preload;
    a.volume = initialVolume;
    a.playbackRate = initialRate;
    if (src) a.src = src;
    audioRef.current = a;

    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => setCurrentTime(a.currentTime || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onCanPlay = () => setCanPlay(true);
    const onProgress = () => {
      try {
        if (a.buffered.length)
          setBufferedEnd(a.buffered.end(a.buffered.length - 1));
      } catch {}
    };
    const onVolume = () => {
      setVolume(a.volume);
      setMuted(a.muted);
    };
    const onRate = () => setRate(a.playbackRate);
    const onError = () =>
      setError(a.error ? a.error.message : "Playback error");

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("progress", onProgress);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("canplay", onCanPlay);
    a.addEventListener("volumechange", onVolume);
    a.addEventListener("ratechange", onRate);
    a.addEventListener("error", onError);

    return () => {
      a.pause();
      a.src = "";
      a.load();
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("progress", onProgress);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("canplay", onCanPlay);
      a.removeEventListener("volumechange", onVolume);
      a.removeEventListener("ratechange", onRate);
      a.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [src, preload, initialVolume, initialRate]);

  const play = useCallback(async () => {
    try {
      await audioRef.current?.play();
    } catch (e) {
      console.log(e);
      /* iOS requires user gesture */
    }
  }, []);
  const pause = useCallback(() => audioRef.current?.pause(), []);
  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  }, []);
  const setVol = useCallback((v: number) => {
    if (audioRef.current) audioRef.current.volume = v;
  }, []);
  const toggleMute = useCallback(() => {
    if (audioRef.current) audioRef.current.muted = !audioRef.current.muted;
  }, []);
  const setPlaybackRate = useCallback((r: number) => {
    if (audioRef.current) audioRef.current.playbackRate = r;
  }, []);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    rate,
    canPlay,
    bufferedEnd,
    error,
    play,
    pause,
    seek,
    setVol,
    toggleMute,
    setPlaybackRate,
  } as const;
}
