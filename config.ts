export const CONFIG = {
  world: { width: 6000, height: 6000 },
  player: { startMass: 200, baseMass: 100, baseRadius: 24, acceleration: 1500, damping: 6.5, minSpeed: 145, maxSpeed: 360 },
  food: { initialCount: 1000, mass: 2, radius: 3.2 },
  organisms: { initialCount: 250, startMassMin: 38, startMassMax: 260, respawnDelay: 1.8, perceptionRadius: 420, absorbMassRatio: 1.15, playerSpawnSafetyRadius: 1100, playerSpawnGraceSeconds: 4 },
  victory: { defaultMode: "mass" as "mass" | "time", targetMass: 40000, maxSurvivalSeconds: 600 },
  effects: { particleLife: .55, particleCount: 13, pulseStrength: .22 },
  performance: { gridSize: 260 },
  camera: { minZoom: 0.58, maxZoom: 1.05, smoothing: 5 },
  colors: ["#74f4b8", "#75b8ff", "#ffcf6b", "#f290ff", "#70e3ff", "#fb8699", "#b697ff"],
  personalityColors: { grazer: "#74f4b8", coward: "#75b8ff", hunter: "#ff334f", opportunist: "#ffcf6b", chaotic: "#f290ff", elite: "#b697ff" },
} as const;
