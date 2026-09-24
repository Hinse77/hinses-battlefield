import { CONFIG } from "../game/config";
import type { Vector } from "../game/types";

export class Organism {
  velocity: Vector = { x: 0, y: 0 };
  target: Vector;
  decisionIn = Math.random() * .7;
  displayRadius: number;
  speedMultiplier = 1;
  boostUntil = 0;
  abilityCooldownUntil = 0;
  constructor(public id: number, public x: number, public y: number, public mass: number, public color: string, public personality: "grazer" | "coward" | "hunter" | "opportunist" | "chaotic" | "elite", public name: string, public boss = false) { this.target = { x, y }; this.displayRadius = this.radius; }
  get radius() { return CONFIG.player.baseRadius * Math.sqrt(this.mass / CONFIG.player.baseMass); }
  update(dt: number) {
    const safeMargin = Math.max(180, this.radius * 3);
    this.target.x = Math.max(safeMargin, Math.min(CONFIG.world.width - safeMargin, this.target.x));
    this.target.y = Math.max(safeMargin, Math.min(CONFIG.world.height - safeMargin, this.target.y));
    const dx = this.target.x - this.x, dy = this.target.y - this.y, distance = Math.hypot(dx, dy);
    const speedLimit = Math.max(85, 305 / Math.pow(this.mass / CONFIG.player.baseMass, .24)) * this.speedMultiplier;
    if (distance > 3) { this.velocity.x += dx / distance * 780 * dt; this.velocity.y += dy / distance * 780 * dt; }
    if (this.x < safeMargin) this.velocity.x += 950 * dt;
    if (this.x > CONFIG.world.width - safeMargin) this.velocity.x -= 950 * dt;
    if (this.y < safeMargin) this.velocity.y += 950 * dt;
    if (this.y > CONFIG.world.height - safeMargin) this.velocity.y -= 950 * dt;
    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed > speedLimit) { this.velocity.x = this.velocity.x / speed * speedLimit; this.velocity.y = this.velocity.y / speed * speedLimit; }
    const drag = Math.exp(-5.2 * dt); this.velocity.x *= drag; this.velocity.y *= drag;
    this.x = Math.max(this.radius, Math.min(CONFIG.world.width - this.radius, this.x + this.velocity.x * dt));
    this.y = Math.max(this.radius, Math.min(CONFIG.world.height - this.radius, this.y + this.velocity.y * dt));
    this.displayRadius += (this.radius - this.displayRadius) * Math.min(1, dt * 8);
  }
}
