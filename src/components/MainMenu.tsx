import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, PartyPopper, Globe, Fingerprint, GraduationCap } from 'lucide-react';
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
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[500px] z-10"
      >
        <Card className="p-6 bg-white/95 shadow-2xl backdrop-blur-md border-t-4 border-blue-600">
          
          {/* --- ENCABEZADO CON AVATAR --- */}
          <div className="text-center mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto w-32 h-32 mb-4 relative"
            >
              {/* Asegúrate de poner tu imagen 'avatar.png' en la carpeta public */}
              <img 
                src="/avatar.png" 
                alt="Avatar Profesor" 
                className="w-full h-full object-cover rounded-full border-4 border-blue-100 shadow-lg"
                onError={(e) => {
                  // Si no encuentra la imagen, muestra un placeholder gris
                  (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Profesor";
                }}
              />
            </motion.div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Divulgando las Finanzas <span className="text-blue-600">Games</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">EconMaster: Atrapa los Activos</p>
          </div>

          {/* --- BOTONES DE JUEGO --- */}
          <div className="space-y-3 mb-6">
            {/* JUEGO ACTUAL */}
            <Button
              onClick={onStart}
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md text-white"
            >
              <Play className="mr-2 w-5 h-5 fill-current" /> Jugar EconMaster
            </Button>

            {/* NUEVO JUEGO PIÑATAS */}
            <a href="https://TU_URL_AQUI.com" target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button
                variant="secondary"
                className="w-full h-12 text-lg bg-pink-100 text-pink-700 hover:bg-pink-200 border-2 border-pink-200"
              >
                <PartyPopper className="mr-2 w-5 h-5" /> Jugar "Piñatas de la Economía"
              </Button>
            </a>

            <Button
              onClick={() => setShowInstructions(!showInstructions)}
              variant="outline"
              className="w-full h-10 border hover:bg-gray-50 text-gray-600"
            >
              <BookOpen className="mr-2 w-4 h-4" /> {showInstructions ? 'Ocultar Reglas' : 'Cómo Jugar'}
            </Button>
          </div>

          {/* --- INSTRUCCIONES DESPLEGABLES --- */}
          <motion.div
            initial={false}
            animate={{ height: showInstructions ? 'auto' : 0, opacity: showInstructions ? 1 : 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100 text-left">
              <ul className="list-disc list-inside space-y-1">
                <li>Mueve el cerdito 🐷 con el mouse/dedo.</li>
                <li>Atrapa conceptos <span className="text-green-600 font-bold">BUENOS</span>.</li>
                <li>Esquiva los conceptos <span className="text-red-600 font-bold">MALOS</span>.</li>
              </ul>
            </div>
          </motion.div>

          {/* --- SECCIÓN ACADÉMICA (VALIDACIÓN DE FUENTES) --- */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3 italic">
              "Les dejo mi perfil escolar en la descripción para que validen fuentes, gracias."
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              <a 
                href="https://ambrosioortizramirez.link" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="ghost" className="w-full justify-start h-auto py-2 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                  <Globe className="mr-2 w-4 h-4" /> ambrosioortizramirez.link
                </Button>
              </a>

              <a 
                href="https://orcid.org/0000-0002-3698-2873" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="ghost" className="w-full justify-start h-auto py-2 text-xs text-gray-600 hover:text-green-600 hover:bg-green-50">
                  <Fingerprint className="mr-2 w-4 h-4" /> ORCID: 0000-0002-3698-2873
                </Button>
              </a>

              <a 
                href="https://www.researchgate.net/profile/A-Ortiz-Ramirez" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="ghost" className="w-full justify-start h-auto py-2 text-xs text-gray-600 hover:text-cyan-600 hover:bg-cyan-50">
                  <GraduationCap className="mr-2 w-4 h-4" /> Perfil ResearchGate
                </Button>
              </a>
            </div>
          </div>

        </Card>
      </motion.div>
    </div>
  );
}