import { useState } from 'react';
// Importamos los componentes. 
// NOTA: Si tus componentes no están subidos aún, esto dará error en el siguiente paso,
// pero vamos a arreglar primero el App.tsx.
import { MainMenu } from './components/MainMenu';
import { Game } from './components/Game';
import { GameOver } from './components/GameOver';

type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [lastScore, setLastScore] = useState(0);
  const [lastLevel, setLastLevel] = useState(1);

  const startGame = () => setGameState('PLAYING');
  
  const handleGameOver = (score: number, level: number) => {
    setLastScore(score);
    setLastLevel(level);
    setGameState('GAME_OVER');
  };

  const goHome = () => setGameState('MENU');

  return (
    <>
      {gameState === 'MENU' && <MainMenu onStart={startGame} />}
      {gameState === 'PLAYING' && <Game onGameOver={handleGameOver} />}
      {gameState === 'GAME_OVER' && (
        <GameOver 
          finalScore={lastScore} 
          level={lastLevel} 
          onRestart={startGame} 
          onHome={goHome} 
        />
      )}
    </>
  );
}
