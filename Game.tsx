import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { TERMS_DB, GameTerm } from '../data/gameData';
import { useGameSounds } from '../hooks/useGameSounds';

interface GameProps {
  onGameOver: (score: number, level: number) => void;
}

export function Game({ onGameOver }: GameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [level, setLevel] = useState(1);
  const [items, setItems] = useState<GameTerm[]>([]);
  const [playerX, setPlayerX] = useState(50);

  const { playCollect, playError, playGameOver, isMuted, toggleMute } = useGameSounds();
  
  const gameLoopRef = useRef<number>();
  const lastSpawnTime = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPaused || !containerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const rect = containerRef.current.getBoundingClientRect();
    let xPercent = ((clientX - rect.left) / rect.width) * 100;
    xPercent = Math.max(5, Math.min(95, xPercent));
    setPlayerX(xPercent);
  };

  const gameLoop = useCallback((time: number) => {
    if (isPaused) return;

    const spawnRate = Math.max(500, 2000 - (level * 100));
    if (time - lastSpawnTime.current > spawnRate) {
      const isGood = Math.random() > 0.4;
      const type = isGood ? 'good' : 'bad';
      const list = isGood ? TERMS_DB.good : TERMS_DB.bad;
      const text = list[Math.floor(Math.random() * list.length)];

      setItems(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        text, type,
        x: Math.random() * 80 + 10,
        y: -50,
        speed: 2 + (level * 0.5)
      }]);
      lastSpawnTime.current = time;
    }

    setItems(prev => {
      const nextItems: GameTerm[] = [];
      let hitBad = false;
      let points = 0;

      prev.forEach(item => {
        const newY = item.y + item.speed;
        const playerY = window.innerHeight * 0.80;
        const collided = newY > playerY && newY < playerY + 60 && Math.abs(item.x - playerX) < 12;

        if (collided) {
          if (item.type === 'good') {
            points += 100;
            playCollect();
          } else {
            hitBad = true;
            playError();
          }
        } else if (newY <= window.innerHeight) {
          nextItems.push({ ...item, y: newY });
        }
      });

      if (points > 0) setScore(s => s + points);
      if (hitBad) setLives(l => l - 1);
      return nextItems;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [isPaused, level, playerX, playCollect, playError]);

  useEffect(() => {
    if (!isPaused) gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [isPaused, gameLoop]);

  useEffect(() => {
    const newLevel = Math.floor(score / 1000) + 1;
    if (newLevel > level) setLevel(newLevel);
  }, [score, level]);

  useEffect(() => {
    if (lives <= 0) {
      playGameOver();
      onGameOver(score, level);
    }
  }, [lives, score, level, onGameOver, playGameOver]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-slate-900 cursor-none touch-none select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <div className="absolute top-0 w-full p-4 flex justify-between items-start z-50 text-white">
        <div className="flex gap-6">
          <div><p className="text-xs text-slate-400">PUNTOS</p><p className="text-2xl font-bold font-mono">{score}</p></div>
          <div><p className="text-xs text-slate-400">NIVEL</p><p className="text-2xl font-bold font-mono">{level}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex mr-4">{[...Array(3)].map((_, i) => (
            <Heart key={i} className={`w-6 h-6 ${i < lives ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
          ))}</div>
          <Button variant="ghost" size="icon" onClick={toggleMute} className="text-slate-400 hover:text-white">
            {isMuted ? <VolumeX /> : <Volume2 />}
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsPaused(!isPaused)} className="bg-slate-800 text-white border-slate-700">
            {isPaused ? <Play /> : <Pause />}
          </Button>
        </div>
      </div>

      {items.map(item => (
        <div key={item.id} className={`absolute px-3 py-1 rounded-full text-sm font-bold shadow-lg transform -translate-x-1/2
          ${item.type === 'good' ? 'bg-green-500 border-green-400' : 'bg-red-500 border-red-400'} text-white border-2`}
          style={{ left: `${item.x}%`, top: item.y }}>
          {item.text}
        </div>
      ))}

      <motion.div 
        className="absolute bottom-10 text-6xl filter drop-shadow-lg"
        style={{ left: `${playerX}%`, x: "-50%" }}
        animate={{ scale: [1, 1.1, 1], rotate: lives < 3 ? [0, -10, 10, 0] : 0 }}
        transition={{ duration: lives < 3 ? 0.2 : 1 }}
      >
        🐷
      </motion.div>
      
      {isPaused && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center text-white text-4xl font-bold">PAUSA</div>}
    </div>
  );
}
