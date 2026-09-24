import type { Food } from "../game/types";
import type { Organism } from "../entities/Organism";

type Item = Organism | Food;

export class SpatialGrid {
  private cells = new Map<string, Item[]>();
  constructor(private readonly size: number) {}
  rebuild(items: Item[]) { this.cells.clear(); for (const item of items) { const key = this.key(item.x, item.y); const cell = this.cells.get(key); if (cell) cell.push(item); else this.cells.set(key, [item]); } }
  nearby(x: number, y: number, radius: number): Item[] { const found: Item[] = []; const minX = Math.floor((x - radius) / this.size), maxX = Math.floor((x + radius) / this.size), minY = Math.floor((y - radius) / this.size), maxY = Math.floor((y + radius) / this.size); for (let gx = minX; gx <= maxX; gx++) for (let gy = minY; gy <= maxY; gy++) found.push(...(this.cells.get(`${gx}:${gy}`) || [])); return found; }
  private key(x: number, y: number) { return `${Math.floor(x / this.size)}:${Math.floor(y / this.size)}`; }
}
