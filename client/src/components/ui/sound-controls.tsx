import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faVolumeUp, 
  faVolumeOff, 
  faMusic, 
  faCog,
  faPlay,
  faPause 
} from "@fortawesome/free-solid-svg-icons";
import { soundManager, type SoundTrack } from "@/lib/soundManager";

interface SoundControlsProps {
  className?: string;
  compact?: boolean;
}

export function SoundControls({ className = "", compact = false }: SoundControlsProps) {
  const [isEnabled, setIsEnabled] = useState(soundManager.isAudioEnabled());
  const [volume, setVolume] = useState(soundManager.getVolume() * 100);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SoundTrack | null>(null);

  useEffect(() => {
    // Load initial preferences
    setIsEnabled(soundManager.isAudioEnabled());
    setVolume(soundManager.getVolume() * 100);
  }, []);

  const handleToggleEnabled = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    soundManager.setEnabled(newEnabled);
    
    if (!newEnabled) {
      soundManager.stopBackgroundMusic();
      setCurrentTrack(null);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    soundManager.setVolume(newVolume / 100);
  };

  const handleTrackSelect = async (track: SoundTrack) => {
    if (!isEnabled) return;
    
    if (currentTrack === track) {
      soundManager.stopBackgroundMusic();
      setCurrentTrack(null);
    } else {
      await soundManager.playBackgroundMusic(track);
      setCurrentTrack(track);
    }
  };

  const trackDescriptions: Record<SoundTrack, string> = {
    'crystal-cave': 'Ethereal crystal harmonics',
    'mystic-forest': 'Enchanted woodland whispers',
    'cosmic-meditation': 'Deep space tranquility',
    'temple-bells': 'Sacred temple ambience',
    'ocean-wisdom': 'Oceanic wisdom flows'
  };

  const trackEmojis: Record<SoundTrack, string> = {
    'crystal-cave': '💎',
    'mystic-forest': '🌲',
    'cosmic-meditation': '🌌',
    'temple-bells': '🔔',
    'ocean-wisdom': '🌊'
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleEnabled}
          className={`${isEnabled ? 'text-amber-400' : 'text-gray-500'} hover:text-amber-300`}
        >
          <FontAwesomeIcon icon={isEnabled ? faVolumeUp : faVolumeOff} />
        </Button>
        
        {isEnabled && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-300 hover:text-purple-200"
          >
            <FontAwesomeIcon icon={faMusic} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="bg-purple-900/30 border-purple-700/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-amber-400 flex items-center gap-2">
              <FontAwesomeIcon icon={faMusic} />
              Mystical Soundscape
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-300 hover:text-purple-200"
            >
              <FontAwesomeIcon icon={faCog} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Master Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleEnabled}
                className={`${
                  isEnabled ? 'text-amber-400 bg-amber-400/10' : 'text-gray-500'
                } hover:text-amber-300`}
              >
                <FontAwesomeIcon icon={isEnabled ? faVolumeUp : faVolumeOff} className="mr-2" />
                {isEnabled ? 'Enabled' : 'Disabled'}
              </Button>
              
              {currentTrack && (
                <Badge variant="secondary" className="bg-purple-700/50 text-purple-200">
                  <FontAwesomeIcon icon={faPlay} className="mr-1 text-xs" />
                  Playing
                </Badge>
              )}
            </div>
          </div>

          {/* Volume Control */}
          {isEnabled && (
            <div className="space-y-2">
              <label className="text-sm text-white/80">Volume</label>
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-white/60 text-right">{Math.round(volume)}%</div>
            </div>
          )}

          {/* Track Selection */}
          {isEnabled && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <label className="text-sm text-white/80 block">Ambient Tracks</label>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(trackDescriptions) as SoundTrack[]).map((track) => (
                  <Button
                    key={track}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTrackSelect(track)}
                    className={`justify-start h-auto p-3 ${
                      currentTrack === track
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                        : 'bg-purple-800/20 text-white/80 hover:bg-purple-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-lg">{trackEmojis[track]}</span>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium capitalize">
                          {track.replace('-', ' ')}
                        </div>
                        <div className="text-xs opacity-75">
                          {trackDescriptions[track]}
                        </div>
                      </div>
                      {currentTrack === track && (
                        <FontAwesomeIcon icon={faPause} className="text-amber-400" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          {isEnabled && !isExpanded && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTrackSelect('crystal-cave')}
                className="flex-1 bg-purple-800/20 border-purple-600/50 text-purple-200 hover:bg-purple-700/30"
              >
                Crystal Cave
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTrackSelect('cosmic-meditation')}
                className="flex-1 bg-purple-800/20 border-purple-600/50 text-purple-200 hover:bg-purple-700/30"
              >
                Cosmic
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}