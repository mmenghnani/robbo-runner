import { GAME_CONFIG } from '../utils/constants';

class Background {
  private layers: BackgroundLayer[] = [];
  private width: number;
  private height: number;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    // Create background layers
    this.createLayers();
  }
  
  private createLayers(): void {
    // Sky layer
    this.layers.push({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      speed: 0,
      color: '#0ea5e9',
      elements: this.createClouds(),
      render: (ctx: CanvasRenderingContext2D) => {
        // Draw sky
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0ea5e9');
        gradient.addColorStop(1, '#38bdf8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.layers[0].elements.forEach(cloud => {
          ctx.beginPath();
          ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
          ctx.arc(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.3, cloud.size * 0.7, 0, Math.PI * 2);
          ctx.arc(cloud.x - cloud.size * 0.6, cloud.y - cloud.size * 0.3, cloud.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
    
    // Far buildings layer
    this.layers.push({
      x: 0,
      y: 0,
      width: this.width * 2,
      height: this.height,
      speed: 1,
      color: '#0f172a',
      elements: this.createBuildings(0.5, 0.2, 15),
      render: (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#0f172a';
        this.layers[1].elements.forEach(building => {
          ctx.fillRect(
            building.x, 
            this.height - building.height, 
            building.width, 
            building.height
          );
        });
      }
    });
    
    // Mid buildings layer
    this.layers.push({
      x: 0,
      y: 0,
      width: this.width * 2,
      height: this.height,
      speed: 2,
      color: '#1e293b',
      elements: this.createBuildings(0.6, 0.3, 10),
      render: (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#1e293b';
        this.layers[2].elements.forEach(building => {
          ctx.fillRect(
            building.x, 
            this.height - building.height, 
            building.width, 
            building.height
          );
        });
      }
    });
    
    // Ground layer
    this.layers.push({
      x: 0,
      y: this.height * 0.8,
      width: this.width * 2,
      height: this.height * 0.2,
      speed: 5,
      color: '#334155',
      elements: [],
      render: (ctx: CanvasRenderingContext2D) => {
        // Draw ground
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, this.height * 0.8, this.width, this.height * 0.2);
        
        // Draw ground details
        ctx.fillStyle = '#475569';
        for (let i = 0; i < this.width; i += 100) {
          const offset = (this.layers[3].x % 100);
          ctx.fillRect(i - offset, this.height * 0.8, 50, 2);
        }
      }
    });
  }
  
  private createClouds(): any[] {
    const clouds = [];
    const count = 10;
    
    for (let i = 0; i < count; i++) {
      clouds.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.5,
        size: Math.random() * 30 + 20
      });
    }
    
    return clouds;
  }
  
  private createBuildings(maxHeightPercent: number, minHeightPercent: number, count: number): any[] {
    const buildings = [];
    const buildingWidth = this.width / count;
    
    for (let i = 0; i < count * 2; i++) {
      const height = this.height * (Math.random() * (maxHeightPercent - minHeightPercent) + minHeightPercent);
      
      buildings.push({
        x: i * buildingWidth,
        height: height,
        width: buildingWidth * (0.7 + Math.random() * 0.3)
      });
    }
    
    return buildings;
  }
  
  public update(deltaTime: number, level: number): void {
    // Update each layer
    this.layers.forEach(layer => {
      // Move layer based on speed
      layer.x -= layer.speed * (1 + (level - 1) * 0.1) * deltaTime / 16;
      
      // Reset position if off-screen
      if (layer.x <= -layer.width / 2) {
        layer.x = 0;
      }
      
      // Update cloud positions
      if (layer.elements && layer.speed === 0) {
        layer.elements.forEach(cloud => {
          cloud.x -= 0.2 * deltaTime / 16;
          
          if (cloud.x + cloud.size < 0) {
            cloud.x = this.width + cloud.size;
            cloud.y = Math.random() * this.height * 0.5;
          }
        });
      }
    });
  }
  
  public render(ctx: CanvasRenderingContext2D): void {
    // Render each layer
    this.layers.forEach(layer => {
      layer.render(ctx);
    });
  }
}

interface BackgroundLayer {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  elements: any[];
  render: (ctx: CanvasRenderingContext2D) => void;
}

export default Background;