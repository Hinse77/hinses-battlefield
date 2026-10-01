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
  chaosExplosionAt = 0;
  edgeEscapeUntil = 0;
  stuckSeconds = 0;
  constructor(public id: number, public x: number, public y: number, public mass: number, public color: string, public personality: "grazer" | "coward" | "hunter" | "opportunist" | "chaotic" | "elite", public name: string, public boss = false) { this.target = { x, y }; this.displayRadius = this.radius; }
  get radius() { return CONFIG.player.baseRadius * Math.pow(this.mass / CONFIG.player.baseMass, CONFIG.player.radiusExponent); }
  update(dt: number) {
    const safeMargin = Math.max(96, this.radius * 1.55);
    this.target.x = Math.max(safeMargin, Math.min(CONFIG.world.width - safeMargin, this.target.x));
    this.target.y = Math.max(safeMargin, Math.min(CONFIG.world.height - safeMargin, this.target.y));
    const dx = this.target.x - this.x, dy = this.target.y - this.y, distance = Math.hypot(dx, dy);
    const personalitySpeed = this.personality === "opportunist" ? 1.1 : 1;
    const speedLimit = Math.max(85, 305 / Math.pow(this.mass / CONFIG.player.baseMass, .24)) * this.speedMultiplier * personalitySpeed * CONFIG.gameplay.movementSpeed;
    if (distance > 3) { this.velocity.x += dx / distance * 780 * personalitySpeed * CONFIG.gameplay.movementSpeed * dt; this.velocity.y += dy / distance * 780 * personalitySpeed * CONFIG.gameplay.movementSpeed * dt; }
    const wallForce = 1450, edgeBand = safeMargin * 1.55;
    const leftPressure = Math.max(0, (edgeBand - this.x) / edgeBand), rightPressure = Math.max(0, (this.x - (CONFIG.world.width - edgeBand)) / edgeBand), topPressure = Math.max(0, (edgeBand - this.y) / edgeBand), bottomPressure = Math.max(0, (this.y - (CONFIG.world.height - edgeBand)) / edgeBand);
    this.velocity.x += (leftPressure * leftPressure - rightPressure * rightPressure) * wallForce * dt;
    this.velocity.y += (topPressure * topPressure - bottomPressure * bottomPressure) * wallForce * dt;
    if (this.x < safeMargin) { this.velocity.x = Math.max(0, this.velocity.x); this.target.x = Math.max(this.target.x, safeMargin * 1.8); }
    if (this.x > CONFIG.world.width - safeMargin) { this.velocity.x = Math.min(0, this.velocity.x); this.target.x = Math.min(this.target.x, CONFIG.world.width - safeMargin * 1.8); }
    if (this.y < safeMargin) { this.velocity.y = Math.max(0, this.velocity.y); this.target.y = Math.max(this.target.y, safeMargin * 1.8); }
    if (this.y > CONFIG.world.height - safeMargin) { this.velocity.y = Math.min(0, this.velocity.y); this.target.y = Math.min(this.target.y, CONFIG.world.height - safeMargin * 1.8); }
    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed > speedLimit) { this.velocity.x = this.velocity.x / speed * speedLimit; this.velocity.y = this.velocity.y / speed * speedLimit; }
    const drag = Math.exp(-5.2 * dt); this.velocity.x *= drag; this.velocity.y *= drag;
    const previousX = this.x, previousY = this.y;
    this.x = Math.max(this.radius, Math.min(CONFIG.world.width - this.radius, this.x + this.velocity.x * dt));
    this.y = Math.max(this.radius, Math.min(CONFIG.world.height - this.radius, this.y + this.velocity.y * dt));
    const moved = Math.hypot(this.x - previousX, this.y - previousY), nearBoundary = this.x < edgeBand || this.x > CONFIG.world.width - edgeBand || this.y < edgeBand || this.y > CONFIG.world.height - edgeBand, hasDistantTarget = Math.hypot(this.target.x - this.x, this.target.y - this.y) > safeMargin;
    this.stuckSeconds = nearBoundary && hasDistantTarget && moved < Math.max(.25, dt * 14) ? this.stuckSeconds + dt : Math.max(0, this.stuckSeconds - dt * 2);
    if (this.stuckSeconds > .7) { const centerX = CONFIG.world.width / 2, centerY = CONFIG.world.height / 2, dx = centerX - this.x, dy = centerY - this.y, centerDistance = Math.max(1, Math.hypot(dx, dy)), lane = (this.id % 7 - 3) * 105; this.target = { x:centerX-dy/centerDistance*lane, y:centerY+dx/centerDistance*lane }; this.velocity.x += dx/centerDistance*280; this.velocity.y += dy/centerDistance*280; this.edgeEscapeUntil = performance.now() + 2400; this.stuckSeconds = 0; }
    this.displayRadius += (this.radius - this.displayRadius) * Math.min(1, dt * 8);
  }
}
