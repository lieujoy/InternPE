# 🫠 Brainrot Quiz — 05QuizGame

> Double meaning: Gen-Z slang for obsessive content + your brain rotting from not studying.

A full-featured trivia quiz game with a dark space UI, 11 categories, 3 game modes, lifelines, achievements, leaderboard, letter grades, and fun facts. Built as the final project for the portfolio.

## 🌐 Live Demo

Open `index.html` in your browser — no server needed.

## ✨ Features

- **11 categories × 5 questions each** — Astronomy, Space Tech, Physics, Exploration, Mythology, Biology, Chemistry, History, Geography, Technology, Mathematics
- **3 game modes** — Classic (no timer), Timed ⚡ (60s), Survival 💀 (30s per question, 1 wrong = game over)
- **All Categories mode** — 20 random questions pulled across all 11 categories
- **3 lifelines** (Timed & Survival only) — ✂️ 50/50, 🔄 Skip, 🎯 Double Dip
  - All Categories: 3 lifelines total | Individual category: 1 lifeline
  - Double Dip: 2 attempts on the same question; first wrong pick is marked red but game continues
- **Streak multiplier** — score = `(streak + 1) × 15` per correct answer
- **Letter grade on results** — A+ / A / B / C / D / F with animated reveal
- **"Did You Know?" fun facts** — a random fact appears after every correct answer
- **Mission Failed** — triggered when accuracy < 33% (red title, skull icon, red accuracy box)
- **Confetti** — fires on score ≥ 200
- **Achievements** — 10 unlockable badges based on streaks, score thresholds, and perfect runs
- **Leaderboard** — top 5 scores persisted in `localStorage` (`brainrot_lb`)
- **Mid-game warning** — clicking "Let's Go" during an active quiz shows a confirm/cancel overlay instead of silently restarting
- **Keyboard shortcuts** — press `1`–`4` to pick answers
- **Zoom-safe UI** — layout uses `rem` + `clamp()` so it holds at any zoom level

## 🎮 How to Play

1. Pick a **Category** and **Mode** from the header dropdowns
2. Click **Let's Go** (header) or the big **Let's Go** button on the welcome screen
3. Answer questions — use lifelines if available (Timed/Survival only)
4. See your **grade**, **score**, **accuracy**, and **achievements** at the end
5. Hit **Run It Back** to retry or **Close** to return to the welcome screen

## 📁 File Structure

```
05QuizGame/
├── index.html    — UI layout, welcome screen, question card, results modal
├── styles.css    — Dark space theme, animations, responsive layout
├── script.js     — All game logic: state, timer, lifelines, scoring, grade, facts
└── README.md     — This file
```

## 🛠️ Tech Stack

- HTML5 (semantic, accessible IDs)
- CSS3 — custom properties, `clamp()`, keyframe animations, backdrop-filter
- Vanilla JavaScript ES6+ — no dependencies
- `localStorage` — leaderboard persistence

## 🧠 Score & Grade System

| Accuracy | Grade | Label |
|----------|-------|-------|
| ≥ 90%    | A+    | Absolute W 🏆 |
| ≥ 80%    | A     | Lowkey a Genius 🧠 |
| ≥ 66%    | B     | Solid effort 💪 |
| ≥ 50%    | C     | Mid but make it work 😐 |
| ≥ 33%    | D     | Barely survived 😬 |
| < 33%    | F     | Brainrot confirmed 🫠 → Mission Failed |

---

**Brainrot Quiz** — made for the portfolio, stayed for the chaos 🫠
