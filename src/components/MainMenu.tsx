import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface MainMenuProps {
  onStart: () => void;
}

export function MainMenu({ onStart }: MainMenuProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 overflow-hidden relative">
      {/* Decoración de fondo */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[450px] z-10"
      >
        <Card className="p-8 bg-white/90 shadow-2xl backdrop-blur-md border-t-4 border-purple-500">
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="inline-flex items-center justify-center p-3 mb-4 bg-purple-100 rounded-full"
            >
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </motion.div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Econ<span className="text-purple-600">Master</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">Aprende finanzas jugando</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onStart}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg text-white"
            >
              <Play className="mr-2 w-5 h-5 fill-current" /> Iniciar Partida
            </Button>

            <Button
              onClick={() => setShowInstructions(!showInstructions)}
              variant="outline"
              className="w-full h-12 border-2 hover:bg-gray-50 text-gray-700"
            >
              <BookOpen className="mr-2 w-5 h-5" /> {showInstructions ? 'Ocultar Reglas' : 'Cómo Jugar'}
            </Button>
          </div>

          <motion.div
            initial={false}
            animate={{ height: showInstructions ? 'auto' : 0, opacity: showInstructions ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100 text-left">
              <h4 className="font-bold mb-2">Reglas:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Mueve el cerdito 🐷 con el mouse o dedo.</li>
                <li>Atrapa conceptos <span className="text-green-600 font-bold">BUENOS</span> (+100 pts).</li>
                <li>Esquiva los conceptos <span className="text-red-600 font-bold">MALOS</span> (-1 vida).</li>
              </ul>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}