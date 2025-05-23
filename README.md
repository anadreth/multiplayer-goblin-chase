# Multiplayer Goblin Chase 🧙‍♂️👹

A browser-based 2D multiplayer RPG game built with TypeScript. This game features shared real-time multiplayer, a tile-based map, enemies, and player interactions in a RuneScape-inspired style.

## 🎮 Features

- **Multiplayer gameplay** with real-time synchronization across clients
- **Tile-based map** with different terrain types (grass, swamp, water)
- **Enemy AI system** with goblins that patrol, chase, and attack players
- **Combat system** with health and attack mechanics
- **Spawning mechanics** for enemies from goblin nests
- **NPC interactions** with friendly characters like innkeepers

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/anadreth/multiplayer-goblin-chase.git
cd multiplayer-goblin-chase

# Install dependencies
npm install
```

### Running the Game

```bash
# Start development server
npm run dev
```

Then open your browser and navigate to `http://localhost:5173`.

### Building for Production

```bash
# Build the game
npm run build

# Preview the production build
npm run preview
```

## 🏗️ Project Structure

```
/src
  /engine        # Core game engine components
    /ecs         # Entity Component System
    /renderer    # Canvas rendering system
    /physics     # Physics and collision detection
    /input       # Input handling (keyboard, mouse)
  /game          # Game-specific logic
    /entities    # Player, enemies, NPCs
    /systems     # Game systems (combat, movement, etc.)
    /map         # Map generation and tile handling
  /network       # Multiplayer networking code
    /sync        # State synchronization
    /connection  # WebSocket connection handling
  /utils         # Utility functions and helpers
    /debug-overlay.ts # Performance monitoring overlay
  /types         # TypeScript interfaces and type definitions
  /constants     # Game constants and configuration
  main.ts        # Application entry point
```

## 🧰 Technology Stack

- **Language**: TypeScript
- **Renderer**: Canvas API
- **Bundler**: Vite
- **Linting**: ESLint + Prettier
- **Multiplayer**: WebSockets

## 🔍 Development Workflows

### Git Workflow

We use a feature branching workflow:

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes and commit them
3. Push your branch: `git push -u origin feature/your-feature-name`
4. Create a PR through GitHub CLI: `gh pr create --base main --head feature/your-feature-name --title "Your PR Title"`

### PR Review Process

We have automated tools for PR reviews:

```bash
# Review a PR with ID <number>
scripts\review-pr.cmd <number>
```

This will:
1. Fetch the PR details and comments
2. Generate a structured summary
3. Help identify and fix issues

See [PR Review Workflow](./docs/pr-review-workflow.md) for more details.

### Code Standards

- Maximum file length: 300 lines
- Follow the Single Responsibility Principle
- Use TypeScript's strict mode
- Avoid magic numbers, use constants
- Write clean, self-documenting code with appropriate comments

## 🎯 Game Design

### Map

- **Grass**: Normal movement speed
- **Swamp**: Reduced movement speed
- **Water**: Unwalkable

### Characters

- **Players**: Random name generation, health regeneration when not in combat
- **Goblins**: Patrol around nests, chase players within range, can be killed
- **Innkeeper**: Static NPC that offers dialogue options and healing

### Win Condition

Players win when all three goblin nests on the map are destroyed.

## 📝 License

[MIT License](LICENSE)

## 🤝 Contributing

Contributions are welcome! Please follow our code standards and workflow processes.

---

*This project is part of the Windsurf 2025 game development curriculum.*