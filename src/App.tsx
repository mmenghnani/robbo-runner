import React, { useEffect } from 'react';
import Game from './game/Game';
import './App.css';

function App() {
  useEffect(() => {
    const game = new Game();
    game.start();

    return () => {
      game.destroy();
    };
  }, []);

  return (
    <div className="game-container">
      <canvas id="gameCanvas"></canvas>
      <div id="gameUI" className="game-ui">
        <div className="hud">
          <div className="score-container">
            <span className="score-label">SCORE:</span>
            <span id="score" className="score-value">0</span>
          </div>
          <div className="level-container">
            <span className="level-label">LEVEL:</span>
            <span id="level" className="level-value">1</span>
          </div>
        </div>
        <div id="gameOver" className="game-over hidden">
          <h2>GAME OVER</h2>
          <div className="results">
            <p>Final Score: <span id="finalScore">0</span></p>
            <p>Level Reached: <span id="finalLevel">1</span></p>
          </div>
          <button id="restartButton" className="restart-button">RESTART</button>
        </div>
        <div id="startScreen" className="start-screen">
          <h1>ROBO DASH</h1>
          <h2>Cloud Coin Runner</h2>
          <div className="instructions">
            <p>Collect cloud coins and avoid obstacles</p>
            <p>Press SPACE or tap to jump</p>
            <p>Double-tap/press for double jump</p>
          </div>
          <button id="startButton" className="start-button">START GAME</button>
        </div>
      </div>
    </div>
  );
}

export default App;