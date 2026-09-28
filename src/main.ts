import "./style.css";
import { Game } from "./game/Game";
import { CelebrationFireworks } from "./ui/CelebrationFireworks";

new Game(document.querySelector<HTMLCanvasElement>("#game")!);
new CelebrationFireworks(document.querySelector<HTMLElement>("#fireworks")!);

const settingsToggle = document.querySelector<HTMLButtonElement>("#settings-toggle")!;
const pauseButton = document.querySelector<HTMLButtonElement>("#pause-round")!;
settingsToggle.addEventListener("click", () => requestAnimationFrame(() => pauseButton.click()));
