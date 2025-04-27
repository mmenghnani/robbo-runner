import { GameObject, CollisionType } from './types';

// Basic collision detection
export function checkCollision(
  object1: GameObject,
  object2: GameObject,
  type: CollisionType = CollisionType.COIN
): boolean {
  // Calculate collision box with some margin for fair gameplay
  let margin = 10;
  
  // Tighter collision for obstacles (more forgiving)
  if (type === CollisionType.OBSTACLE) {
    margin = 15;
  }
  
  return (
    object1.x + margin < object2.x + object2.width - margin &&
    object1.x + object1.width - margin > object2.x + margin &&
    object1.y + margin < object2.y + object2.height - margin &&
    object1.y + object1.height - margin > object2.y + margin
  );
}