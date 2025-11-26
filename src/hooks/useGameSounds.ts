import { useState, useCallback } from 'react';

export function useGameSounds() {
  const [isMuted, setIsMuted] = useState(false);

  const playSound = useCallback((fileName: string, volume: number = 0.5) => {
    if (isMuted) return;
    // Asegúrate de que los archivos existan en la carpeta public/sounds/
    const audio = new Audio(`/sounds/${fileName}`);
    audio.volume = volume;
    audio.play().catch(e => console.warn("Audio play failed", e));
  }, [isMuted]);

  const playCollect = () => playSound('collect.mp3', 0.4);
  const playError = () => playSound('error.mp3', 0.6);
  const playGameOver = () => playSound('gameover.mp3', 0.7);

  const toggleMute = () => setIsMuted(!isMuted);

  return { isMuted, toggleMute, playCollect, playError, playGameOver };
}
