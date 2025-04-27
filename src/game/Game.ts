import Player from './Player';
import Coin from './Coin';
import Obstacle from './Obstacle';
import Background from './Background';
import { GameState, CollisionType } from '../utils/types';
import { checkCollision } from '../utils/physics';
import { GAME_CONFIG, LEVEL_UP_SCORE } from '../utils/constants';

class Game {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private player: Player | null = null;
  private background: Background | null = null;
  private coins: Coin[] = [];
  private obstacles: Obstacle[] = [];
  private gameState: GameState = GameState.START;
  private score: number = 0;
  private level: number = 1;
  private lastTime: number = 0;
  private coinTimer: number = 0;
  private obstacleTimer: number = 0;
  private animationFrameId: number = 0;
  private uiElements = {
    scoreElement: null as HTMLElement | null,
    levelElement: null as HTMLElement | null,
    gameOverElement: null as HTMLElement | null,
    finalScoreElement: null as HTMLElement | null,
    finalLevelElement: null as HTMLElement | null,
    restartButton: null as HTMLElement | null,
    startScreen: null as HTMLElement | null,
    startButton: null as HTMLElement | null,
  };

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
      window.addEventListener('resize', this.resizeCanvas.bind(this));
    }
    this.initUI();
    this.initEventListeners();
  }

  private resizeCanvas(): void {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  private initUI(): void {
    this.uiElements = {
      scoreElement: document.getElementById('score'),
      levelElement: document.getElementById('level'),
      gameOverElement: document.getElementById('gameOver'),
      finalScoreElement: document.getElementById('finalScore'),
      finalLevelElement: document.getElementById('finalLevel'),
      restartButton: document.getElementById('restartButton'),
      startScreen: document.getElementById('startScreen'),
      startButton: document.getElementById('startButton'),
    };
  }

  private initEventListeners(): void {
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.gameState === GameState.PLAYING) {
        if (this.player) this.player.jump();
      }
    });

    // Touch controls
    this.canvas?.addEventListener('touchstart', () => {
      if (this.gameState === GameState.PLAYING && this.player) {
        this.player.jump();
      }
    });

    // Restart button
    this.uiElements.restartButton?.addEventListener('click', () => {
      this.resetGame();
      this.startGame();
    });

    // Start button
    this.uiElements.startButton?.addEventListener('click', () => {
      this.startGame();
    });
  }

  public start(): void {
    this.resetGame();
    this.gameLoop(0);
  }

  private startGame(): void {
    this.gameState = GameState.PLAYING;
    if (this.uiElements.startScreen) {
      this.uiElements.startScreen.classList.add('hidden');
    }
  }

  private resetGame(): void {
    this.score = 0;
    this.level = 1;
    this.gameState = GameState.START;
    this.coins = [];
    this.obstacles = [];
    this.coinTimer = 0;
    this.obstacleTimer = 0;

    // Update UI
    if (this.uiElements.scoreElement) this.uiElements.scoreElement.textContent = '0';
    if (this.uiElements.levelElement) this.uiElements.levelElement.textContent = '1';
    if (this.uiElements.gameOverElement) this.uiElements.gameOverElement.classList.add('hidden');
    if (this.uiElements.startScreen) this.uiElements.startScreen.classList.remove('hidden');

    // Create player
    const canvas = this.canvas as HTMLCanvasElement;
    this.player = new Player(canvas.width, canvas.height);

    // Create background
    this.background = new Background(canvas.width, canvas.height);
  }

  private gameLoop(timestamp: number): void {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (this.gameState === GameState.PLAYING) {
      this.update(deltaTime);
    }

    this.render();
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  private update(deltaTime: number): void {
    const canvas = this.canvas as HTMLCanvasElement;
    
    // Update player
    this.player?.update(deltaTime);

    // Update background
    this.background?.update(deltaTime, this.level);

    // Generate coins
    this.coinTimer += deltaTime;
    if (this.coinTimer > GAME_CONFIG.coinSpawnRate / (1 + (this.level - 1) * 0.1)) {
      this.coinTimer = 0;
      this.coins.push(new Coin(canvas.width, canvas.height));
    }

    // Generate obstacles
    this.obstacleTimer += deltaTime;
    if (this.obstacleTimer > GAME_CONFIG.obstacleSpawnRate / (1 + (this.level - 1) * 0.1)) {
      this.obstacleTimer = 0;
      this.obstacles.push(new Obstacle(canvas.width, canvas.height));
    }

    // Update coins
    this.coins.forEach((coin, index) => {
      coin.update(deltaTime, this.level);
      
      // Check if coin is off-screen
      if (coin.x + coin.width < 0) {
        this.coins.splice(index, 1);
      }
      
      // Check collision with player
      if (this.player && checkCollision(this.player, coin)) {
        this.score++;
        this.coins.splice(index, 1);
        this.updateScore();
        
        // Check for level up
        if (this.score % LEVEL_UP_SCORE === 0) {
          this.levelUp();
        }
      }
    });

    // Update obstacles
    this.obstacles.forEach((obstacle, index) => {
      obstacle.update(deltaTime, this.level);
      
      // Check if obstacle is off-screen
      if (obstacle.x + obstacle.width < 0) {
        this.obstacles.splice(index, 1);
      }
      
      // Check collision with player
      if (this.player && checkCollision(this.player, obstacle, CollisionType.OBSTACLE)) {
        this.gameOver();
      }
    });
  }

  private render(): void {
    if (!this.ctx || !this.canvas) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render background
    this.background?.render(this.ctx);
    
    // Render coins
    this.coins.forEach(coin => coin.render(this.ctx));
    
    // Render obstacles
    this.obstacles.forEach(obstacle => obstacle.render(this.ctx));
    
    // Render player
    this.player?.render(this.ctx);
  }

  private updateScore(): void {
    if (this.uiElements.scoreElement) {
      this.uiElements.scoreElement.textContent = this.score.toString();
    }
  }

  private levelUp(): void {
    this.level++;
    if (this.uiElements.levelElement) {
      this.uiElements.levelElement.textContent = this.level.toString();
    }
  }

  private gameOver(): void {
    this.gameState = GameState.GAME_OVER;
    
    // Update game over screen
    if (this.uiElements.finalScoreElement) {
      this.uiElements.finalScoreElement.textContent = this.score.toString();
    }
    if (this.uiElements.finalLevelElement) {
      this.uiElements.finalLevelElement.textContent = this.level.toString();
    }
    if (this.uiElements.gameOverElement) {
      this.uiElements.gameOverElement.classList.remove('hidden');
    }
  }

  public destroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
  }
}

export default Game;