import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, ListMusic, Sparkles, Check, RotateCcw } from 'lucide-react';
import { arabicAudio, AudioPlayerState, WeddingTrack, WEDDING_TRACKS } from '../utils/audioController';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const MusicController: React.FC = () => {
  const [playerState, setPlayerState] = useState<AudioPlayerState>(arabicAudio.getState());
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [scrubValue, setScrubValue] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = arabicAudio.subscribe((_playing, state) => {
      setPlayerState(state);
      if (!isScrubbing) {
        setScrubValue(state.currentTime);
      }
    });
    return () => unsubscribe();
  }, [isScrubbing]);

  const handleToggle = () => {
    arabicAudio.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    arabicAudio.setVolume(val);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setScrubValue(val);
  };

  const handleSeekCommit = () => {
    setIsScrubbing(false);
    arabicAudio.seek(scrubValue);
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    arabicAudio.seek(0);
    if (!playerState.isPlaying) {
      arabicAudio.play();
    }
  };

  const handleSelectTrack = (track: WeddingTrack) => {
    arabicAudio.switchTrack(track.id);
    setShowPlaylist(false);
  };

  const currentDuration = playerState.duration || playerState.currentTrack.durationSec;
  const currentProgress = currentDuration > 0 ? (playerState.currentTime / currentDuration) * 100 : 0;

  return (
    <aside
      aria-label="Royal Wedding Audio Player"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2.5 select-none"
    >
      {/* Track Selector Popup */}
      {showPlaylist && (
        <div
          role="region"
          aria-label="Wedding Playlist"
          className="w-72 sm:w-80 bg-[#04140e]/95 border border-[#cca052]/60 rounded-2xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fadeIn text-[#f4efe6] mb-1"
        >
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#cca052]/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#fce8a6]" />
              <span className="font-cinzel text-xs tracking-wider text-[#fce8a6] font-semibold uppercase">
                Wedding Soundtrack (2+ Min)
              </span>
            </div>
            <button
              onClick={() => setShowPlaylist(false)}
              className="text-[#cca052]/70 hover:text-[#fce8a6] text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {WEDDING_TRACKS.map((t) => {
              const isSelected = t.id === playerState.currentTrack.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTrack(t)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#0c3325]/90 border-[#cca052] shadow-inner'
                      : 'bg-[#061e16]/60 border-[#cca052]/20 hover:border-[#cca052]/50 hover:bg-[#08281d]'
                  }`}
                >
                  <div className="flex flex-col pr-2 min-w-0">
                    <span className="font-cinzel text-xs text-[#fce8a6] truncate font-medium">
                      {t.title}
                    </span>
                    <span className="text-[10px] text-[#cca052]/80 truncate">
                      {t.artist} · {formatTime(t.durationSec)}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#fce8a6] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Floating Audio Bar */}
      <div className="flex items-center gap-2">
        {/* Dynamic Interactive Music Pill */}
        {playerState.isPlaying ? (
          <div
            className="flex items-center gap-2.5 bg-[#051c14]/95 border border-[#cca052]/60 hover:border-[#cca052] rounded-full pl-3.5 pr-2.5 py-1.5 shadow-[0_6px_25px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all group max-w-[280px] sm:max-w-none"
          >
            {/* Equalizer animation */}
            <button
              onClick={handleToggle}
              className="flex items-end gap-[3px] h-4 cursor-pointer"
              title="Click to pause"
              aria-label="Pause"
            >
              <span className="w-[2.5px] bg-[#fce8a6] rounded-full animate-[bounce_1s_infinite_ease-in-out_100ms] h-2.5" />
              <span className="w-[2.5px] bg-[#cca052] rounded-full animate-[bounce_1.2s_infinite_ease-in-out_300ms] h-4" />
              <span className="w-[2.5px] bg-[#fce8a6] rounded-full animate-[bounce_0.9s_infinite_ease-in-out_200ms] h-2" />
            </button>

            {/* Track Info & Progress */}
            <div className="flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-[10px] sm:text-[11px] tracking-wider text-[#fce8a6] truncate max-w-[140px] sm:max-w-[200px] font-semibold">
                  {playerState.currentTrack.title}
                </span>
                <span className="font-mono text-[9px] text-[#cca052] whitespace-nowrap bg-[#020b08] px-1.5 py-0.5 rounded border border-[#cca052]/30">
                  {formatTime(playerState.currentTime)} / {formatTime(currentDuration)}
                </span>
              </div>

              {/* Mini scrub progress bar */}
              <div className="w-full mt-1 flex items-center gap-1.5">
                <input
                  type="range"
                  min="0"
                  max={currentDuration}
                  step="0.5"
                  value={isScrubbing ? scrubValue : playerState.currentTime}
                  onMouseDown={() => setIsScrubbing(true)}
                  onTouchStart={() => setIsScrubbing(true)}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekCommit}
                  onTouchEnd={handleSeekCommit}
                  className="w-28 sm:w-36 accent-[#cca052] cursor-pointer h-1 rounded-lg bg-[#020a07]"
                  aria-label="Audio seeker"
                />
              </div>
            </div>

            {/* Restart button */}
            <button
              onClick={handleRestart}
              className="text-[#cca052]/70 hover:text-[#fce8a6] p-1 rounded-full hover:bg-[#0c3325] transition-colors cursor-pointer"
              title="Restart song"
              aria-label="Restart song"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Playlist switcher trigger */}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="text-[#cca052]/70 hover:text-[#fce8a6] p-1 rounded-full hover:bg-[#0c3325] transition-colors cursor-pointer"
              title="Change soundtrack (2+ min tracks)"
              aria-label="Change soundtrack"
            >
              <ListMusic className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 bg-[#061e16]/95 border border-[#cca052]/70 hover:border-[#fce8a6] rounded-full px-4 py-2 shadow-2xl backdrop-blur-md text-[#fce8a6] hover:bg-[#0c3325] transition-all cursor-pointer animate-pulse"
            title="Click to play 3-minute wedding song"
          >
            <Play className="w-3.5 h-3.5 text-[#cca052] fill-[#cca052]" />
            <div className="flex flex-col text-left">
              <span className="font-cinzel text-[10px] sm:text-[11px] tracking-wider text-[#fce8a6] whitespace-nowrap font-semibold">
                Play "Bismillah" Song (3 Min)
              </span>
              <span className="text-[9px] text-[#cca052]/80">
                Salim-Sulaiman & Kailash Kher
              </span>
            </div>
          </button>
        )}

        {/* Volume slider popover */}
        {showVolume && (
          <div
            role="region"
            aria-label="Volume adjustment"
            className="bg-[#061e16]/95 border border-[#cca052]/50 rounded-full px-3 py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-2 animate-fadeIn"
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={playerState.volume}
              onChange={handleVolumeChange}
              className="w-20 accent-[#cca052] cursor-pointer h-1.5 rounded-lg bg-[#020a07]"
              aria-label="Volume level"
            />
          </div>
        )}

        {/* Main Floating Button */}
        <div className="relative group">
          <button
            onClick={handleToggle}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowVolume((prev) => !prev);
            }}
            className={`w-12 h-12 rounded-full border border-[#cca052]/70 bg-[#08241b]/95 backdrop-blur-md text-[#fce8a6] flex items-center justify-center shadow-[0_4px_25px_rgba(0,0,0,0.7)] hover:border-[#fce8a6] hover:scale-105 active:scale-95 transition-all cursor-pointer ${
              playerState.isPlaying ? 'ring-2 ring-[#cca052]/40 shadow-[0_0_20px_rgba(197,160,89,0.35)]' : ''
            }`}
            title={playerState.isPlaying ? 'Pause Song' : 'Play Song: Bismillah'}
            aria-label={playerState.isPlaying ? 'Pause Song' : 'Play Song: Bismillah'}
          >
            {playerState.isPlaying ? (
              <Pause className="w-5 h-5 text-[#fce8a6]" />
            ) : (
              <Music className="w-5 h-5 text-[#cca052]" />
            )}
          </button>

          {/* Small volume toggle pill */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowVolume(!showVolume);
            }}
            className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-[#051510] border border-[#cca052]/50 text-[#cca052] flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity text-xs cursor-pointer shadow-md"
            title="Adjust volume"
            aria-label="Adjust volume"
          >
            {playerState.volume === 0 ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
