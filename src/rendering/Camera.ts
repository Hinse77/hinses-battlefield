import { CONFIG } from "../game/config";
import type { Player } from "../entities/Player";

export class Camera {
  x = 0; y = 0; zoom = 1;
  update(player: Player, dt: number, width: number, height: number) {
    const targetZoom = Math.max(CONFIG.camera.minZoom, Math.min(CONFIG.camera.maxZoom, 1.05 - Math.log2(player.mass / CONFIG.player.baseMass + 1) * 0.12));
    const amount = Math.min(1, dt * CONFIG.camera.smoothing);
    this.zoom += (targetZoom - this.zoom) * amount;
    this.x += (player.x - this.x) * amount; this.y += (player.y - this.y) * amount;
    void width; void height;
  }
}
