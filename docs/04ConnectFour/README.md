# ⚔️ Connect Four - Good vs Evil

> **An Epic Battle of Strategy and Destiny**

Experience the classic Connect Four game reimagined as an epic battle between Good (Blue) and Evil (Red), featuring stunning visual effects, realistic physics animations, and dynamic arrow effects that celebrate every connection!

## 🌐 Live Demo

**Play Now**: Open `index.html` in your browser

## ✨ Features

### 🎮 Core Gameplay
- **Classic Connect Four**: Get 4 pieces in a row to win (horizontal, vertical, or diagonal)
- **Good vs Evil Theme**: Blue represents Good, Red represents Evil
- **Turn-Based Strategy**: Players alternate placing pieces
- **Win Tracking**: Keep score of victories for both Good and Evil

### 🎨 Stunning Visuals
- **Thematic Design**: 
  - **Good (Blue)**: Angelic glow, heroic aesthetics, golden highlights
  - **Evil (Red)**: Demonic effects, sinister styling, crimson shadows
- **Animated Background**: Floating particles creating an atmospheric battlefield
- **Glowing Effects**: Pieces pulse with magical energy
- **Professional UI**: Modern, polished interface with backdrop blur effects

### 🎯 Realistic Animations
- **Gravity Drop Physics**: Pieces fall with realistic acceleration
- **Bounce Effect**: Satisfying bounce when pieces land
- **Smooth Transitions**: Every interaction feels premium
- **Victory Celebration**: Epic modal with thematic messaging

### ⚡ Arrow Effects System

#### Small Arrows (2 in a row)
When you connect 2 pieces, a small arrow appears between them

#### Medium Arrows (3 in a row)
Three connected pieces show a medium arrow extending through all pieces

#### Victory Arrow (4 in a row) 🏆
The ultimate achievement! When you connect 4 pieces:
- **Epic Arrow Animation**: Large glowing arrow pierces through all 4 pieces
- **Winner Text**: "GOOD WINS!" or "EVIL WINS!" appears along the arrow
- **Particle Effects**: Dramatic glow and shadow effects
- **Victory Modal**: Full-screen celebration of the winner

## 🎮 How to Play

### Starting the Game
1. Open `index.html` in any modern web browser
2. Good (Blue) always goes first
3. Click on any column to drop your piece

### Making Moves
1. **Choose a Column**: Click on any column at the top
2. **Watch It Drop**: Your piece falls with realistic physics
3. **See Connections**: Arrows appear automatically when you connect 2+ pieces
4. **Win the Game**: Connect 4 pieces in any direction

### Winning Conditions
- **Horizontal**: 4 pieces in a row (→)
- **Vertical**: 4 pieces in a column (↓)
- **Diagonal**: 4 pieces diagonally (↗ or ↘)

### Game Controls
- **Click Column**: Drop piece in that column
- **Reset Button**: Start a new game anytime
- **Play Again**: After victory, start fresh

## 📁 File Structure

```
04ConnectFour/
├── index.html      # Game structure and layout
├── styles.css      # Good vs Evil theming and animations
├── script.js       # Game logic and arrow system
└── README.md       # This documentation
```

## 🎨 Theme Design

### Good (Blue) Theme
- **Primary Color**: Light Blue (#2196F3)
- **Glow Color**: Golden (#FFD700)
- **Visual Style**: Angelic, heroic, uplifting
- **Effects**: Smooth pulsing, upward particles
- **Victory Message**: "GOOD TRIUMPHS!" with angel emoji 😇

### Evil (Red) Theme
- **Primary Color**: Dark Red (#D32F2F)
- **Glow Color**: Crimson (#8B0000)
- **Visual Style**: Demonic, sinister, aggressive
- **Effects**: Sharp glows, chaotic particles
- **Victory Message**: "EVIL PREVAILS!" with devil emoji 😈

## 💻 Technical Implementation

### HTML5
- Semantic structure
- SVG overlay for arrow rendering
- Responsive grid layout
- Modal system for victory screens

### CSS3
- **Custom Properties**: Theme variables for easy customization
- **Animations**: 
  - `dropPiece`: Realistic gravity with bounce (cubic-bezier)
  - `glowBlue/Red`: Pulsing glow effects
  - `arrowAppear`: Stroke animation for arrows
  - `victoryArrow`: Epic entrance for winning arrow
- **Gradients**: Radial gradients on pieces for 3D effect
- **Shadows**: Multiple layered shadows for depth

### JavaScript (ES6+)
- **Game State Management**: 7×6 grid tracked in 2D array
- **Win Detection Algorithm**: Checks all 4 directions from last move
- **Connection Detection**: Finds 2+ consecutive pieces
- **Arrow Rendering**: Dynamic SVG line generation
- **Particle System**: Animated background effects
- **Event Handling**: Click listeners for columns and buttons

## 🎯 Arrow Animation System

### How Arrows Work

1. **Detection**: After each move, check all directions from the placed piece
2. **Connection Types**:
   - **2 pieces**: Small arrow (opacity 0.7, stroke-width 6)
   - **3 pieces**: Medium arrow (opacity 0.8, stroke-width 8)
   - **4 pieces**: Victory arrow (opacity 1.0, stroke-width 12)

3. **SVG Rendering**:
   - Calculate center positions of connected pieces
   - Draw line from first to last piece
   - Apply gradient based on player color
   - Animate with stroke-dasharray technique

4. **Victory Sequence**:
   - Draw victory arrow (1s animation)
   - Add glow filter for dramatic effect
   - Display winner text along arrow (0.8s delay)
   - Show victory modal (1.5s delay)

## 📱 Responsive Design

Works beautifully on all devices:

| Device | Cell Size | Layout |
|--------|-----------|--------|
| **Desktop** | 80px | Full board, optimal spacing |
| **Tablet** | 60px | Compact layout |
| **Mobile** | 45px | Touch-optimized, vertical stats |

### Breakpoints
- Desktop: > 768px
- Tablet: 480px - 768px
- Mobile: < 480px

## 🌟 Special Features

### Background Effects
- 50 floating particles
- Random colors (blue/red)
- Infinite float animation
- Creates atmospheric battlefield

### Player Indicator
- Shows current player's color
- Animated piece preview
- Clear text ("Good's Turn" / "Evil's Turn")
- Smooth transitions between turns

### Victory Modal
- Full-screen overlay
- Theme-appropriate messaging
- Animated entrance (scale + fade)
- Play Again button for quick restart

### Score Tracking
- Persistent win counter for both sides
- Highlighted stats with thematic colors
- Survives game resets
- Only resets on page reload

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ **Game Logic**: Win detection algorithms with directional checking
- ✅ **SVG Manipulation**: Dynamic arrow generation and animation
- ✅ **CSS Animations**: Complex keyframe sequences with physics
- ✅ **State Management**: 2D array board representation
- ✅ **Event Handling**: User interactions and game flow
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Theming**: Consistent visual identity across components

## 🚀 Future Enhancements

Potential improvements:
- [ ] AI opponent with difficulty levels
- [ ] Sound effects for piece drops and victories
- [ ] Combo counter for consecutive wins
- [ ] Animation speed settings
- [ ] Custom color themes
- [ ] Replay system
- [ ] Online multiplayer
- [ ] Tournament mode

## 🎮 Keyboard Support (Future)

Planned keyboard controls:
- **1-7 Keys**: Drop piece in column 1-7
- **Left/Right Arrows**: Select column
- **Space/Enter**: Drop piece in selected column
- **R**: Reset game
- **Esc**: Close victory modal

## 🔧 Browser Support

Tested and working on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 📝 Code Quality

- Clean, well-commented code
- Modular JavaScript functions
- Semantic HTML structure
- CSS custom properties for theming
- Consistent naming conventions
- No external dependencies

## 🎨 Design Philosophy

> **Epic Yet Accessible**
> 
> This Connect Four game balances dramatic visual effects with intuitive gameplay. The Good vs Evil theme adds narrative weight to every move, while realistic physics make each piece drop satisfying. Arrow animations provide instant feedback and celebration for strategic planning.

## ⚔️ Good vs Evil Narrative

**The Eternal Struggle**

In this realm, every game represents a battle between light and darkness. Good (Blue) brings hope, justice, and heroism. Evil (Red) wields power, cunning, and dominance. Each piece you place is a soldier in this cosmic war. Each arrow that appears marks a growing force. And when four align, destiny is decided.

Will you champion the forces of Good? Or embrace the power of Evil?

**The choice is yours. The battle begins now.**

---

**Built with 💙❤️ during InternPE Internship**

*May the best force win!* ⚔️
