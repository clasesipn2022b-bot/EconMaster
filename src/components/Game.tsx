import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Pause, Play, Volume2, VolumeX, LogOut, Lightbulb, CheckCircle2, GraduationCap, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { TERMS_DB, GameTerm } from '../data/gameData';
import { useGameSounds } from '../hooks/useGameSounds';

// --- 50 TIPS FINANCIEROS ---
const LEVEL_UP_TIPS = [
  { title: "📅 2025: Año Clave", text: "Este año es fundamental para aprovechar la tecnología y lograr una verdadera democratización financiera en México." },
  { title: "📈 ¡Vamos subiendo!", text: "El 76.8% de los adultos en México ya tiene al menos un producto financiero formal. ¡Súmate a la formalidad!" },
  { title: "👷 Nómina es la Clave", text: "Casi la mitad de las cuentas de ahorro (46.5%) inician como cuentas de nómina. ¡Es tu puerta de entrada!" },
  { title: "🔒 Ahorro Seguro", text: "El 63% de los mexicanos ya tiene cuenta de ahorro formal. En el banco, tu dinero está protegido." },
  { title: "💳 Crédito Formal", text: "Solo el 37.3% tiene crédito formal. Construir historial es vital para acceder a mejores oportunidades." },
  { title: "🛍️ Tarjetas Departamentales", text: "Son el crédito más común (22.6%), pero cuidado con los intereses. ¡Úsalas con responsabilidad!" },
  { title: "📱 ¡Celular = Banco!", text: "El 83% de los mexicanos tiene smartphone. Tu teléfono es la herramienta #1 para tus finanzas." },
  { title: "📲 Apps Financieras", text: "6 de cada 10 usuarios ya usan apps móviles para manejar su dinero. ¡Es más rápido y seguro!" },
  { title: "🚀 Jóvenes Digitales", text: "El 87% de los jóvenes (18-29 años) gestionan su dinero desde el celular. ¡El futuro es hoy!" },
  { title: "👴 Brecha Generacional", text: "Los adultos mayores también se digitalizan: su uso de apps subió al 60%. ¡Ayuda a tus abuelos!" },
  { title: "📉 Acceso vs Uso", text: "Tener una tarjeta no basta; el 33% de quienes tienen débito no la usan. ¡Activa tus medios de pago!" },
  { title: "💵 El Rey Efectivo", text: "El 85% de las compras menores a $500 pesos siguen siendo en efectivo. ¡Digitalízate para llevar control!" },
  { title: "💰 Compras Grandes", text: "Incluso en compras mayores a $500, el 73% usa efectivo. Esto es inseguro y difícil de rastrear." },
  { title: "🏘️ Brecha Rural", text: "En zonas rurales, solo el 26% paga digitalmente vs 58% en ciudades. ¡La tecnología debe llegar a todos!" },
  { title: "🛡️ Tu Dinero Protegido", text: "Solo 3 de cada 10 saben que sus ahorros formales tienen seguro de protección. ¡Infórmate y confía!" },
  { title: "🚫 Cuidado con el Fraude", text: "El 10% ha sufrido robo de identidad o clonación. ¡No compartas tus NIPs y contraseñas!" },
  { title: "⚖️ Brecha de Género", text: "Los hombres (80.9%) tienen más productos financieros que las mujeres (72.8%). ¡Necesitamos equidad!" },
  { title: "👩 Mujeres y Crédito", text: "A veces las mujeres pagan tasas de interés más altas (+3.8 pts). ¡Compara siempre antes de firmar!" },
  { title: "📍 Sin Fronteras", text: "La digitalización permite servicios financieros sin importar dónde vivas, superando barreras físicas." },
  { title: "⚡ Pagos Rápidos", text: "Las transferencias electrónicas crecieron 18%. Son más seguras y rápidas que ir al cajero." },
  { title: "🛒 Más Terminales", text: "Ya hay 4.9 millones de terminales punto de venta en México. ¡Exige pagar con tarjeta!" },
  { title: "🧠 Educación es Poder", text: "La inclusión no es solo tener cuenta, es saber usarla para tu bienestar. ¡Edúcate!" },
  { title: "🔄 Cambio de Hábito", text: "El uso de efectivo es un hábito (46%), no siempre una necesidad. ¡Intenta pagar digital una semana!" },
  { title: "🤝 Confianza", text: "La desconfianza frena tu crecimiento. Las instituciones reguladas son seguras." },
  { title: "💡 FinTechs en Auge", text: "Desde 2023, hay 131 nuevas FinTechs en México. ¡Hay muchas opciones innovadoras para ti!" },
  { title: "🤖 IA y Crédito", text: "La Inteligencia Artificial usa 'datos alternativos' para darte crédito aunque no tengas historial." },
  { title: "📱 Tu Huella Digital", text: "Cómo usas tu celular y redes puede ayudar a la IA a evaluarte para un préstamo. ¡Cuida tu imagen!" },
  { title: "🤖 Asesores Robots", text: "La IA permite tener asesores de inversión personalizados que antes eran solo para millonarios." },
  { title: "⚠️ Riesgo de la IA", text: "Los algoritmos pueden tener sesgos. ¡Exige transparencia en cómo evalúan tu crédito!" },
  { title: "📜 Regulación IA", text: "México necesita leyes claras para la IA financiera que protejan tus datos y eviten discriminación." },
  { title: "🎓 Redes Educativas", text: "Las redes sociales son la nueva aula. Busca contenido financiero verificado y de calidad." },
  { title: "🎮 Gamificación", text: "Aprender jugando, como en este juego, hace las finanzas menos intimidantes y más divertidas." },
  { title: "🧘 Salud Mental", text: "Tus finanzas afectan tu paz mental. Gestionar bien tu dinero reduce el estrés y la ansiedad." },
  { title: "📰 Cuidado: Fake News", text: "En redes hay mucha desinformación. ¡Verifica siempre la fuente antes de invertir!" },
  { title: "🗣️ Habla Claro", text: "Evita los términos complicados o 'anglicismos'. Las finanzas deben entenderse en tu idioma." },
  { title: "🔍 Pensamiento Crítico", text: "Desarrolla un escepticismo saludable hacia los 'consejos millonarios' rápidos de internet." },
  { title: "🇲🇽 Contexto Mexicano", text: "La educación financiera debe adaptarse a nuestra realidad: informalidad, remesas y cultura." },
  { title: "🛤️ Progreso, no Perfección", text: "No busques ser perfecto con el dinero, busca progresar poco a poco cada día." },
  { title: "🔗 Conectividad", text: "El 30% aún no tiene internet. La inclusión digital es necesaria para la inclusión financiera." },
  { title: "🏙️ Desigualdad", text: "La falta de infraestructura en zonas rurales limita las oportunidades. ¡Hay que cerrar la brecha!" },
  { title: "✅ Validación de Fuentes", text: "Siempre revisa quién emite la información financiera. ¡Busca credenciales académicas!" },
  { title: "📊 Datos Alternativos", text: "El pago puntual de luz o teléfono ahora puede contar para que te den un crédito." },
  { title: "🌐 Ciberseguridad", text: "La seguridad digital empieza por ti. Aprende a detectar correos y sitios falsos." },
  { title: "💳 Historial Crediticio", text: "Tu comportamiento de pago es tu carta de presentación. ¡Cuidalo como oro!" },
  { title: "🤲 Inclusión Real", text: "La meta es que los servicios financieros mejoren tu vida, no solo que tengas una cuenta." },
  { title: "🚀 FinTechs Mexicanas", text: "El 40% de las FinTechs en México ya desarrollan su propia Inteligencia Artificial." },
  { title: "👁️ Privacidad", text: "Tus datos personales son valiosos. Revisa quién tiene acceso a ellos en tus apps." },
  { title: "🧩 Holístico", text: "El bienestar financiero incluye planear para imprevistos y consumo consciente." },
  { title: "📢 Alfabetización", text: "Aprender a usar medios digitales es tan importante como saber sumar para tus finanzas." },
  { title: "🏆 ¡Eres un Experto!", text: "Al jugar esto, ya estás dando el primer paso para tomar decisiones informadas." }
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
  
  // Modales
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showChampionModal, setShowChampionModal] = useState(false);
  const [currentTip, setCurrentTip] = useState(LEVEL_UP_TIPS[0]);

  const { playCollect, playError, playGameOver, isMuted, toggleMute } = useGameSounds();
  
  const gameLoopRef = useRef<number>();
  const lastSpawnTime = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTermText = useRef<string>(""); 

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPaused || showLevelModal || showExitModal || showChampionModal || !containerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const rect = containerRef.current.getBoundingClientRect();
    let xPercent = ((clientX - rect.left) / rect.width) * 100;
    xPercent = Math.max(5, Math.min(95, xPercent));
    setPlayerX(xPercent);
  };

  const gameLoop = useCallback((time: number) => {
    if (isPaused || showLevelModal || showExitModal || showChampionModal) return;

    const spawnRate = Math.max(500, 2000 - (level * 100));
    if (time - lastSpawnTime.current > spawnRate) {
      const isGood = Math.random() > 0.4;
      const type = isGood ? 'good' : 'bad';
      const list = isGood ? TERMS_DB.good : TERMS_DB.bad;
      
      let text = list[Math.floor(Math.random() * list.length)];
      let attempts = 0;
      while (text === lastTermText.current && attempts < 5) {
        text = list[Math.floor(Math.random() * list.length)];
        attempts++;
      }
      lastTermText.current = text;

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
  }, [isPaused, showLevelModal, showExitModal, showChampionModal, level, playerX, playCollect, playError]);

  useEffect(() => {
    if (!isPaused && !showLevelModal && !showExitModal && !showChampionModal) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [isPaused, showLevelModal, showExitModal, showChampionModal, gameLoop]);

  useEffect(() => {
    const newLevel = Math.floor(score / 1000) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      const tipIndex = newLevel - 2;
      if (tipIndex >= LEVEL_UP_TIPS.length) {
        setShowChampionModal(true);
      } else {
        const safeIndex = tipIndex < 0 ? 0 : tipIndex;
        setCurrentTip(LEVEL_UP_TIPS[safeIndex]);
        setShowLevelModal(true);
      }
    }
  }, [score, level]);

  useEffect(() => {
    if (lives <= 0) {
      playGameOver();
      onGameOver(score, level);
    }
  }, [lives, score, level, onGameOver, playGameOver]);

  const handleExitRequest = () => {
    setIsPaused(true);
    setShowExitModal(true);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-slate-900 cursor-none touch-none select-none font-sans"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      {/* HUD Superior */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-start z-50 pointer-events-none">
        <div className="flex gap-4 md:gap-8 pointer-events-auto bg-slate-800/90 p-3 rounded-xl border-2 border-slate-600 backdrop-blur-md shadow-2xl">
          <div><p className="text-[10px] md:text-xs text-slate-300 font-bold tracking-widest uppercase">Puntos</p><p className="text-xl md:text-3xl font-black font-mono text-white drop-shadow-lg">{score}</p></div>
          <div><p className="text-[10px] md:text-xs text-slate-300 font-bold tracking-widest uppercase">Nivel</p><p className="text-xl md:text-3xl font-black font-mono text-yellow-400 drop-shadow-lg">{level}</p></div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          <div className="flex items-center bg-slate-800/80 p-2 rounded-xl border-2 border-slate-600 mr-2 shadow-lg">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} className={`w-6 h-6 md:w-8 md:h-8 drop-shadow-sm ${i < lives ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
            ))}
          </div>
          <Button variant="default" size="icon" onClick={toggleMute} className="h-12 w-12 md:h-14 md:w-14 bg-blue-600 hover:bg-blue-500 text-white border-2 border-white shadow-xl rounded-xl transition-all active:scale-95">{isMuted ? <VolumeX className="h-6 w-6 md:h-8 md:w-8" /> : <Volume2 className="h-6 w-6 md:h-8 md:w-8" />}</Button>
          <Button variant="default" size="icon" onClick={() => setIsPaused(!isPaused)} className="h-12 w-12 md:h-14 md:w-14 bg-orange-500 hover:bg-orange-400 text-white border-2 border-white shadow-xl rounded-xl transition-all active:scale-95">{isPaused ? <Play className="h-6 w-6 md:h-8 md:w-8 fill-current" /> : <Pause className="h-6 w-6 md:h-8 md:w-8 fill-current" />}</Button>
          <Button variant="destructive" size="icon" onClick={handleExitRequest} className="h-12 w-12 md:h-14 md:w-14 bg-red-600 hover:bg-red-500 text-white border-2 border-white shadow-xl rounded-xl transition-all active:scale-95"><LogOut className="h-6 w-6 md:h-8 md:w-8" /></Button>
        </div>
      </div>

      {/* ITEMS: CORRECCIÓN DE TAMAÑO MÓVIL */}
      {items.map(item => (
        <div key={item.id} 
          className={`absolute px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-full text-[10px] sm:text-xs md:text-xl font-bold shadow-lg transform -translate-x-1/2 flex items-center justify-center text-center
          ${item.type === 'good' ? 'bg-green-500 border-2 border-white ring-1 md:ring-2 ring-green-600' : 'bg-red-500 border-2 border-white ring-1 md:ring-2 ring-red-600'} 
          text-white z-10 whitespace-normal leading-tight max-w-[100px] md:max-w-none break-words`} 
          style={{ left: `${item.x}%`, top: item.y }}>
          {item.text}
        </div>
      ))}

      <motion.div className="absolute bottom-24 text-7xl md:text-8xl filter drop-shadow-2xl z-20" style={{ left: `${playerX}%`, x: "-50%" }} animate={{ scale: [1, 1.1, 1], rotate: lives < 3 ? [0, -10, 10, 0] : 0 }} transition={{ duration: lives < 3 ? 0.2 : 1 }}>🐷</motion.div>
      
      {/* 1. PAUSA */}
      {isPaused && !showLevelModal && !showExitModal && !showChampionModal && (
        <div onClick={() => setIsPaused(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md z-[60] flex flex-col items-center justify-center cursor-pointer">
          <Play className="w-24 h-24 text-white mb-6 opacity-90 drop-shadow-lg animate-pulse" />
          <h2 className="text-5xl text-white font-black tracking-widest mb-4 text-shadow">PAUSA</h2>
          <p className="text-white text-lg uppercase tracking-widest font-bold bg-slate-800 px-6 py-2 rounded-full border border-slate-500 mb-12">Toca para continuar</p>
          <Button onClick={(e) => { e.stopPropagation(); handleExitRequest(); }} className="bg-red-600 hover:bg-red-500 text-white px-8 py-6 text-xl rounded-2xl border-4 border-red-800 shadow-2xl transition-transform hover:scale-105"><LogOut className="mr-3 h-6 w-6" /> Terminar Partida</Button>
        </div>
      )}

      {/* 2. NIVEL COMPLETADO */}
      <AnimatePresence>
        {showLevelModal && (
          <div className="absolute inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-white w-full max-w-md rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-center text-white">
                <h2 className="text-4xl font-black mb-1 drop-shadow-md">¡NIVEL {level}!</h2>
                <p className="text-yellow-200 font-bold text-lg">Tip {level - 1} de 50 💡</p>
              </div>
              <div className="p-8 bg-yellow-50">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="bg-yellow-200 p-4 rounded-full text-yellow-700 shadow-inner animate-bounce"><Lightbulb size={40} /></div>
                  <div><h3 className="font-bold text-gray-900 text-xl mb-3">{currentTip.title}</h3><p className="text-gray-700 text-lg leading-relaxed font-medium">{currentTip.text}</p></div>
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <Button onClick={() => setShowLevelModal(false)} className="w-full h-14 text-xl bg-green-600 hover:bg-green-500 text-white font-black shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all rounded-xl"><CheckCircle2 className="mr-2 h-8 w-8" /> ¡CONTINUAR!</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CAMPEÓN */}
      <AnimatePresence>
        {showChampionModal && (
          <div className="absolute inset-0 z-[90] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <div key={i} className="absolute w-3 h-3 rounded-full animate-pulse" 
                     style={{ 
                       top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, 
                       backgroundColor: ['#ff0', '#f0f', '#0ff', '#0f0'][Math.floor(Math.random() * 4)],
                       animationDuration: `${Math.random() * 2 + 0.5}s`
                     }} />
              ))}
            </div>
            <motion.div initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} className="bg-white w-full max-w-md rounded-3xl overflow-hidden border-4 border-yellow-500 shadow-[0_0_50px_rgba(255,215,0,0.5)]">
              <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 text-center text-white relative">
                <Trophy className="w-24 h-24 mx-auto mb-4 text-yellow-100 drop-shadow-xl animate-bounce" />
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">¡FELICIDADES!</h2>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm inline-block"><span className="text-4xl">🎉🥳🎊</span></div>
              </div>
              <div className="p-8 text-center bg-yellow-50">
                <p className="text-gray-900 font-bold text-xl mb-4">Eres el...</p>
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 uppercase border-2 border-orange-200 p-4 rounded-xl bg-white shadow-inner transform rotate-1">Campeón Definitivo de las Finanzas Personales</h3>
                <p className="text-gray-600 mt-6 font-medium">Has dominado los 50 conceptos clave.</p>
              </div>
              <div className="p-6 bg-white flex justify-center border-t-2 border-gray-100">
                <Button onClick={onExit} className="w-full h-14 text-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-lg rounded-xl"><GraduationCap className="mr-2 h-6 w-6" /> Recoger Diploma (Salir)</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. SALIDA */}
      <AnimatePresence>
        {showExitModal && (
          <div className="absolute inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-md rounded-3xl overflow-hidden border-4 border-blue-500 shadow-2xl">
              <div className="bg-blue-600 p-6 text-center text-white">
                <GraduationCap className="w-16 h-16 mx-auto mb-2 text-blue-200" /><h2 className="text-3xl font-black">¡Gracias por Jugar!</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-xl text-center border-2 border-blue-100"><p className="text-gray-500 text-xs font-bold uppercase">Nivel</p><p className="text-3xl font-black text-blue-700">{level}</p></div>
                  <div className="bg-purple-50 p-4 rounded-xl text-center border-2 border-purple-100"><p className="text-gray-500 text-xs font-bold uppercase">Puntaje</p><p className="text-3xl font-black text-purple-700">{score}</p></div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => { setShowExitModal(false); setIsPaused(false); }} variant="outline" className="flex-1 h-12 text-gray-600 font-bold border-2 rounded-xl">Seguir</Button>
                  <Button onClick={onExit} className="flex-1 h-12 bg-red-600 hover:bg-red-500 text-white font-bold shadow-md border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all rounded-xl"><LogOut className="mr-2 h-5 w-5" /> Salir</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}