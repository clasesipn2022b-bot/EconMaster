import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, PartyPopper, Globe, Fingerprint, GraduationCap, X, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface MainMenuProps {
  onStart: () => void;
}

export function MainMenu({ onStart }: MainMenuProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Abrir el modal de información académica automáticamente al iniciar
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInfoModal(true);
    }, 500); // Pequeño retraso para una entrada suave
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* --- FONDO ESTILO MEXICANO --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700">
        {/* Patrón decorativo de fondo (simulando papel picado sutil) */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'radial-gradient(#fbbf24 2px, transparent 2px)', 
               backgroundSize: '30px 30px' 
             }} 
        />
      </div>

      {/* Decoraciones flotantes */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-400 rounded-full mix-blend-overlay blur-xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-400 rounded-full mix-blend-overlay blur-xl animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[500px] z-10"
      >
        <Card className="relative p-0 bg-white shadow-2xl overflow-hidden border-4 border-yellow-400 rounded-xl">
          {/* Borde superior decorativo */}
          <div className="h-4 w-full bg-gradient-to-r from-green-500 via-white to-red-500" />
          
          <div className="p-8">
            {/* --- ENCABEZADO CON AVATAR --- */}
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mx-auto w-40 h-40 mb-4 relative"
              >
                <div className="absolute inset-0 bg-yellow-300 rounded-full animate-spin-slow opacity-50 blur-md"></div>
                <img 
                  src="/avatar.png" 
                  alt="Avatar Profesor" 
                  className="w-full h-full object-cover rounded-full border-4 border-pink-500 shadow-xl relative z-10 bg-white"
                  style={{ imageRendering: 'pixelated' }} // CLAVE: Para que el pixel art se vea nítido
                />
                {/* Botón flotante para abrir info manualmente si se cierra */}
                <button 
                  onClick={() => setShowInfoModal(true)}
                  className="absolute -right-2 -bottom-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 z-20"
                  title="Ver credenciales académicas"
                >
                  <Info size={20} />
                </button>
              </motion.div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">
                Divulgando las <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Finanzas Games
                </span>
              </h1>
            </div>

            {/* --- BOTONES PRINCIPALES --- */}
            <div className="space-y-4">
              {/* Botón Jugar (Estilo Principal) */}
              <Button
                onClick={onStart}
                className="w-full h-14 text-xl font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-lg border-b-4 border-pink-800 active:border-b-0 active:translate-y-1 transition-all rounded-xl"
              >
                <Play className="mr-2 w-6 h-6 fill-current" /> Jugar EconMaster
              </Button>

              {/* Botón Piñatas (Estilo Secundario Festivo) */}
              <a href="https://TU_URL_DE_PIÑATAS.com" target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button
                  className="w-full h-12 text-lg font-bold bg-cyan-500 hover:bg-cyan-600 text-white shadow-md border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1 transition-all rounded-xl"
                >
                  <PartyPopper className="mr-2 w-6 h-6" /> Jugar "Piñatas de la Economía"
                </Button>
              </a>

              {/* Botón Cómo Jugar (Simple) */}
              <Button
                onClick={() => setShowInstructions(!showInstructions)}
                variant="ghost"
                className="w-full text-gray-500 hover:text-pink-600 font-medium"
              >
                {showInstructions ? 'Ocultar Reglas' : '¿Cómo se juega?'}
              </Button>
            </div>

            {/* Instrucciones */}
            <AnimatePresence>
              {showInstructions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-900 border-2 border-yellow-200 text-left">
                    <ul className="list-disc list-inside space-y-1 font-medium">
                      <li>🐷 Mueve el cerdito.</li>
                      <li>✅ Atrapa lo <strong>BUENO</strong> (Dinero).</li>
                      <li>❌ Esquiva lo <strong>MALO</strong> (Deudas).</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>

      {/* --- MODAL POP-UP ACADÉMICO (Estilo Mexicano) --- */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
            >
              {/* Decoración superior modal */}
              <div className="bg-pink-600 p-4 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20" 
                     style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 20px)' }} 
                />
                <h2 className="text-xl font-bold relative z-10">Validación Académica</h2>
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors z-20"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 text-center">
                <p className="text-gray-700 font-medium text-lg mb-6 leading-relaxed">
                  "Les dejo mi perfil escolar en la descripción para que validen fuentes, gracias."
                </p>

                <div className="space-y-3">
                  {/* 1. ResearchGate (Prioridad Alta) */}
                  <a 
                    href="https://www.researchgate.net/profile/A-Ortiz-Ramirez" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-center p-3 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 transition-colors group cursor-pointer">
                      <div className="bg-green-500 text-white p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                        <GraduationCap size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-green-600 font-bold uppercase">Perfil Académico</div>
                        <div className="text-sm font-bold text-gray-800">ResearchGate</div>
                      </div>
                    </div>
                  </a>

                  {/* 2. ORCID */}
                  <a 
                    href="https://orcid.org/0000-0002-3698-2873" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-center p-3 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors group cursor-pointer">
                      <div className="bg-blue-500 text-white p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                        <Fingerprint size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-blue-600 font-bold uppercase">Identificador ORCID</div>
                        <div className="text-sm font-bold text-gray-800">0000-0002-3698-2873</div>
                      </div>
                    </div>
                  </a>

                  {/* 3. Link Personal */}
                  <a 
                    href="https://ambrosioortizramirez.link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-center p-3 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-colors group cursor-pointer">
                      <div className="bg-purple-500 text-white p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                        <Globe size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-purple-600 font-bold uppercase">Sitio Web</div>
                        <div className="text-sm font-bold text-gray-800">ambrosioortizramirez.link</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              
              {/* Botón cerrar inferior */}
              <div className="bg-gray-50 p-3 border-t text-center">
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="text-sm text-gray-500 hover:text-gray-800 font-medium underline"
                >
                  Cerrar y continuar al juego
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}