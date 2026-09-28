# Hinses Battlefield

Browser game built with TypeScript, Vite, and Canvas.

## Publish with Vercel

1. Upload this complete project structure to a GitHub repository, including the `src` and `public` folders.
2. Import the repository in Vercel.
3. Use the default Vite settings: build command `npm run build`, output directory `dist`.
4. Deploy.

## Local development

Run `npm install` once, then `npm run dev`.

## Arena replay codes

After a completed round, choose **Copy arena code** and send the short code to a friend. They paste it into the optional **Arena code** field on the start screen. The game automatically chooses the matching difficulty and creates the same initial food, opponent, and boss layout. The match itself still depends on each player's decisions, making the code a fair challenge rather than a prerecorded run.

## Shared leaderboard

The game contains Vercel serverless APIs for the leaderboard and anonymous arena activity. Connect **Upstash Redis** through the Vercel Marketplace and redeploy to enable the shared Hall of Fame and counter. The counter records unique game sessions, started and completed rounds, wins, difficulty distribution, and the country associated with each round start; it stores neither player names nor IP addresses. Separate anonymous balance summaries are kept for Easy, Normal, Hard, and Very Hard, including pace, end mass, pressure phases, combos, boss defeats, poison damage and Chaotic blast impact. Without Redis, the game safely falls back to local browser records.

Every run receives a unique ID. Wins, losses, time-outs, restarts, quits, and browser closes are retained for analysis; interrupted runs are clearly marked and excluded from the completed-round win rate. Local development queues telemetry for the deployed Vercel balance endpoint and retries it later when the endpoint or Redis is temporarily unavailable.

The ten-level service-rank system accumulates difficulty-weighted points across rounds. Rank records are recognized by arena name, synchronized through the same Redis integration, and retained locally when the API is temporarily unavailable. The current military badge appears on the player orb; Battlefield Apex is paced for roughly one hundred strong Very Hard runs.

## Competitive endgame roles

On Hard and Very Hard, large Elites use a mass-aware **Heavy Vector** burst: they remain dangerous but their acceleration tapers and their recovery window grows, so a timed player Overdrive is a dependable escape. Late Cowards become survival scavengers that read multiple threats and build mass from safe food routes. Bosses defeated by another AI organism can return once through a **Boss Core** after 20 seconds; a boss defeated by the player stays down. Deep Statistics and the shared balance feed record AI boss defeats and Boss Core returns for later tuning.
