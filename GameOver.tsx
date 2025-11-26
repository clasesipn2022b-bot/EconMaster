import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { RotateCcw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface GameOverProps {
  finalScore: number;
  level: number;
  onRestart: () => void;
  onHome: () => void;
}

export function GameOver({ finalScore, level, onRestart, onHome }: GameOverProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, finalScore, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [finalScore]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[500px]">
        <Card className="p-8 text-center bg-white/95 shadow-xl backdrop-blur-sm">
          <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-6 text-7xl select-none">
            😢
          </motion.div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">¡Juego Terminado!</h2>
          <p className="text-gray-500 mb-6">Pero aprendiste mucho sobre economía.</p>

          <div className="p-6 rounded-xl mb-6 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-100">
            <div className="grid grid-cols-2 gap-4 divide-x divide-gray-300">
              <div><div className="text-gray-500 text-xs uppercase">Nivel</div><div className="text-3xl font-bold text-gray-800">{level}</div></div>
              <div><div className="text-gray-500 text-xs uppercase">Puntos</div><motion.div className="text-3xl font-bold text-red-500">{rounded}</motion.div></div>
            </div>
          </div>

          <div className="grid gap-3">
            <Button onClick={onRestart} className="w-full h-12 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
              <RotateCcw className="mr-2 h-5 w-5" /> Jugar de Nuevo
            </Button>
            <Button onClick={onHome} variant="outline" className="w-full h-12 text-lg border-2">
              <Home className="mr-2 h-5 w-5" /> Menú Principal
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
