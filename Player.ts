import { CONFIG } from "../game/config";
import type { Vector } from "../game/types";

export class Player {
  x: number;
  y: number;
  velocity: Vector = { x: 0, y: 0 };
  mass = CONFIG.player.startMass;
  displayRadius: number = CONFIG.player.baseRadius;
  speedMultiplier = 1;

  constructor(x: number, y: number) { this.x = x; this.y = y; }
  get radius() { return CONFIG.player.baseRadius * Math.sqrt(this.mass / CONFIG.player.baseMass); }
  update(dt: number, target: Vector) {
    const dx = target.x - this.x, dy = target.y - this.y, distance = Math.hypot(dx, dy);
    const desiredSpeed = Math.max(CONFIG.player.minSpeed, CONFIG.player.maxSpeed / Math.pow(this.mass / CONFIG.player.baseMass, 0.27)) * this.speedMultiplier;
    if (distance > 5) { this.velocity.x += (dx / distance) * CONFIG.player.acceleration * this.speedMultiplier * dt; this.velocity.y += (dy / distance) * CONFIG.player.acceleration * this.speedMultiplier * dt; }
    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed > desiredSpeed) { this.velocity.x = this.velocity.x / speed * desiredSpeed; this.velocity.y = this.velocity.y / speed * desiredSpeed; }
    const damping = Math.exp(-CONFIG.player.damping * dt); this.velocity.x *= damping; this.velocity.y *= damping;
    this.x = Math.max(this.radius, Math.min(CONFIG.world.width - this.radius, this.x + this.velocity.x * dt));
    this.y = Math.max(this.radius, Math.min(CONFIG.world.height - this.radius, this.y + this.velocity.y * dt));
    this.displayRadius += (this.radius - this.displayRadius) * Math.min(1, dt * 9);
  }
}
