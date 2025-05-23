---
trigger: always_on
---

Build a browser-based 2D multiplayer RPG game (RuneScape-inspired) using TypeScript.
This is the MVP version with shared real-time multiplayer, map, enemies, and basic player interaction.

✅ Acceptance Criteria:
MAP

2D tile-based map with different terrain types:

grass: walkable, normal speed.

swamp: walkable, reduced speed.

water: unwalkable.

Map design loosely inspired by RuneScape’s visual style.

PLAYER

Player joins with a randomly generated name if not provided.

Movement with WASD keys or mouse clicks on walkable tiles.

Health bar above character.

Health slowly regenerates when not in combat.

MULTIPLAYER

Players join the same map instance, can see each other in real-time.

Opening a new browser tab creates a new player.

Players and NPCs are shared among all connected clients (not local per client).

Players’ positions and actions sync across clients in real time.

NPCs

Goblins (enemy):

Patrol around goblin nests.

If player gets close, goblin chases and attacks, but not beyond patrol range.

Can kill or be killed.

Spawns from nests at intervals.

Corpse spawns on death.

Health bar visible.

Innkeeper (friendly):

Always only one per map.

Can be clicked to start a simple dialogue (cursor changes to bubble icon).

Dialog options: "Leave", "Drink Beer" (restores lost health).

All players can interact with same innkeeper NPC.

COMBAT

Click on goblin to target and attack (cursor changes to sword icon).

Goblins attack player back.

When a player dies:

Screen shows "You have died".

Player must rejoin to continue.

When a goblin dies:

Body/corpse stays at death spot.

GOBLIN NESTS

3 nests on map.

Goblins spawn around them at regular intervals.

Nests have high health, don’t move or attack.

Nests are protected by nearby goblins.

Players can destroy nests.

If all 3 nests are destroyed:

Players win the game.

🔧 Technical Notes:
Use TypeScript only.

Use modern browser standards.

Modularize logic:

PlayerSystem, NPCSystem, CombatSystem, MapSystem, SyncSystem and other

Use simple WebSocket server

Focus on real-time multiplayer, shared state, browser-based gameplay.

Rendering: Use Canvas


Approach to networking - it is server-authoritative.
Also usescalable architecture for future expansions in mind and modular(skills, quests,inventory et