/**
 * Mystical Sound Manager
 * Handles ambient background music and sound effects for fortune readings
 */

export type SoundTrack = 'crystal-cave' | 'mystic-forest' | 'cosmic-meditation' | 'temple-bells' | 'ocean-wisdom';
export type SoundEffect = 'card-flip' | 'crystal-chime' | 'mystical-reveal' | 'cosmic-transition' | 'energy-pulse';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private currentTrack: HTMLAudioElement | null = null;
  private soundEffects: Map<SoundEffect, HTMLAudioElement> = new Map();
  private isEnabled: boolean = true;
  private volume: number = 0.3;
  private crossfadeDuration: number = 2000; // 2 seconds

  constructor() {
    this.initializeAudioContext();
    this.loadSoundEffects();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private loadSoundEffects() {
    const effects: Record<SoundEffect, string> = {
      'card-flip': '/sounds/card-flip.mp3',
      'crystal-chime': '/sounds/crystal-chime.mp3',
      'mystical-reveal': '/sounds/mystical-reveal.mp3',
      'cosmic-transition': '/sounds/cosmic-transition.mp3',
      'energy-pulse': '/sounds/energy-pulse.mp3'
    };

    Object.entries(effects).forEach(([effect, url]) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = this.volume * 0.7; // Sound effects slightly quieter than music
      
      // Use Web Audio API oscillator as fallback for missing files
      audio.addEventListener('error', () => {
        console.log(`Sound file not found: ${url}, using synthesized sound`);
        this.createSynthesizedSound(effect as SoundEffect);
      });
      
      audio.src = url;
      this.soundEffects.set(effect as SoundEffect, audio);
    });
  }

  private createSynthesizedSound(effect: SoundEffect) {
    if (!this.audioContext) return;

    const synthesizedAudio = new Audio();
    
    // Create different synthesized sounds based on effect type
    const frequencies = {
      'card-flip': [220, 330, 0.1],
      'crystal-chime': [523, 659, 0.8],
      'mystical-reveal': [174, 285, 1.2],
      'cosmic-transition': [110, 220, 0.6],
      'energy-pulse': [40, 80, 0.3]
    };

    const [freq1, freq2, duration] = frequencies[effect] || [220, 330, 0.5];
    
    // Generate tone using Web Audio API
    synthesizedAudio.addEventListener('play', () => {
      this.playTone(freq1, duration * 0.7);
      setTimeout(() => this.playTone(freq2, duration * 0.3), duration * 700);
    });

    this.soundEffects.set(effect, synthesizedAudio);
  }

  private playTone(frequency: number, duration: number) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  async playBackgroundMusic(track: SoundTrack) {
    if (!this.isEnabled) return;

    // Resume audio context if suspended (required for user interaction)
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }

    const trackUrls: Record<SoundTrack, string> = {
      'crystal-cave': '/sounds/crystal-cave-ambient.mp3',
      'mystic-forest': '/sounds/mystic-forest-ambient.mp3',
      'cosmic-meditation': '/sounds/cosmic-meditation.mp3',
      'temple-bells': '/sounds/temple-bells-ambient.mp3',
      'ocean-wisdom': '/sounds/ocean-wisdom.mp3'
    };

    const newAudio = new Audio();
    newAudio.src = trackUrls[track];
    newAudio.loop = true;
    newAudio.volume = 0;
    newAudio.preload = 'auto';

    // Handle missing audio files gracefully
    newAudio.addEventListener('error', () => {
      console.log(`Background music file not found: ${trackUrls[track]}, using ambient synthesis`);
      this.playAmbientSynthesis(track);
    });

    try {
      await newAudio.play();
      
      // Crossfade from current track to new track
      if (this.currentTrack) {
        this.crossfadeAudio(this.currentTrack, newAudio);
      } else {
        // Fade in new track
        this.fadeInAudio(newAudio);
      }
      
      this.currentTrack = newAudio;
    } catch (error) {
      console.warn('Could not play background music:', error);
      this.playAmbientSynthesis(track);
    }
  }

  private playAmbientSynthesis(track: SoundTrack) {
    if (!this.audioContext || !this.isEnabled) return;

    // Create ambient synthesis based on track type
    const trackConfigs = {
      'crystal-cave': { frequencies: [110, 165, 220], rhythm: 4000 },
      'mystic-forest': { frequencies: [87, 130, 174], rhythm: 6000 },
      'cosmic-meditation': { frequencies: [55, 82, 110], rhythm: 8000 },
      'temple-bells': { frequencies: [174, 261, 349], rhythm: 3000 },
      'ocean-wisdom': { frequencies: [65, 98, 146], rhythm: 5000 }
    };

    const config = trackConfigs[track];
    this.createAmbientLoop(config.frequencies, config.rhythm);
  }

  private createAmbientLoop(frequencies: number[], intervalMs: number) {
    if (!this.audioContext) return;

    const playAmbientTone = () => {
      const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
      const duration = 2 + Math.random() * 3; // 2-5 second tones
      this.playTone(frequency, duration);
    };

    // Play initial tone
    playAmbientTone();

    // Set up recurring ambient tones
    const intervalId = setInterval(() => {
      if (this.isEnabled) {
        playAmbientTone();
      } else {
        clearInterval(intervalId);
      }
    }, intervalMs + Math.random() * 2000); // Add some randomness

    // Store interval ID for cleanup
    (this as any).ambientIntervalId = intervalId;
  }

  private crossfadeAudio(oldAudio: HTMLAudioElement, newAudio: HTMLAudioElement) {
    const steps = 50;
    const stepDuration = this.crossfadeDuration / steps;
    let step = 0;

    const crossfadeInterval = setInterval(() => {
      step++;
      const progress = step / steps;
      
      oldAudio.volume = this.volume * (1 - progress);
      newAudio.volume = this.volume * progress;

      if (step >= steps) {
        clearInterval(crossfadeInterval);
        oldAudio.pause();
        oldAudio.src = '';
      }
    }, stepDuration);
  }

  private fadeInAudio(audio: HTMLAudioElement) {
    const steps = 30;
    const stepDuration = 1000 / steps; // 1 second fade in
    let step = 0;

    const fadeInterval = setInterval(() => {
      step++;
      audio.volume = this.volume * (step / steps);

      if (step >= steps) {
        clearInterval(fadeInterval);
      }
    }, stepDuration);
  }

  playSoundEffect(effect: SoundEffect) {
    if (!this.isEnabled) return;

    const audio = this.soundEffects.get(effect);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.warn(`Could not play sound effect ${effect}:`, error);
      });
    }
  }

  stopBackgroundMusic() {
    if (this.currentTrack) {
      const audio = this.currentTrack;
      const steps = 20;
      const stepDuration = 1000 / steps; // 1 second fade out
      let step = 0;

      const fadeInterval = setInterval(() => {
        step++;
        audio.volume = this.volume * (1 - step / steps);

        if (step >= steps) {
          clearInterval(fadeInterval);
          audio.pause();
          audio.src = '';
          this.currentTrack = null;
        }
      }, stepDuration);
    }

    // Clear ambient synthesis
    if ((this as any).ambientIntervalId) {
      clearInterval((this as any).ambientIntervalId);
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.currentTrack) {
      this.currentTrack.volume = this.volume;
    }

    this.soundEffects.forEach(audio => {
      audio.volume = this.volume * 0.7;
    });

    // Store in localStorage
    localStorage.setItem('mystic-fortune-volume', this.volume.toString());
  }

  getVolume(): number {
    return this.volume;
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    
    if (!enabled) {
      this.stopBackgroundMusic();
    }

    // Store in localStorage
    localStorage.setItem('mystic-fortune-sound-enabled', enabled.toString());
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  // Initialize from stored preferences
  loadPreferences() {
    const storedVolume = localStorage.getItem('mystic-fortune-volume');
    if (storedVolume) {
      this.setVolume(parseFloat(storedVolume));
    }

    const storedEnabled = localStorage.getItem('mystic-fortune-sound-enabled');
    if (storedEnabled !== null) {
      this.setEnabled(storedEnabled === 'true');
    }
  }

  // Get appropriate background music for different fortune types
  getRecommendedTrack(fortuneType: 'crystal-ball' | 'horoscope' | 'tarot' | 'general'): SoundTrack {
    const recommendations = {
      'crystal-ball': 'crystal-cave',
      'horoscope': 'cosmic-meditation',
      'tarot': 'mystic-forest',
      'general': 'temple-bells'
    } as const;

    return recommendations[fortuneType] || 'ocean-wisdom';
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Initialize preferences on load
soundManager.loadPreferences();