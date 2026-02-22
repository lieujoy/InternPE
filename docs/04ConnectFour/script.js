// ===================================
// CONNECT FOUR - MAIN GAME CONTROLLER
// Enhanced with AI, Themes, and Settings
// ===================================

// Game State Variables
let gameEngine;
let aiPlayer;
let themeManager;
let soundManager;

let gameMode = "human"; // 'human' or 'ai'
let difficulty = "medium";
let selectedGameMode = "classic"; // 'classic', 'timed', 'custom'
let customBoardSize = { rows: 6, cols: 7 }; // Custom board size
let animating = false;
let isAITurn = false; // Bug 2: explicit flag to hard-block clicks during AI calculation
let wins = {
  pirate: parseInt(localStorage.getItem("cf-wins-pirate") || "0", 10),
  marine: parseInt(localStorage.getItem("cf-wins-marine") || "0", 10),
};
let timer = null;
let timeLeft = 30;

// DOM Elements
const gameBoard = document.getElementById("gameBoard");
const playerIndicator = document.getElementById("playerIndicator");
const resetBtn = document.getElementById("resetBtn");
const victoryModal = document.getElementById("victoryModal");
const victoryTitle = document.getElementById("victoryTitle");
const victoryMessage = document.getElementById("victoryMessage");
const victoryIcon = document.getElementById("victoryIcon");
const playAgainBtn = document.getElementById("playAgainBtn");
const changePlayersBtn = document.getElementById("changePlayersBtn");
const closeVictoryModal = document.getElementById("closeVictoryModal");
const pirateWinsDisplay = document.getElementById("pirateWins");
const marineWinsDisplay = document.getElementById("marineWins");
const turnIconAbove = document.querySelector(".turn-icon-above");
const turnLabel = document.querySelector(".turn-label");

// Startup Modal Elements
const startupModal = document.getElementById("startupModal");
const vsHumanBtn = document.getElementById("vsHumanBtn");
const vsAIBtn = document.getElementById("vsAIBtn");
const difficultySelection = document.getElementById("difficultySelection");
const gameModeSelection = document.getElementById("gameModeSelection");
const backToModeBtn = document.getElementById("backToModeBtn");
const backToDifficultyBtn = document.getElementById("backToDifficultyBtn");
const startGameBtn = document.getElementById("startGameBtn");

// Custom Board Size Elements
const boardSizeSelection = document.getElementById("boardSizeSelection");

// Settings Panel Elements
const settingsToggle = document.getElementById("settingsToggle");
const settingsContent = document.getElementById("settingsContent");
const themeSelector = document.getElementById("themeSelector");
const muteToggle = document.getElementById("muteToggle");
const volumeSlider = document.getElementById("volumeSlider");

// Timer and AI Elements
const timerDisplay = document.getElementById("timerDisplay");
const timerValue = document.getElementById("timerValue");
const aiThinking = document.getElementById("aiThinking");
const hintBtn = document.getElementById("hintBtn");
const aiExplanation = document.getElementById("aiExplanation");
const aiExplanationText = document.getElementById("aiExplanationText");

// ===================================
// INITIALIZATION
// ===================================

function init() {
  // Initialize managers
  gameEngine = new GameEngine();
  aiPlayer = new AIPlayer(difficulty);
  themeManager = new ThemeManager();
  soundManager = new SoundManager();

  // Set up event listeners
  setupEventListeners();

  // Show startup modal
  showStartupModal();
}

function setupEventListeners() {
  // Startup modal
  vsHumanBtn.addEventListener("click", () => {
    gameMode = "human";
    soundManager.playClick();
    showGameModeSelection();
  });

  vsAIBtn.addEventListener("click", () => {
    gameMode = "ai";
    soundManager.playClick();
    showDifficultySelection();
  });

  backToModeBtn.addEventListener("click", () => {
    soundManager.playClick();
    showModeSelection();
  });

  // Difficulty buttons
  document.querySelectorAll(".difficulty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      difficulty = btn.dataset.difficulty;
      aiPlayer.setDifficulty(difficulty);
      soundManager.playClick();

      // Update active state
      document
        .querySelectorAll(".difficulty-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      showGameModeSelection();
    });
  });

  // Game mode buttons
  document.querySelectorAll(".gamemode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedGameMode = btn.dataset.mode;
      soundManager.playClick();

      // Update active state
      document
        .querySelectorAll(".gamemode-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Show/hide custom board size selection
      if (selectedGameMode === "custom") {
        boardSizeSelection.classList.remove("hidden");
      } else {
        boardSizeSelection.classList.add("hidden");
      }
    });
  });

  // Custom board size buttons
  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      customBoardSize.rows = parseInt(btn.dataset.rows);
      customBoardSize.cols = parseInt(btn.dataset.cols);
      soundManager.playClick();

      // Update active state
      document
        .querySelectorAll(".size-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Back button from game mode to difficulty (or mode selection for human vs human)
  if (backToDifficultyBtn) {
    backToDifficultyBtn.addEventListener("click", () => {
      soundManager.playClick();
      if (gameMode === "ai") {
        showDifficultySelection();
      } else {
        showModeSelection();
      }
    });
  }

  // Bottom Back button (added per user request)
  const backToDifficultyBottomBtn = document.getElementById(
    "backToDifficultyBottomBtn",
  );
  if (backToDifficultyBottomBtn) {
    backToDifficultyBottomBtn.addEventListener("click", () => {
      soundManager.playClick();
      if (gameMode === "ai") {
        showDifficultySelection();
      } else {
        showModeSelection();
      }
    });
  }

  startGameBtn.addEventListener("click", () => {
    soundManager.playClick();
    hideStartupModal();
    startGame();
  });

  // Game controls
  resetBtn.addEventListener("click", resetGame);
  playAgainBtn.addEventListener("click", resetGame);
  changePlayersBtn.addEventListener("click", () => {
    soundManager.playClick();
    showStartupModal();
    victoryModal.classList.remove("show");
  });
  closeVictoryModal.addEventListener("click", () => {
    soundManager.playClick();
    showStartupModal();
    victoryModal.classList.remove("show");
  });

  // Settings panel
  settingsToggle.addEventListener("click", toggleSettings);

  // Settings close button
  const settingsCloseBtn = document.getElementById("settingsCloseBtn");
  if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener("click", () => {
      settingsContent.classList.add("hidden");
      clearTimeout(settingsTimeout);
    });
  }

  themeSelector.addEventListener("change", (e) => {
    const theme = e.target.value;
    themeManager.setTheme(theme);
    soundManager.playClick();
    updateThemeUI();

    // Sync the carousel active state when dropdown is used
    syncCarouselToTheme(theme);

    // Bug 3 fix: do NOT reset selectedGameMode or customBoardSize when only the theme changes.
    // Only restart the game with the current board configuration.
    startGame();
  });

  // Theme preview carousel — clicking a card applies & previews the theme live
  const themeCarousel = document.getElementById("themeCarousel");
  if (themeCarousel) {
    themeCarousel.addEventListener("click", (e) => {
      const card = e.target.closest(".theme-card");
      if (!card) return;

      const themeName = card.dataset.theme;
      if (!themeName) return;

      soundManager.playClick();

      // Apply theme immediately (live preview)
      themeManager.setTheme(themeName);
      updateThemeUI();

      // Sync the hidden settings dropdown
      themeSelector.value = themeName;

      // Update active card
      themeCarousel
        .querySelectorAll(".theme-card")
        .forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
    });
  }

  muteToggle.addEventListener("click", () => {
    const isMuted = soundManager.toggleMute();
    muteToggle.textContent = isMuted ? "🔇 Off" : "🔊 On";
    soundManager.playClick();
  });

  volumeSlider.addEventListener("input", (e) => {
    soundManager.setVolume(e.target.value / 100);
  });

  // Hint button — computes and highlights the best column for the current player
  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      if (!gameEngine || !gameEngine.gameActive || animating || isAITurn)
        return;
      soundManager.playClick();
      showHint();
    });
  }
}

// ===================================
// STARTUP MODAL FUNCTIONS
// ===================================

function showStartupModal() {
  startupModal.classList.add("show");
  showModeSelection();
  // Pre-select the saved theme in the carousel
  const saved = localStorage.getItem("connectfour-theme") || "onePiece";
  syncCarouselToTheme(saved);
}

// Sync the carousel's active card to a given theme name
function syncCarouselToTheme(themeName) {
  const carousel = document.getElementById("themeCarousel");
  if (!carousel) return;
  carousel.querySelectorAll(".theme-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.theme === themeName);
  });
  // Scroll the active card into view
  const active = carousel.querySelector(".theme-card.active");
  if (active)
    active.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
}

function hideStartupModal() {
  startupModal.classList.remove("show");
}

function showModeSelection() {
  document.querySelector(".mode-selection").classList.remove("hidden");
  difficultySelection.classList.add("hidden");
  gameModeSelection.classList.add("hidden");
}

function showDifficultySelection() {
  document.querySelector(".mode-selection").classList.add("hidden");
  difficultySelection.classList.remove("hidden");
  gameModeSelection.classList.add("hidden");
}

function showGameModeSelection() {
  document.querySelector(".mode-selection").classList.add("hidden");
  if (gameMode === "ai") {
    difficultySelection.classList.add("hidden");
  }
  gameModeSelection.classList.remove("hidden");
}

// ===================================
// GAME CONTROL FUNCTIONS
// ===================================

function startGame() {
  // Determine board size based on game mode
  let rows, cols;
  if (selectedGameMode === "custom") {
    rows = customBoardSize.rows;
    cols = customBoardSize.cols;
  } else {
    rows = 6;
    cols = 7;
  }

  // Reinitialize game engine with correct board size
  gameEngine = new GameEngine(rows, cols);

  animating = false;
  isAITurn = false;

  // Bug 5: Clear previous win line from SVG overlay
  const svg = document.getElementById("arrowOverlay");
  if (svg) {
    svg.querySelectorAll(".arrow-line").forEach((el) => el.remove());
  }

  createBoard();
  updatePlayerIndicator();
  updateWinsDisplay();
  updateThemeUI();

  // Set initial theme
  document.body.classList.add("pirate-theme");
  document.body.classList.remove("marine-theme");

  // Setup timed mode if selected
  if (selectedGameMode === "timed") {
    timerDisplay.classList.remove("hidden");
    startTimer();
  } else {
    timerDisplay.classList.add("hidden");
  }

  // Initialize sound manager
  soundManager.init();

  // Show/hide hint button based on game mode (only relevant in AI games)
  if (hintBtn) {
    if (gameMode === "ai") {
      hintBtn.classList.remove("hidden");
    } else {
      hintBtn.classList.add("hidden");
    }
  }
}

function resetGame() {
  // If a game is actively in progress, confirm before resetting
  const movesMade =
    gameEngine && gameEngine.moveHistory && gameEngine.moveHistory.length > 0;
  if (movesMade && gameEngine.gameActive) {
    const confirmed = window.confirm(
      "⟳ Reset this game? Current progress will be lost.",
    );
    if (!confirmed) return;
  }
  soundManager.playClick();
  victoryModal.classList.remove("show");
  startGame();
}

function createBoard() {
  gameBoard.innerHTML = "";

  // Calculate responsive cell size so board always fits the viewport.
  // Available height accounts for header, controls (≈260px) and body padding.
  // Available width accounts for side panels (≈600px) and body padding.
  const availableHeight = window.innerHeight - 320;
  const availableWidth = Math.min(window.innerWidth - 40, 760);
  const gap = 10;
  const boardPad = 36; // 18px padding × 2

  const maxCellByHeight = Math.floor(
    (availableHeight - boardPad - gap * (gameEngine.ROWS - 1)) /
      gameEngine.ROWS,
  );
  const maxCellByWidth = Math.floor(
    (availableWidth - boardPad - gap * (gameEngine.COLS - 1)) / gameEngine.COLS,
  );

  // Pick the smaller constraint, cap at 70px (default), floor at 44px
  const cellSize = Math.max(44, Math.min(70, maxCellByHeight, maxCellByWidth));
  const pieceSize = Math.round(cellSize * 0.88);

  // Apply to CSS custom properties so all piece/cell styles inherit correctly
  document.documentElement.style.setProperty("--cell-size", `${cellSize}px`);
  document.documentElement.style.setProperty("--piece-size", `${pieceSize}px`);

  // Set explicit grid dimensions
  gameBoard.style.gridTemplateColumns = `repeat(${gameEngine.COLS}, var(--cell-size))`;
  gameBoard.style.gridTemplateRows = `repeat(${gameEngine.ROWS}, var(--cell-size))`;

  for (let row = 0; row < gameEngine.ROWS; row++) {
    for (let col = 0; col < gameEngine.COLS; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", () => handleCellClick(row, col));
      cell.addEventListener("mouseenter", () => {
        if (!animating && gameEngine.gameActive) {
          soundManager.playHover();
        }
      });
      gameBoard.appendChild(cell);
    }
  }
}

// ===================================
// GAME LOGIC
// ===================================

async function handleCellClick(clickedRow, col) {
  // Block all input while AI is thinking or animation is playing
  if (isAITurn || animating) return;

  // Block if game is over or cell is already occupied
  if (!gameEngine.gameActive || !gameEngine.isValidMove(clickedRow, col))
    return;

  // In AI mode, human only plays as pirate (player 1)
  if (gameMode === "ai" && gameEngine.currentPlayer !== "pirate") return;

  // Lock and execute human move
  animating = true;
  await makeMove(clickedRow, col, gameEngine.currentPlayer);

  // After human move resolves, fire AI if it's now the AI's turn
  if (
    gameMode === "ai" &&
    gameEngine.gameActive &&
    gameEngine.currentPlayer === "marine"
  ) {
    await makeAIMove();
  }
}

function makeMove(row, col, player) {
  return new Promise((resolve) => {
    try {
      // In timed mode, stop clock while placing
      if (selectedGameMode === "timed") stopTimer();

      // Register move in engine
      const moved = gameEngine.makeMove(row, col, player);
      if (!moved) {
        // Engine rejected the move (invalid) — release lock immediately
        animating = false;
        resolve();
        return;
      }

      // Sound & render
      try {
        soundManager.playPieceDrop();
      } catch (e) {
        /* ignore sound errors */
      }

      // Render the piece in the correct cell
      const cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"].cell`,
      );
      if (cell) {
        cell.classList.add("filled");
        try {
          animatePiecePlacement(row, col, player);
        } catch (e) {
          /* ignore animation errors */
        }
      }

      // After animation delay, check win/draw and switch turns
      // CRITICAL: wrapped in try-catch so resolve() ALWAYS fires.
      // If this ever throws (e.g. handleWin, updatePlayerIndicator),
      // the Promise hangs forever and isAITurn stays true, locking the game.
      setTimeout(() => {
        try {
          const winInfo = gameEngine.checkWin(row, col);

          if (winInfo) {
            handleWin(winInfo);
            animating = false;
            resolve();
            return;
          }

          if (gameEngine.isBoardFull()) {
            handleDraw();
            animating = false;
            resolve();
            return;
          }

          // Switch to next player and unlock
          gameEngine.switchPlayer();
          updatePlayerIndicator();
          animating = false;

          if (selectedGameMode === "timed") startTimer();
        } catch (e) {
          animating = false; // Always release even on internal error
        } finally {
          resolve(); // ALWAYS call resolve — never leave Promise hanging
        }
      }, 200);
    } catch (e) {
      // Outer guard: if anything before setTimeout throws, still resolve
      animating = false;
      resolve();
    }
  });
}

async function makeAIMove() {
  // Guard: only proceed if it's genuinely the AI's turn
  if (
    !gameEngine.gameActive ||
    gameEngine.currentPlayer !== "marine" ||
    isAITurn
  ) {
    return;
  }

  isAITurn = true;
  animating = true;
  aiThinking.classList.remove("hidden");
  document.body.style.cursor = "wait";

  try {
    const move = await aiPlayer.makeMove(gameEngine, "marine", true);

    if (move && typeof move.row === "number" && typeof move.col === "number") {
      await makeMove(move.row, move.col, "marine");

      const explanation = aiPlayer.lastMoveExplanation;
      if (explanation) showAIExplanation(explanation);
    }
    // If no valid move returned, the board must be full — game ends naturally
  } catch (err) {
    // Swallow error silently in production
  } finally {
    // ALWAYS release locks — even on error
    aiThinking.classList.add("hidden");
    document.body.style.cursor = "";
    isAITurn = false;
    animating = false;
  }
}

/**
 * Show the best column for the current player as a glowing column highlight.
 * Clears after 2 seconds automatically.
 */
function showHint() {
  if (!aiPlayer || !gameEngine.gameActive) return;

  // Temporarily disable hint button to prevent spam
  hintBtn.disabled = true;
  hintBtn.textContent = "💡 Thinking...";

  // Use a web-worker-free async approach — run hint calculation slightly deferred
  setTimeout(() => {
    const hint = aiPlayer.getHint(gameEngine, gameEngine.currentPlayer);
    if (hint && hint.col !== null) {
      // Highlight all cells in the hint column
      const hintCells = document.querySelectorAll(
        `[data-col="${hint.col}"].cell:not(.filled)`,
      );
      hintCells.forEach((cell) => cell.classList.add("hint-highlight"));

      // Also highlight the lowest empty row in that column (where piece would land)
      const targetRow = gameEngine.getLowestEmptyRow(hint.col);
      if (targetRow !== -1) {
        const targetCell = document.querySelector(
          `[data-row="${targetRow}"][data-col="${hint.col}"].cell`,
        );
        if (targetCell) targetCell.classList.add("hint-landing");
      }

      // Auto-clear after 2 seconds
      setTimeout(() => {
        document
          .querySelectorAll(".hint-highlight, .hint-landing")
          .forEach((el) => {
            el.classList.remove("hint-highlight", "hint-landing");
          });
        hintBtn.disabled = false;
        hintBtn.textContent = "💡 Hint";
      }, 2000);
    } else {
      hintBtn.disabled = false;
      hintBtn.textContent = "💡 Hint";
    }
  }, 50);
}

/** Show an AI explanation toast for Easy mode */
let explanationTimer = null;
function showAIExplanation(text) {
  if (!aiExplanation || !aiExplanationText) return;

  aiExplanationText.textContent = text;
  aiExplanation.classList.remove("hidden", "fade-out");
  aiExplanation.classList.add("show");

  clearTimeout(explanationTimer);
  explanationTimer = setTimeout(() => {
    aiExplanation.classList.add("fade-out");
    setTimeout(() => {
      aiExplanation.classList.remove("show", "fade-out");
      aiExplanation.classList.add("hidden");
    }, 400);
  }, 3000);
}

function animatePiecePlacement(row, col, player) {
  const cell = document.querySelector(
    `[data-row="${row}"][data-col="${col}"].cell`,
  );

  if (cell) {
    const piece = document.createElement("div");
    piece.className = `piece ${player}`;

    // Add theme-aware icon to the piece
    const icon = document.createElement("span");
    icon.className = "piece-icon";
    icon.textContent = themeManager.getPieceIcon(player);
    piece.appendChild(icon);

    cell.appendChild(piece);
    piece.style.transform = "translateY(0%)"; // Force final state immediately

    setTimeout(() => {
      createLandingParticles(cell, player);
    }, 50); // Faster particles since there's no drop delay
  }
}

function createLandingParticles(cell, player) {
  const rect = cell.getBoundingClientRect();
  const boardRect = gameBoard.getBoundingClientRect();
  const particleCount = 8;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = "5px";
    particle.style.height = "5px";
    particle.style.borderRadius = "50%";
    particle.style.background =
      player === "pirate" ? "var(--pirate-primary)" : "var(--marine-primary)";
    particle.style.boxShadow =
      player === "pirate"
        ? "0 0 12px var(--pirate-shadow)"
        : "0 0 12px var(--marine-shadow)";
    particle.style.left = rect.left - boardRect.left + rect.width / 2 + "px";
    particle.style.top = rect.top - boardRect.top + rect.height / 2 + "px";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "15";

    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 35;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    particle.style.animation = `particleBurst 0.6s ease-out forwards`;
    particle.style.setProperty("--vx", vx + "px");
    particle.style.setProperty("--vy", vy + "px");

    gameBoard.appendChild(particle);

    setTimeout(() => particle.remove(), 600);
  }
}

// ===================================
// WIN/DRAW HANDLING
// ===================================

function handleWin(winInfo) {
  gameEngine.gameActive = false;
  wins[gameEngine.currentPlayer]++;
  updateWinsDisplay();
  soundManager.playWin();

  // Stop timer if in timed mode
  if (selectedGameMode === "timed") {
    stopTimer();
  }

  // Draw SVG win line through winning cells (Bug 5: Math.round fixes diagonal offset)
  drawWinLine(winInfo);

  // Show victory animation
  showThemedVictoryAnimation();

  // Show victory modal after animation
  setTimeout(() => {
    showVictoryModal();
    animating = false;
  }, 2000);
}

/**
 * Bug 5 Fix: Draw the SVG win line between the first and last winning cell.
 * All coordinates are Math.round()-ed to avoid sub-pixel accumulation that
 * causes diagonal arrows to appear offset by 1px.
 */
function drawWinLine(winInfo) {
  const svg = document.getElementById("arrowOverlay");
  if (!svg || !winInfo || !winInfo.positions || winInfo.positions.length < 2)
    return;

  const boardRect = gameBoard.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  // Get the first and last winning cell elements
  const first = winInfo.positions[0];
  const last = winInfo.positions[winInfo.positions.length - 1];

  const c1 = document.querySelector(
    `[data-row="${first[0]}"][data-col="${first[1]}"].cell`,
  );
  const c2 = document.querySelector(
    `[data-row="${last[0]}"][data-col="${last[1]}"].cell`,
  );
  if (!c1 || !c2) return;

  const r1 = c1.getBoundingClientRect();
  const r2 = c2.getBoundingClientRect();

  // Math.round ensures integer pixel positions — eliminates diagonal 1px drift
  const x1 = Math.round(r1.left - svgRect.left + r1.width / 2);
  const y1 = Math.round(r1.top - svgRect.top + r1.height / 2);
  const x2 = Math.round(r2.left - svgRect.left + r2.width / 2);
  const y2 = Math.round(r2.top - svgRect.top + r2.height / 2);

  const player = winInfo.player;
  const color =
    player === "pirate"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--pirate-primary")
          .trim()
      : getComputedStyle(document.documentElement)
          .getPropertyValue("--marine-primary")
          .trim();

  // Create the win line
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", color || "#FFD700");
  line.setAttribute("stroke-width", "6");
  line.setAttribute("stroke-linecap", "round");
  line.setAttribute("class", "arrow-line victory");
  line.setAttribute("filter", "url(#glow)");

  svg.appendChild(line);

  // Highlight each winning cell
  winInfo.positions.forEach(([r, c]) => {
    const cell = document.querySelector(
      `[data-row="${r}"][data-col="${c}"].cell`,
    );
    if (cell) cell.classList.add("win-cell");
  });
}

function handleDraw() {
  gameEngine.gameActive = false;
  animating = false;
  soundManager.playError();

  // Stop timer if in timed mode
  if (selectedGameMode === "timed") {
    stopTimer();
  }

  const theme = themeManager.getCurrentTheme();
  victoryTitle.textContent = "DRAW!";
  victoryTitle.className = "victory-title";
  victoryMessage.textContent = theme.drawMessage || "It's a draw!";
  victoryIcon.textContent = "⚖️";
  victoryModal.classList.add("show");
}

function showVictoryModal() {
  const theme = themeManager.getCurrentTheme();

  if (gameEngine.currentPlayer === "pirate") {
    victoryTitle.textContent = `${theme.pirateName.toUpperCase()} WIN!`;
    victoryTitle.className = "victory-title pirate";
    victoryMessage.textContent = theme.winMessage; // Removed fallback to force use of theme message
    victoryIcon.textContent = theme.pirateIcon;
  } else {
    victoryTitle.textContent = `${theme.marineName.toUpperCase()} WIN!`;
    victoryTitle.className = "victory-title marine";
    // If AI mode, displaying 'Lose' message for player. If PvP, generic victory.
    if (gameMode === "ai") {
      victoryMessage.textContent = theme.loseMessage; // Removed fallback
    } else {
      victoryMessage.textContent = `${theme.marineName} Victory!`;
    }
    victoryIcon.textContent = theme.marineIcon;
  }

  victoryModal.classList.add("show");
}

function showThemedVictoryAnimation() {
  const overlay = document.createElement("div");
  overlay.className = "victory-animation-overlay";
  overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.3);
    `;

  const theme = themeManager.getCurrentTheme();
  const icon =
    gameEngine.currentPlayer === "pirate" ? theme.pirateIcon : theme.marineIcon;
  const animName =
    gameEngine.currentPlayer === "pirate"
      ? "victoryAnimPirate"
      : "victoryAnimMarine";

  overlay.innerHTML = `
        <div style="
            font-size: 20rem;
            animation: ${animName} 2s cubic-bezier(0.34, 1.56, 0.64, 1);
            filter: drop-shadow(0 0 80px var(--${gameEngine.currentPlayer}-primary)) 
                    drop-shadow(0 0 120px var(--${gameEngine.currentPlayer}-primary));
        ">${icon}</div>
        <style>
            @keyframes ${animName} {
                0% {
                    transform: scale(0) rotate(-180deg);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.3) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(1.1) rotate(10deg);
                    opacity: 0.3;
                }
            }
        </style>
    `;

  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 2000);
}

// ===================================
// UI UPDATE FUNCTIONS
// ===================================

function updatePlayerIndicator() {
  const theme = themeManager.getCurrentTheme();
  const player1Name = themeManager.getPlayerName("pirate");
  const player2Name = themeManager.getPlayerName("marine");

  if (gameEngine.currentPlayer === "pirate") {
    playerIndicator.classList.remove("marine");
    playerIndicator.classList.add("pirate");

    turnIconAbove.textContent = theme.pirateIcon;
    turnLabel.textContent = `${player1Name.toUpperCase()}'S TURN`;

    document.body.classList.remove("marine-theme");
    document.body.classList.add("pirate-theme");
  } else {
    playerIndicator.classList.remove("pirate");
    playerIndicator.classList.add("marine");

    turnIconAbove.textContent = theme.marineIcon;
    turnLabel.textContent = `${player2Name.toUpperCase()}'S TURN`;

    document.body.classList.remove("pirate-theme");
    document.body.classList.add("marine-theme");
  }
}

function updateWinsDisplay() {
  pirateWinsDisplay.textContent = wins.pirate;
  marineWinsDisplay.textContent = wins.marine;
  // Persist wins across page refresh
  localStorage.setItem("cf-wins-pirate", wins.pirate);
  localStorage.setItem("cf-wins-marine", wins.marine);
}

function updateThemeUI() {
  const theme = themeManager.getCurrentTheme();

  // Get custom player names or use theme defaults
  const player1Name = themeManager.getPlayerName("pirate");
  const player2Name = themeManager.getPlayerName("marine");

  // Update title text
  document.querySelector(".pirate-text").textContent =
    player1Name.toUpperCase();
  document.querySelector(".marine-text").textContent =
    player2Name.toUpperCase();

  // Update title icons (above the team names)
  const pirateTitleIcon = document.querySelector(".title-pirate .title-icon");
  const marineTitleIcon = document.querySelector(".title-marine .title-icon");
  if (pirateTitleIcon) pirateTitleIcon.textContent = theme.pirateIcon;
  if (marineTitleIcon) marineTitleIcon.textContent = theme.marineIcon;

  // Update VS divider icons
  const iconRoger = document.querySelector(".icon-roger");
  const iconAdmiral = document.querySelector(".icon-admiral");
  const vsDivider = document.querySelector(".vs-divider");

  if (iconRoger) iconRoger.textContent = theme.pirateIcon;
  if (iconAdmiral) iconAdmiral.textContent = theme.marineIcon;
  if (vsDivider && theme.vsIcon) vsDivider.textContent = theme.vsIcon;

  // Update stats labels
  document.querySelector(".pirate-stat .stat-label").innerHTML =
    `<span class="theme-icon">${theme.pirateIcon}</span> ${player1Name} Wins`;
  document.querySelector(".marine-stat .stat-label").innerHTML =
    `<span class="theme-icon">${theme.marineIcon}</span> ${player2Name} Wins`;

  // Update game subtitle
  const subtitleElement = document.querySelector(".game-subtitle");
  if (subtitleElement && theme.subtitle) {
    subtitleElement.textContent = theme.subtitle;
  }

  // Update player indicator
  updatePlayerIndicator();
}

// Settings Auto-hide Timer
let settingsTimeout;

function resetSettingsTimer() {
  clearTimeout(settingsTimeout);
  if (!settingsContent.classList.contains("hidden")) {
    settingsTimeout = setTimeout(() => {
      settingsContent.classList.add("hidden");
    }, 15000); // 15 seconds
  }
}

function toggleSettings() {
  soundManager.playClick();
  settingsContent.classList.toggle("hidden");
  resetSettingsTimer();
}

// Add interaction listeners to settings panel to keep it open while active
if (typeof settingsContent !== "undefined") {
  settingsContent.addEventListener("mousemove", resetSettingsTimer);
  settingsContent.addEventListener("click", resetSettingsTimer);
  settingsContent.addEventListener("touchstart", resetSettingsTimer);
}

// ===================================
// TIMER FUNCTIONS (for timed mode)
// ===================================

function startTimer() {
  timeLeft = 30;
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 5) {
      timerDisplay.classList.add("warning");
    }

    if (timeLeft <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  timerDisplay.classList.remove("warning");
}

function updateTimerDisplay() {
  // Bug 1 fix: clamp to 0 so display never shows negative numbers
  timerValue.textContent = Math.max(0, timeLeft);
}

function handleTimeout() {
  soundManager.playError();

  // Switch to other player - current player loses their turn
  gameEngine.switchPlayer();
  updatePlayerIndicator();

  // Start timer for next player
  startTimer();

  // If AI's turn now, make AI move
  if (gameMode === "ai" && gameEngine.currentPlayer === "marine") {
    makeAIMove();
  }
}

// ===================================
// BACKGROUND PARTICLES
// ===================================

function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 70;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    const isPirate = Math.random() > 0.5;

    particle.style.position = "absolute";
    particle.style.width = Math.random() * 5 + 2 + "px";
    particle.style.height = particle.style.width;
    particle.style.borderRadius = "50%";
    particle.style.background = isPirate
      ? "rgba(220, 20, 60, 0.4)"
      : "rgba(30, 64, 175, 0.4)";
    particle.style.boxShadow = isPirate
      ? "0 0 12px rgba(255, 215, 0, 0.6)"
      : "0 0 12px rgba(147, 197, 253, 0.6)";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animation = `float ${Math.random() * 15 + 10}s linear infinite`;
    particle.style.animationDelay = Math.random() * 8 + "s";

    particlesContainer.appendChild(particle);
  }
}

// ===================================
// INITIALIZE ON PAGE LOAD
// ===================================

window.addEventListener("DOMContentLoaded", () => {
  init();
  createParticles();
});

// Add necessary animations
const style = document.createElement("style");
style.textContent = `
    @keyframes particleBurst {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--vx), var(--vy)) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-120vh) translateX(${Math.random() * 80 - 40}px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
