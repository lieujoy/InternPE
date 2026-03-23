# Duel ⚔️

> **You vs the machine. One throw at a time.**

A dark, minimal Rock Paper Scissors game vs an AI that reads your patterns in real time. The name fits — it's a 1v1 duel, and the AI is learning you every round.

---

## Features

- 4 AI difficulty levels — Easy → Unbeatable (pattern prediction)
- 3 series modes — Best of 3 / 5 / 7 or Endless
- AI prediction bar — live read of your throw frequency
- HP bars — visual drain as you lose rounds
- Streak tracker with best streak
- Round history log
- 11 achievements persisted in localStorage
- Session stats — wins, losses, draws, win rate, fav move
- Letter grade (S/A/B/C/D) with animated reveal
- Confetti on match win
- Keyboard shortcuts — 1 = Rock, 2 = Paper, 3 = Scissors
- Zero AI delay — responds the instant you throw

---

## Theme

Dark arena aesthetic — deep charcoal base (`#0b0d12`), amber/gold accent, ambient glow on topbar, scoreboard, arena, buttons, clash cards, and panels — same glow style as Brainrot Quiz. Split welcome screen with move preview. Seamless borderless battle layout.

---

## Tech Stack

- Vanilla HTML / CSS / JavaScript
- Google Fonts: Inter
- localStorage for persistent achievements and round count

---

## File Structure

```
06RockPaperScissors/
├── index.html
├── styles.css
├── script.js
└── README.md
```

---

## How to Play

1. Select AI difficulty and series length
2. Click "Enter the Arena" or hit New Game
3. Throw Rock (1), Paper (2), or Scissors (3)
4. First to the win threshold takes the match
