# ⚔️ Connect Four - Anime Edition
 
> **11 Epic Battles: One Piece, Naruto, Dragon Ball, & More!**
 
Experience the classic Connect Four game reimagined with **11 immersive anime themes**. Choose your favorite universe and battle with custom visuals, animations, and sound effects!

## 🌐 Live Demo

**Play Now**: Open `index.html` in your browser

## ✨ Features
 
### 🎭 11 Complete Anime Themes
Each theme has custom backgrounds with animations, theme-aware game pieces with unique icons, and faction-specific aesthetics.

1. **One Piece** 🏴‍☠️ (Straw Hats vs Marines)
2. **Naruto** 🍃 (Konoha vs Akatsuki)
3. **Dragon Ball** 🔮 (Z Fighters vs Frieza Force)
4. **One Punch Man** 👊 (Hero Association vs Monster Assoc.)
5. **Demon Slayer** ⚔️ (Demon Slayers vs 12 Kizuki)
6. **Attack on Titan** 🗡️ (Survey Corps vs Titans)
7. **Pokemon** ⚡ (Pokemon League vs Team Rocket)
8. **Jujutsu Kaisen** ✨ (Jujutsu High vs Cursed Spirits)
9. **Hunter x Hunter** 🎣 (Hunters vs Spiders)
10. **Bleach** ⚔️ (Soul Reapers vs The Espada)
11. **Berserk** 🩸 (Band of the Hawk vs God Hand)
 
### 🎮 Core Gameplay
- **Classic Connect Four**: Get 4 pieces in a row to win (horizontal, vertical, or diagonal)
- **Game Modes**: Play "Squad Up" (local multiplayer) or "Solo Challenge" against a smart AI.
- **Theme-Aware Pieces**: Every piece shows a unique icon for the selected theme
- **Custom Board Selection**: Select the classic 7x6 board or try new custom sizes via a scrollable selector.
- **Win Tracking**: Persistent score tracking for both factions.
 
### 🎨 Stunning Updates
- **Animated Backgrounds**: Unique 20s-30s looped animations for EACH theme!
- **Gen Z UI**: Modern buttons, light readable fonts, and clean layouts.
- **Professional Navigation**: Comfortable bottom-left back button placements.
- **Arrow Effects**: Watch a dynamic SVG glowing arrow pierce through 2, 3, or exactly 4 connected points as a visual connection indicator.

## 🎮 How to Play

### Starting the Game
1. Open `index.html` in any modern web browser
2. Start by selecting your mode and choosing the anime theme.
3. Click on any column to drop your piece.

### Making Moves
1. **Choose a Column**: Click on any column at the top
2. **Watch It Drop**: Your piece falls with realistic physics
3. **See Connections**: Glowing arrows appear automatically when you connect multiple pieces.
4. **Win the Game**: Connect 4 pieces horizontally, vertically, or diagonally.

## 📁 File Structure

```
04ConnectFour/
├── index.html      # Game structure and layout
├── styles.css      # Theming, animations, and UI
├── script.js       # Game logic, UI controllers, and arrow system
├── gameEngine.js   # Core ConnectFour grid state and connection logic
├── themeManager.js # Theme definitions, colors, emojis, and classes 
├── aiPlayer.js     # MiniMax AI algorithm and evaluation heuristics
├── soundManager.js # Audio feedback for clicks, drops, and victories
└── README.md       # This documentation
```

## 💻 Technical Implementation

### HTML5 & CSS3
- Semantic structure with SVG overlays for Arrow rendering.
- Animated dynamic gradients and particle floating backgrounds representing different domains (e.g. Domain Expansion, The Eclipse, Paramount War)
- Heavy use of Custom Properties (`--pirate-primary`, `--marine-primary`) for unified UI accent colors.

### JavaScript (ES6+)
- **Game State**: Backed by a full 2D array matrix tracked inside the Engine class.
- **MiniMax + Alpha Beta Pruning Algorithm**: Fast, scalable AI built right into the JS logic that responds dynamically based on difficulty.
- **SVG Connections**: Real-time rendering of connecting arrows for connected groups.

## 📱 Responsive Design

Works beautifully on all devices.
* Breakpoints are fully set to handle Desktop (> 768px), Tablet, and Mobile (< 480px).
* Smooth, touch-optimized spacing for grid-drops on smaller screens. 

---

**Built with 💙❤️ during InternPE Internship**

*May the best force win!* ⚔️
