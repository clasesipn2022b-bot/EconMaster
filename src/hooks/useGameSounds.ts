import { useState, useCallback } from 'react';

export function useGameSounds() {
  const [isMuted, setIsMuted] = useState(false);

  // Función para generar un tono simple (Beep)
  const playTone = useCallback((freq: number, type: OscillatorType, duration: number) => {
    if (isMuted) return;
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // CAMBIO: Aumentado de 0.1 a 0.5 para más volumen
    gain.gain.setValueAtTime(0.5, ctx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [isMuted]);

  const playCollect = useCallback(() => {
    playTone(800, 'sine', 0.1);
    setTimeout(() => playTone(1200, 'sine', 0.2), 50);
  }, [playTone]);

  const playError = useCallback(() => {
    playTone(150, 'sawtooth', 0.3);
  }, [playTone]);

  const playGameOver = useCallback(() => {
    playTone(300, 'triangle', 0.2);
    setTimeout(() => playTone(250, 'triangle', 0.2), 200);
    setTimeout(() => playTone(200, 'triangle', 0.4), 400);
  }, [playTone]);

  const toggleMute = () => setIsMuted(!isMuted);

  return { isMuted, toggleMute, playCollect, playError, playGameOver };
}