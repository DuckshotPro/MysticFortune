import { useEffect, useCallback } from "react";
import { soundManager, type SoundTrack, type SoundEffect } from "@/lib/soundManager";

export function useSound() {
  // Initialize sound manager on mount
  useEffect(() => {
    soundManager.loadPreferences();
  }, []);

  const playBackgroundMusic = useCallback(async (track: SoundTrack) => {
    await soundManager.playBackgroundMusic(track);
  }, []);

  const playSoundEffect = useCallback((effect: SoundEffect) => {
    soundManager.playSoundEffect(effect);
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    soundManager.stopBackgroundMusic();
  }, []);

  const setVolume = useCallback((volume: number) => {
    soundManager.setVolume(volume);
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    soundManager.setEnabled(enabled);
  }, []);

  const getRecommendedTrack = useCallback((fortuneType: 'crystal-ball' | 'horoscope' | 'tarot' | 'general') => {
    return soundManager.getRecommendedTrack(fortuneType);
  }, []);

  // Auto-play appropriate background music for fortune types
  const playFortuneMusic = useCallback(async (fortuneType: 'crystal-ball' | 'horoscope' | 'tarot' | 'general') => {
    const track = getRecommendedTrack(fortuneType);
    await playBackgroundMusic(track);
  }, [getRecommendedTrack, playBackgroundMusic]);

  return {
    playBackgroundMusic,
    playSoundEffect,
    stopBackgroundMusic,
    setVolume,
    setEnabled,
    getRecommendedTrack,
    playFortuneMusic,
    isEnabled: soundManager.isAudioEnabled(),
    volume: soundManager.getVolume()
  };
}