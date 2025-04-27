import { GAME_CONFIG } from '../utils/constants';

class Obstacle {
  public x: number;
  public y: number;
  public width: number = 50;
  public height: number = 60;
  private speed: number = 6;
  private type: number;
  private sprite: HTMLImageElement | null = null;
  private opacity: number = 0;
  private fadeInSpeed: number = 0.05;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth;
    this.y = canvasHeight * 0.8 - this.height;
    
    // Random obstacle type (0 = spike, 1 = electric trap, 2 = falling object)
    this.type = Math.floor(Math.random() * 3);
    
    // Adjust height based on type
    if (this.type === 0) { // spike
      this.height = 40;
    } else if (this.type === 2) { // falling object
      this.y = canvasHeight * 0.4; // Position higher
    }
    
    // Create obstacle sprite
    this.createObstacleSprite();
  }
  
  private createObstacleSprite(): void {
    // In a full implementation, we would load a sprite sheet
    // For now, we'll use a simple colored shape based on type
    this.sprite = new Image();
    
    if (this.type === 0) {
      // Spike
      this.sprite.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg width="50" height="40" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,40 25,0 50,40" fill="#ef4444" />
        </svg>
      `);
    } else if (this.type === 1) {
      // Electric trap
      this.sprite.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
          <rect width="50" height="60" fill="#111827" />
          <path d="M10,10 L40,10 L25,30 L40,30 L10,50 L25,30 L10,30 Z" fill="#facc15" stroke="#fef3c7" stroke-width="2" />
        </svg>
      `);
    } else {
      // Falling object (box)
      this.sprite.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
          <rect width="50" height="60" fill="#64748b" rx="4" />
          <rect x="5" y="5" width="40" height="50" fill="#475569" rx="2" />
          <circle cx="25" cy="30" r="5" fill="#f8fafc" />
        </svg>
      `);
    }
  }
  
  public update(deltaTime: number, level: number): void {
    // Move obstacle left
    this.x -= this.speed * (1 + (level - 1) * 0.1);
    
    // For falling objects, also move down
    if (this.type === 2) {
      this.y += 2;
    }
    
    // Fade in effect
    if (this.opacity < 1) {
      this.opacity += this.fadeInSpeed;
    }
  }
  
  public render(ctx: CanvasRenderingContext2D): void {
    ctx.globalAlpha = this.opacity;
    
    if (this.sprite && this.sprite.complete) {
      ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      // Fallback if sprite is not loaded
      if (this.type === 0) {
        // Spike
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
      } else if (this.type === 1) {
        // Electric trap
        ctx.fillStyle = '#111827';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 10);
        ctx.lineTo(this.x + 40, this.y + 10);
        ctx.lineTo(this.x + 25, this.y + 30);
        ctx.lineTo(this.x + 40, this.y + 30);
        ctx.lineTo(this.x + 10, this.y + 50);
        ctx.lineTo(this.x + 25, this.y + 30);
        ctx.lineTo(this.x + 10, this.y + 30);
        ctx.closePath();
        ctx.fill();
      } else {
        // Falling object (box)
        ctx.fillStyle = '#64748b';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#475569';
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.globalAlpha = 1;
  }
}

export default Obstacle;