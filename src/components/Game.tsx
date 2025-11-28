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
          <div><p className="text-[10px] md:text-sm text-slate-300 font-bold">PUNTOS</p><p className="text-xl md:text-3xl font-bold font-mono text-white">{score}</p></div>
          <div><p className="text-[10px] md:text-sm text-slate-300 font-bold">NIVEL</p><p className="text-xl md:text-3xl font-bold font-mono text-yellow-400">{level}</p></div>
        </div>

        {/* Lado Derecho: Controles y Vidas */}
        <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
          
          {/* Vidas */}
          <div className="flex items-center bg-slate-800/80 p-2 rounded-xl border-2 border-slate-600 mr-2">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} className={`w-6 h-6 md:w-8 md:h-8 ${i < lives ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
            ))}
          </div>

          {/* BOTÓN SONIDO (Azul) */}
          <Button 
            variant="default" 
            size="icon" 
            onClick={toggleMute} 
            className="h-12 w-12 md:h-14 md:w-14 bg-blue-600 hover:bg-blue-500 text-white border-2 border-white shadow-lg rounded-xl"
            title="Sonido"
          >
            {isMuted ? <VolumeX className="h-6 w-6 md:h-8 md:w-8" /> : <Volume2 className="h-6 w-6 md:h-8 md:w-8" />}
          </Button>
          
          {/* BOTÓN PAUSA (Naranja) */}
          <Button 
            variant="default" 
            size="icon" 
            onClick={() => setIsPaused(!isPaused)} 
            className="h-12 w-12 md:h-14 md:w-14 bg-orange-500 hover:bg-orange-400 text-white border-2 border-white shadow-lg rounded-xl"
            title="Pausar"
          >
            {isPaused ? <Play className="h-6 w-6 md:h-8 md:w-8 fill-current" /> : <Pause className="h-6 w-6 md:h-8 md:w-8 fill-current" />}
          </Button>

          {/* BOTÓN SALIR (Rojo) */}
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={onExit} 
            className="h-12 w-12 md:h-14 md:w-14 bg-red-600 hover:bg-red-500 text-white border-2 border-white shadow-lg rounded-xl"
            title="Salir"
          >
            <LogOut className="h-6 w-6 md:h-8 md:w-8" />
          </Button>
        </div>
      </div>

      {/* Items cayendo */}
      {items.map(item => (
        <div key={item.id} className={`absolute px-4 py-2 rounded-full text-base md:text-xl font-bold shadow-xl transform -translate-x-1/2
          ${item.type === 'good' ? 'bg-green-500 border-2 border-white ring-2 ring-green-600' : 'bg-red-500 border-2 border-white ring-2 ring-red-600'} text-white whitespace-nowrap`}
          style={{ left: `${item.x}%`, top: item.y }}>
          {item.text}
        </div>
      ))}

      {/* Jugador */}
      <motion.div 
        className="absolute bottom-24 text-7xl md:text-8xl filter drop-shadow-2xl"
        style={{ left: `${playerX}%`, x: "-50%" }}
        animate={{ scale: [1, 1.1, 1], rotate: lives < 3 ? [0, -10, 10, 0] : 0 }}
        transition={{ duration: lives < 3 ? 0.2 : 1 }}
      >
        🐷
      </motion.div>
      
      {/* Pausa Overlay */}
      {isPaused && !showLevelModal && (
        <div 
          onClick={() => setIsPaused(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md z-[60] flex flex-col items-center justify-center cursor-pointer"
        >
          <Play className="w-24 h-24 text-white mb-6 opacity-90 drop-shadow-lg animate-pulse" />
          <h2 className="text-5xl text-white font-black tracking-widest mb-2 text-shadow">PAUSA</h2>
          <p className="text-white text-lg uppercase tracking-widest font-bold bg-slate-800 px-4 py-1 rounded-full border border-slate-600">Toca para continuar</p>
          
          <Button 
            onClick={(e) => { e.stopPropagation(); onExit(); }} 
            className="mt-12 bg-red-600 hover:bg-red-500 text-white px-8 py-6 text-xl rounded-2xl border-4 border-red-800 shadow-2xl"
          >
            <LogOut className="mr-3 h-6 w-6" /> Salir al Menú
          </Button>
        </div>
      )}

      {/* Modal Nivel */}
      <AnimatePresence>
        {showLevelModal && (
          <div className="absolute inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl"
            >
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-center text-white">
                <h2 className="text-4xl font-black mb-1 drop-shadow-md">¡NIVEL {level}!</h2>
                <p className="text-yellow-200 font-bold text-lg">¡Sigue así!</p>
              </div>

              <div className="p-8 bg-yellow-50">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="bg-yellow-200 p-4 rounded-full text-yellow-700 shadow-inner">
                    <Lightbulb size={40} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl mb-3">{currentTip.title}</h3>
                    <p className="text-gray-700 text-lg leading-relaxed font-medium">{currentTip.text}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50">
                <Button 
                  onClick={() => setShowLevelModal(false)}
                  className="w-full h-14 text-xl bg-green-600 hover:bg-green-500 text-white font-black shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all rounded-xl"
                >
                  <CheckCircle2 className="mr-2 h-8 w-8" /> ¡CONTINUAR!
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}