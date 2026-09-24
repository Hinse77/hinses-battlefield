# Architecture

- `src/game/config.ts`: central balancing settings.
- `src/game/Game.ts`: loop, input, food lifecycle, and drawing orchestration.
- `src/entities/Player.ts`: player movement and mass-to-radius logic.
- `src/entities/Organism.ts`: lightweight computer-controlled organism movement.
- `src/game/Game.ts`: additionally owns AI decisions, absorption rules, respawn queue, HUD, and game state.
- `src/rendering/Camera.ts`: smooth player-following camera and zoom.
- `src/systems/SpatialGrid.ts`: bucketed nearby-entity lookup for AI perception.
- `src/game/types.ts`: shared simple data types.
