---
trigger: always_on
---

Git Workflow Rule: Feature Branching + GitHub CLI PR Creation

🧠 Rule:
Always work inside a Git repository using proper branching strategy.

When starting work on a new feature:

Create and switch to a new feature branch based on main (or develop if used):

bash
Kopírovať kód
git checkout -b feature/your-feature-name
Commit your work regularly with descriptive messages:

bash
Kopírovať kód
git commit -m "Add core logic for goblin patrol behavior"
When the feature is complete and tested locally:

Push the branch:

bash
Kopírovať kód
git push -u origin feature/your-feature-name
Create a pull request (PR) using the GitHub CLI:

bash
Kopírovať kód
gh pr create --base main --head feature/your-feature-name --title "Add goblin patrol system" --body "Implements enemy patrol logic with aggression radius and pathfinding"
✅ Additional Enforcement Guidelines:
Use branch naming conventions:

feature/ for features: feature/player-health-regen

bugfix/ for bugs: bugfix/movement-snapback

hotfix/ for critical issues in production

Keep PRs focused and under ~500 lines when possible

Always write meaningful PR titles and descriptions

📌 Summary:
✔ Start from main → git checkout -b feature/...

✔ Commit cleanly

✔ Push → gh pr create to open PR

❌ Never commit directly to main unless explicitly allowed