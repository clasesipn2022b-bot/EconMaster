// Tips financieros basados en el documento de Inclusión Financiera 
const LEVEL_UP_TIPS = [
  { 
    title: "📱 ¡Tu cel es tu banco!", 
    text: "El 87% de los jóvenes ya usan apps para sus finanzas. ¡Aprovecha la tecnología para controlar tus gastos!",
    source: "Fuente: ENIF 2024"
  },
  { 
    title: "🛡️ Dinero Seguro", 
    text: "Tus ahorros en instituciones formales están protegidos por ley. ¡Mucho más seguro que bajo el colchón!",
    source: "Fuente: Protección al Ahorro"
  },
  { 
    title: "👣 Tu Huella Cuenta", 
    text: "La Inteligencia Artificial puede ayudarte a tener crédito si tienes buen comportamiento digital. ¡Cuida tu historial!",
    source: "Fuente: Transformación FinTech"
  },
  { 
    title: "💳 Menos Efectivo", 
    text: "El 85% de compras pequeñas son en efectivo, pero los pagos digitales te ayudan a saber en qué se te va el dinero.",
    source: "Fuente: Hábitos de Pago"
  },
  { 
    title: "👁️ Ojo con el Fraude", 
    text: "La desconfianza frena tu crecimiento. Aprende sobre seguridad digital y protege tus datos personales.",
    source: "Fuente: Seguridad Financiera"
  }
];
export default LEVEL_UP_TIPS;
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Asegúrate de importar AnimatePresence
import { Heart, Pause, Play, Volume2, VolumeX, LogOut, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { TERMS_DB, GameTerm } from '../data/gameData';
import { useGameSounds } from '../hooks/useGameSounds';

// --- NUEVO: TIPS FINANCIEROS ---
const LEVEL_UP_TIPS = [
  { 
    title: "📱 ¡Tu cel es tu banco!", 
    text: "El 87% de los jóvenes ya usan apps para sus finanzas. ¡Aprovecha la tecnología para controlar tus gastos!",
  },
  { 
    title: "🛡️ Dinero Seguro", 
    text: "¿Sabías que solo 3 de cada 10 saben que sus ahorros están protegidos?[cite: 42]. ¡En el banco tu dinero no se pierde!",
  },
  { 
    title: "👣 Tu Huella Cuenta", 
    text: "Hoy en día, la IA analiza tus datos digitales para darte crédito[cite: 164]. ¡Paga tus servicios a tiempo!",
  },
  { 
    title: "💳 Controla tus Gastos", 
    text: "El 85% de compras pequeñas son en efectivo, lo que hace difícil rastrearlas. ¡Usa pagos digitales!",
  },
  { 
    title: "🧠 Educación es Poder", 
    text: "La educación financiera no es solo saber sumar, es entender cómo el dinero afecta tu bienestar[cite: 216].",
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
  
  // --- NUEVO: ESTADOS PARA EL MODAL DE NIVEL ---
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [currentTip, setCurrentTip] = useState(LEVEL_UP_TIPS[0]);

  const { playCollect, playError, playGameOver, isMuted, toggleMute } = useGameSounds();
  
  const gameLoopRef = useRef<number>();
  const lastSpawnTime = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPaused || showLevelModal || !containerRef.current) return; // Bloquear si hay modal
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const rect = containerRef.current.getBoundingClientRect();
    let xPercent = ((clientX - rect.left) / rect.width) * 100;
    xPercent = Math.max(5, Math.min(95, xPercent));
    setPlayerX(xPercent);
  };

  const gameLoop = useCallback((time: number) => {
    if (isPaused || showLevelModal) return; // Detener loop si hay modal

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
  }, [isPaused, showLevelModal, level, playerX, playCollect, playError]); // Agregamos showLevelModal a dependencias

  useEffect(() => {
    if (!isPaused && !showLevelModal) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [isPaused, showLevelModal, gameLoop]);

  // --- NUEVO: LÓGICA DE SUBIDA DE NIVEL ---
  useEffect(() => {
    const newLevel = Math.floor(score / 1000) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      // Pausar y mostrar tip
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
      <div className="absolute top-0 w-full p-4 flex justify-between items-start z-50 text-white">
        <div className="flex gap-4 md:gap-6">
          <div><p className="text-[10px] md:text-xs text-slate-400">PUNTOS</p><p className="text-xl md:text-2xl font-bold font-mono">{score}</p></div>
          <div><p className="text-[10px] md:text-xs text-slate-400">NIVEL</p><p className="text-xl md:text-2xl font-bold font-mono">{level}</p></div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden md:flex mr-2">{[...Array(3)].map((_, i) => (
            <Heart key={i} className={`w-6 h-6 ${i < lives ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
          ))}</div>
          <div className="md:hidden flex items-center mr-2 text-red-500 font-bold">
            <Heart className="w-5 h-5 fill-current mr-1" /> {lives}
          </div>

          <Button variant="ghost" size="icon" onClick={toggleMute} className="text-slate-400 hover:text-white h-8 w-8 md:h-10 md:w-10">
            {isMuted ? <VolumeX className="h-4 w-4 md:h-5 md:w-5" /> : <Volume2 className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>
          
          <Button variant="outline" size="icon" onClick={() => setIsPaused(!isPaused)} className="bg-slate-800 text-white border-slate-700 h-8 w-8 md:h-10 md:w-10">
            {isPaused ? <Play className="h-4 w-4 md:h-5 md:w-5" /> : <Pause className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>

          <Button 
            variant="destructive" 
            size="icon" 
            onClick={onExit} 
            className="bg-red-600 hover:bg-red-700 text-white border-red-800 h-8 w-8 md:h-10 md:w-10 ml-1"
          >
            <LogOut className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      {items.map(item => (
        <div key={item.id} className={`absolute px-3 py-1 rounded-full text-sm font-bold shadow-lg transform -translate-x-1/2
          ${item.type === 'good' ? 'bg-green-500 border-green-400' : 'bg-red-500 border-red-400'} text-white border-2 whitespace-nowrap`}
          style={{ left: `${item.x}%`, top: item.y }}>
          {item.text}
        </div>
      ))}

      <motion.div 
        className="absolute bottom-24 text-6xl filter drop-shadow-lg"
        style={{ left: `${playerX}%`, x: "-50%" }}
        animate={{ scale: [1, 1.1, 1], rotate: lives < 3 ? [0, -10, 10, 0] : 0 }}
        transition={{ duration: lives < 3 ? 0.2 : 1 }}
      >
        🐷
      </motion.div>
      
      {/* Pantalla de Pausa */}
      {isPaused && !showLevelModal && (
        <div 
          onClick={() => setIsPaused(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[60] flex flex-col items-center justify-center cursor-pointer hover:bg-black/90 transition-colors"
        >
          <Play className="w-20 h-20 text-white mb-4 opacity-80" />
          <h2 className="text-4xl text-white font-bold tracking-widest">PAUSA</h2>
          <p className="text-slate-300 mt-2 text-sm uppercase tracking-wide">Toca para continuar</p>
          <Button onClick={(e) => { e.stopPropagation(); onExit(); }} className="mt-8 bg-red-600 hover:bg-red-700 text-white">
            <LogOut className="mr-2 h-4 w-4" /> Salir al Menú
          </Button>
        </div>
      )}

      {/* --- NUEVO: MODAL DE NIVEL COMPLETADO (Estilo Mexicano) --- */}
      <AnimatePresence>
        {showLevelModal && (
          <div className="absolute inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-2xl"
            >
              {/* Encabezado Festivo */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
                <h2 className="text-3xl font-extrabold mb-1">¡NIVEL {level}!</h2>
                <p className="text-yellow-200 font-medium">¡Sigue así, vas muy bien!</p>
              </div>

              {/* Contenido del Tip */}
              <div className="p-6 bg-yellow-50">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-200 p-3 rounded-full text-yellow-700 shrink-0">
                    <Lightbulb size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{currentTip.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{currentTip.text}</p>
                  </div>
                </div>
              </div>

              {/* Botón Continuar */}
              <div className="p-4 bg-gray-50 flex justify-center">
                <Button 
                  onClick={() => setShowLevelModal(false)}
                  className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
                >
                  <CheckCircle2 className="mr-2 h-6 w-6" /> ¡Entendido, a seguir!
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}