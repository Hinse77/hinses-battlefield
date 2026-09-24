import "./style.css";
import { Game } from "./game/Game";

new Game(document.querySelector<HTMLCanvasElement>("#game")!);

const settingsToggle = document.querySelector<HTMLButtonElement>("#settings-toggle")!;
const pauseButton = document.querySelector<HTMLButtonElement>("#pause-round")!;
settingsToggle.addEventListener("click", () => requestAnimationFrame(() => pauseButton.click()));
