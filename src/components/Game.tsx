import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Pause, Play, Volume2, VolumeX, LogOut, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { TERMS_DB, GameTerm } from '../data/gameData';
import { useGameSounds } from '../hooks/useGameSounds';

// --- TIPS FINANCIEROS ---
const LEVEL_UP_TIPS = [
  { 
    title: "📱 ¡Tu cel es tu banco!", 
    text: "El 87% de los jóvenes ya usan apps para sus finanzas. ¡Aprovecha la tecnología para controlar tus gastos!",
  },
  { 
    title: "🛡️ Dinero Seguro", 
    text: "¿Sabías que solo 3 de cada 10 saben que sus ahorros están protegidos? ¡En el banco tu dinero no se pierde!",
  },
  { 
    title: "👣 Tu Huella Cuenta", 
    text: "Hoy en día, la IA analiza tus datos digitales para darte crédito. ¡Paga tus servicios a tiempo!",
  },
  { 
    title: "💳 Controla tus Gastos", 
    text: "El 85% de compras pequeñas son en efectivo, lo que hace difícil rastrearlas. ¡Usa pagos digitales!",
  },
  { 
    title: "🧠 Salud Financiera", 
    text: "Las finanzas no son solo números, también afectan tu bienestar y salud mental. ¡Cuida tu paz mental!",
  }
];

interface GameProps {
  onGameOver: (score: number, level: number) => void;
  onExit: () => void;
}

export function Game({ onGameOver, onExit }: GameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [level, setLevel] = useState(1);
  const [items, setItems] = useState<GameTerm[]>([]);
  const [playerX, setPlayerX] = useState(50);
  
  // Estados para el Modal de Nivel
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [currentTip, setCurrentTip] = useState(LEVEL_UP_TIPS[0]);

  const { playCollect, playError, playGameOver, isMuted, toggleMute } = useGameSounds();
  
  const gameLoopRef = useRef<number>();
  const lastSpawnTime = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPaused || showLevelModal || !containerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const rect = containerRef.current.getBoundingClientRect();
    let xPercent = ((clientX - rect.left) / rect.width) * 100;
    xPercent = Math.max(5, Math.min(95, xPercent));
    setPlayerX(xPercent);
  };

  const gameLoop = useCallback((time: number) => {
    if (isPaused || showLevelModal) return;

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
  }, [isPaused, showLevelModal, level, playerX, playCollect, playError]);

  useEffect(() => {
    if (!isPaused && !showLevelModal) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [isPaused, showLevelModal, gameLoop]);

  useEffect(() => {
    const newLevel = Math.floor(score / 1000) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      const randomTip = LEVEL_UP_TIPS[Math.floor(Math.random() * LEVEL_UP_TIPS.length)];
      setCurrentTip(randomTip);
      setShowLevelModal(true);
    }
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
      {/* HUD Superior */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-start z-50 pointer-events-none">
        {/* Lado Izquierdo: Puntos */}
        <div className="flex gap-4 md:gap-8 pointer-events-auto bg-slate-800/80 p-3 rounded-xl border-2 border-slate-600 backdrop-blur-sm">
          <div><p className="text-[10px] md:text-sm text-slate-3