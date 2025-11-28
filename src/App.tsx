import { useState } from 'react';
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
      
      {/* AQUÍ ESTÁ EL CAMBIO: Agregamos onExit={goHome} */}
      {gameState === 'PLAYING' && (
        <Game onGameOver={handleGameOver} onExit={goHome} />
      )}

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