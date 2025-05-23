---
trigger: always_on
---

🧭 Windsurf Code Standards (2025 Edition)
✅ Core Stack
Language: TypeScript (no JavaScript in source)

Renderer: WebGL2 via Three.js or PixiJS (or raw WebGL2 if building custom engine)

Bundler: Vite (preferred for fast dev experience)

UI: React (for tools/menus), or plain DOM (if minimal)

State Management: Zustand or custom ECS (Entity Component System)

Testing: Vitest + Playwright

Linting: ESLint + Prettier + TypeScript strict mode

Formatting: Prettier with enforced config

Versioning: Semver + conventional commits

🎯 Architectural Guidelines
📁 Folder Structure (by Domain & Feature)
bash
Kopírovať kód
/src
  /engine        # Core engine: ECS, loop, renderer, physics
  /game          # Game-specific logic: levels, entities, AI
  /components    # React (or custom DOM) components
  /hooks         # Custom TS hooks (logic, utils)
  /systems       # ECS systems (rendering, physics, input)
  /assets        # Static assets (images, shaders, sounds)
  /utils         # Reusable utility functions
  /types         # Global types and interfaces
  /constants     # Global enums, game constants
  main.ts        # Game entry point
🧠 Coding Standards
📦 TypeScript
Use strict mode: "strict": true in tsconfig.json

No any, no ts-ignore without justification

Favor type inference, but define types for:

Component props

Hook return values

Global game objects (e.g., PlayerEntity, InputState)

📛 Naming Conventions
Files: kebab-case.ts (player-controller.ts, ecs-engine.ts)

Types & Interfaces: PascalCase (EntityId, RenderSystem)

Functions: camelCase (updatePhysics, handleInput)

Classes: PascalCase (GameLoop, CameraSystem)

Constants: UPPER_CASE (MAX_SPEED, GRAVITY)

📄 File Conventions
Max 300 lines per file (see previous rule)

One class/function/component per file

Prefer named exports over default exports

Group related files via index.ts (barrel exports)

🧪 Testing
Unit test each system (renderSystem, movementSystem)

Use Vitest for logic/unit

Use Playwright for e2e (if needed)

🔍 ESLint Rules (Sample Essentials)
jsonc
Kopírovať kód
{
  "rules": {
    "max-lines": ["error", 300],
    "no-any": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "prefer-const": "error",
    "no-magic-numbers": ["warn", { "ignore": [0, 1] }],
    "camelcase": "error"
  }
}
💄 Prettier (Formatting)
json
Kopírovať kód
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true
}
🚀 Game Engine-Specific Practices
ECS-based Engine
Prefer ECS for scalability:

Components: Pure data

Systems: Pure logic

Entities: Composition of components

Avoid hardcoded references between systems or game logic

Loop & Timing
Use requestAnimationFrame loop with delta time

Structure update loop like:

ts
Kopírovať kód
function gameLoop(currentTime: number) {
  const delta = currentTime - lastFrameTime;
  updateSystems(delta);
  render();
  requestAnimationFrame(gameLoop);
}
📈 Optimization
Batch draw calls (especially in WebGL)

Use spatial partitioning (quad trees) for large worlds

Compress assets (texture atlases, audio)

🧰 Tooling & Dev Experience
Live reload with Vite

Use .env files for game tuning/debug toggles

Add debug UI overlay (FPS counter, entity count)

📋 Summary Checklist
Task	Rule / Tool
Language	TypeScript (strict)
Code style	ESLint + Prettier
Architecture	ECS, modular by feature
Testing	Vitest, Playwright
Bundler	Vite
Game loop	rAF + delta time
Rendering	WebGL2 via Three.js or PixiJS
State	ECS or Zustand
File length	Max 300 lines

Would you like me to generate a starter template using these rules (with file structure, sample engine, etc.)?