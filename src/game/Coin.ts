import { GAME_CONFIG } from '../utils/constants';

class Coin {
  public x: number;
  public y: number;
  public width: number = 40;
  public height: number = 40;
  private speed: number = 5;
  private sprite: HTMLImageElement | null = null;
  private opacity: number = 0;
  private fadeInSpeed: number = 0.05;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth;
    
    // Random height position (avoid placing too low or too high)
    const minY = canvasHeight * 0.2;
    const maxY = canvasHeight * 0.7;
    this.y = Math.random() * (maxY - minY) + minY;
    
    // Create cloud coin sprite
    this.createCloudCoinSprite();
  }
  
  private createCloudCoinSprite(): void {
    // In a full implementation, we would load a sprite sheet
    // For now, we'll use a simple colored cloud shape
    this.sprite = new Image();
    this.sprite.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="15" fill="#f8fafc" />
        <circle cx="12" cy="15" r="8" fill="#f8fafc" />
        <circle cx="28" cy="15" r="8" fill="#f8fafc" />
        <circle cx="20" cy="15" r="6" fill="#f8fafc" />
        <circle cx="20" cy="20" r="10" fill="#eab308" />
        <text x="20" y="24" font-size="12" text-anchor="middle" fill="#fef9c3">$</text>
      </svg>
    `);
  }
  
  public update(deltaTime: number, level: number): void {
    // Move coin left
    this.x -= this.speed * (1 + (level - 1) * 0.1);
    
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
      // Cloud shape
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Cloud puffs
      ctx.beginPath();
      ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(this.x + this.width * 2/3, this.y + this.height / 3, this.width / 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Coin in center
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 4, 0, Math.PI * 2);
      ctx.fill();
      
      // $ symbol
      ctx.fillStyle = '#fef9c3';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', this.x + this.width / 2, this.y + this.height / 2);
    }
    
    ctx.globalAlpha = 1;
  }
}

export default Coin;