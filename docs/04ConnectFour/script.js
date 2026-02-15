// ===================================
// CONNECT FOUR - MAIN GAME CONTROLLER
// Enhanced with AI, Themes, and Settings
// ===================================

// Game State Variables
let gameEngine;
let aiPlayer;
let themeManager;
let soundManager;

let gameMode = 'human'; // 'human' or 'ai'
let difficulty = 'medium';
let selectedGameMode = 'classic'; // 'classic', 'timed', 'custom'
let customBoardSize = { rows: 6, cols: 7 }; // Custom board size
let animating = false;
let wins = { pirate: 0, marine: 0 };
let timer = null;
let timeLeft = 30;

// DOM Elements
const gameBoard = document.getElementById('gameBoard');
const playerIndicator = document.getElementById('playerIndicator');
const resetBtn = document.getElementById('resetBtn');
const victoryModal = document.getElementById('victoryModal');
const victoryTitle = document.getElementById('victoryTitle');
const victoryMessage = document.getElementById('victoryMessage');
const victoryIcon = document.getElementById('victoryIcon');
const playAgainBtn = document.getElementById('playAgainBtn');
const changePlayersBtn = document.getElementById('changePlayersBtn');
const closeVictoryModal = document.getElementById('closeVictoryModal');
const pirateWinsDisplay = document.getElementById('pirateWins');
const marineWinsDisplay = document.getElementById('marineWins');
const turnIconAbove = document.querySelector('.turn-icon-above');
const turnLabel = document.querySelector('.turn-label');

// Startup Modal Elements
const startupModal = document.getElementById('startupModal');
const vsHumanBtn = document.getElementById('vsHumanBtn');
const vsAIBtn = document.getElementById('vsAIBtn');
const difficultySelection = document.getElementById('difficultySelection');
const gameModeSelection = document.getElementById('gameModeSelection');
const backToModeBtn = document.getElementById('backToModeBtn');
const backToDifficultyBtn = document.getElementById('backToDifficultyBtn');
const startGameBtn = document.getElementById('startGameBtn');

// Custom Board Size Elements
const boardSizeSelection = document.getElementById('boardSizeSelection');

// Settings Panel Elements
const settingsToggle = document.getElementById('settingsToggle');
const settingsContent = document.getElementById('settingsContent');
const themeSelector = document.getElementById('themeSelector');
const muteToggle = document.getElementById('muteToggle');
const volumeSlider = document.getElementById('volumeSlider');





// Timer and AI Elements
const timerDisplay = document.getElementById('timerDisplay');
const timerValue = document.getElementById('timerValue');
const aiThinking = document.getElementById('aiThinking');

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
    vsHumanBtn.addEventListener('click', () => {
        gameMode = 'human';
        soundManager.playClick();
        showGameModeSelection();
    });

    vsAIBtn.addEventListener('click', () => {
        gameMode = 'ai';
        soundManager.playClick();
        showDifficultySelection();
    });

    backToModeBtn.addEventListener('click', () => {
        soundManager.playClick();
        showModeSelection();
    });

    // Difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            difficulty = btn.dataset.difficulty;
            aiPlayer.setDifficulty(difficulty);
            soundManager.playClick();

            // Update active state
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            showGameModeSelection();
        });
    });

    // Game mode buttons
    document.querySelectorAll('.gamemode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedGameMode = btn.dataset.mode;
            soundManager.playClick();

            // Update active state
            document.querySelectorAll('.gamemode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show/hide custom board size selection
            if (selectedGameMode === 'custom') {
                boardSizeSelection.classList.remove('hidden');
            } else {
                boardSizeSelection.classList.add('hidden');
            }
        });
    });

    // Custom board size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            customBoardSize.rows = parseInt(btn.dataset.rows);
            customBoardSize.cols = parseInt(btn.dataset.cols);
            soundManager.playClick();

            // Update active state
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Back button from game mode to difficulty (or mode selection for human vs human)
    if (backToDifficultyBtn) {
        backToDifficultyBtn.addEventListener('click', () => {
            soundManager.playClick();
            if (gameMode === 'ai') {
                showDifficultySelection();
            } else {
                showModeSelection();
            }
        });
    }

    startGameBtn.addEventListener('click', () => {
        soundManager.playClick();
        hideStartupModal();
        startGame();
    });

    // Game controls
    resetBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', resetGame);
    changePlayersBtn.addEventListener('click', () => {
        soundManager.playClick();
        showStartupModal();
        victoryModal.classList.remove('show');
    });
    closeVictoryModal.addEventListener('click', () => {
        soundManager.playClick();
        showStartupModal();
        victoryModal.classList.remove('show');
    });

    // Settings panel
    settingsToggle.addEventListener('click', toggleSettings);

    themeSelector.addEventListener('change', (e) => {
        const theme = e.target.value;
        themeManager.setTheme(theme);
        soundManager.playClick();
        updateThemeUI();

        // Reset board to default settings when theme changes
        selectedGameMode = 'classic';
        customBoardSize = { rows: 6, cols: 7 };
        startGame();
    });



    muteToggle.addEventListener('click', () => {
        const isMuted = soundManager.toggleMute();
        muteToggle.textContent = isMuted ? '🔇 Off' : '🔊 On';
        soundManager.playClick();
    });

    volumeSlider.addEventListener('input', (e) => {
        soundManager.setVolume(e.target.value / 100);
    });
}

// ===================================
// STARTUP MODAL FUNCTIONS
// ===================================

function showStartupModal() {
    startupModal.classList.add('show');
    showModeSelection();
}

function hideStartupModal() {
    startupModal.classList.remove('show');
}

function showModeSelection() {
    document.querySelector('.mode-selection').classList.remove('hidden');
    difficultySelection.classList.add('hidden');
    gameModeSelection.classList.add('hidden');
}

function showDifficultySelection() {
    document.querySelector('.mode-selection').classList.add('hidden');
    difficultySelection.classList.remove('hidden');
    gameModeSelection.classList.add('hidden');
}

function showGameModeSelection() {
    document.querySelector('.mode-selection').classList.add('hidden');
    if (gameMode === 'ai') {
        difficultySelection.classList.add('hidden');
    }
    gameModeSelection.classList.remove('hidden');
}

// ===================================
// GAME CONTROL FUNCTIONS
// ===================================

function startGame() {
    // Determine board size based on game mode
    let rows, cols;
    if (selectedGameMode === 'custom') {
        rows = customBoardSize.rows;
        cols = customBoardSize.cols;
    } else {
        rows = 6;
        cols = 7;
    }

    // Reinitialize game engine with correct board size
    gameEngine = new GameEngine(rows, cols);

    animating = false;
    createBoard();
    updatePlayerIndicator();
    updateWinsDisplay();
    updateThemeUI();

    // Set initial theme
    document.body.classList.add('pirate-theme');
    document.body.classList.remove('marine-theme');

    // Setup timed mode if selected
    if (selectedGameMode === 'timed') {
        timerDisplay.classList.remove('hidden');
        startTimer();
    } else {
        timerDisplay.classList.add('hidden');
    }

    // Initialize sound manager
    soundManager.init();
}

function resetGame() {
    soundManager.playClick();
    victoryModal.classList.remove('show');
    startGame();
}

function createBoard() {
    gameBoard.innerHTML = '';

    for (let row = 0; row < gameEngine.ROWS; row++) {
        for (let col = 0; col < gameEngine.COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => handleCellClick(row, col));
            cell.addEventListener('mouseenter', () => {
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

async function handleCellClick(row, col) {
    // Prevent clicks during animation, if game is over, or if AI is thinking
    if (!gameEngine.gameActive || animating || !gameEngine.isValidMove(row, col)) {
        return;
    }

    // If it's AI's turn in AI mode, ignore human clicks
    if (gameMode === 'ai' && gameEngine.currentPlayer === 'marine') {
        return;
    }

    animating = true;
    await makeMove(row, col, gameEngine.currentPlayer);
}

async function makeMove(row, col, player) {
    // Stop timer if in timed mode
    if (selectedGameMode === 'timed') {
        stopTimer();
    }

    // Make the move
    gameEngine.makeMove(row, col, player);
    soundManager.playPieceDrop();

    // Update UI
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"].cell`);
    if (cell) {
        cell.classList.add('filled');
        animatePiecePlacement(row, col, player);
    }

    // Check for win after animation
    setTimeout(async () => {
        const winInfo = gameEngine.checkWin(row, col);

        if (winInfo) {
            handleWin(winInfo);
        } else if (gameEngine.isBoardFull()) {
            handleDraw();
        } else {
            gameEngine.switchPlayer();
            updatePlayerIndicator();
            animating = false;

            // Start timer for next player if in timed mode
            if (selectedGameMode === 'timed') {
                startTimer();
            }

            // Trigger AI move if it's AI's turn
            if (gameMode === 'ai' && gameEngine.currentPlayer === 'marine') {
                await makeAIMove();
            }
        }
    }, 400);
}

async function makeAIMove() {
    if (!gameEngine.gameActive) return;

    animating = true;
    aiThinking.classList.remove('hidden');

    try {
        // Get AI's best move (with thinking time)
        const move = await aiPlayer.makeMove(gameEngine, 'marine', true);

        aiThinking.classList.add('hidden');

        if (move && move.row !== null && move.col !== null) {
            await makeMove(move.row, move.col, 'marine');
        }
    } catch (error) {
        console.error('AI move error:', error);
        animating = false;
        aiThinking.classList.add('hidden');
    }
}

function animatePiecePlacement(row, col, player) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"].cell`);

    if (cell) {
        const piece = document.createElement('div');
        piece.className = `piece ${player}`;

        // Add theme-aware icon to the piece
        const icon = document.createElement('span');
        icon.className = 'piece-icon';
        icon.textContent = themeManager.getPieceIcon(player);
        piece.appendChild(icon);

        cell.appendChild(piece);

        setTimeout(() => {
            createLandingParticles(cell, player);
        }, 150);
    }
}

function createLandingParticles(cell, player) {
    const rect = cell.getBoundingClientRect();
    const boardRect = gameBoard.getBoundingClientRect();
    const particleCount = 8;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.borderRadius = '50%';
        particle.style.background = player === 'pirate' ? 'var(--pirate-primary)' : 'var(--marine-primary)';
        particle.style.boxShadow = player === 'pirate' ?
            '0 0 12px var(--pirate-shadow)' : '0 0 12px var(--marine-shadow)';
        particle.style.left = (rect.left - boardRect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top - boardRect.top + rect.height / 2) + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '15';

        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 35;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        particle.style.animation = `particleBurst 0.6s ease-out forwards`;
        particle.style.setProperty('--vx', vx + 'px');
        particle.style.setProperty('--vy', vy + 'px');

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
    if (selectedGameMode === 'timed') {
        stopTimer();
    }

    // Show victory animation
    showThemedVictoryAnimation();

    // Show victory modal after animation
    setTimeout(() => {
        showVictoryModal();
        animating = false;
    }, 2000);
}

function handleDraw() {
    gameEngine.gameActive = false;
    animating = false;
    soundManager.playError();

    // Stop timer if in timed mode
    if (selectedGameMode === 'timed') {
        stopTimer();
    }

    victoryTitle.textContent = "DRAW!";
    victoryTitle.className = 'victory-title';
    victoryMessage.textContent = "The Grand Line battle ends in a stalemate!";
    victoryIcon.textContent = "⚖️";
    victoryModal.classList.add('show');
}

function showVictoryModal() {
    const theme = themeManager.getCurrentTheme();

    if (gameEngine.currentPlayer === 'pirate') {
        victoryTitle.textContent = `${theme.pirateName.toUpperCase()} WIN!`;
        victoryTitle.className = 'victory-title pirate';
        victoryMessage.textContent = gameMode === 'ai'
            ? "Victory against the AI! You're the champion!"
            : "We're gonna be King of the Pirates!";
        victoryIcon.textContent = theme.pirateIcon;
    } else {
        victoryTitle.textContent = `${theme.marineName.toUpperCase()} WIN!`;
        victoryTitle.className = 'victory-title marine';
        victoryMessage.textContent = gameMode === 'ai'
            ? "AI wins! Better luck next time!"
            : "Justice prevails! Absolute Justice!";
        victoryIcon.textContent = theme.marineIcon;
    }

    victoryModal.classList.add('show');
}

function showThemedVictoryAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'victory-animation-overlay';
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
    const icon = gameEngine.currentPlayer === 'pirate' ? theme.pirateIcon : theme.marineIcon;
    const animName = gameEngine.currentPlayer === 'pirate' ? 'victoryAnimPirate' : 'victoryAnimMarine';

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
    const player1Name = themeManager.getPlayerName('pirate');
    const player2Name = themeManager.getPlayerName('marine');

    if (gameEngine.currentPlayer === 'pirate') {
        playerIndicator.classList.remove('marine');
        playerIndicator.classList.add('pirate');

        turnIconAbove.textContent = theme.pirateIcon;
        turnLabel.textContent = `${player1Name.toUpperCase()}'S TURN`;

        document.body.classList.remove('marine-theme');
        document.body.classList.add('pirate-theme');
    } else {
        playerIndicator.classList.remove('pirate');
        playerIndicator.classList.add('marine');

        turnIconAbove.textContent = theme.marineIcon;
        turnLabel.textContent = `${player2Name.toUpperCase()}'S TURN`;

        document.body.classList.remove('pirate-theme');
        document.body.classList.add('marine-theme');
    }
}

function updateWinsDisplay() {
    pirateWinsDisplay.textContent = wins.pirate;
    marineWinsDisplay.textContent = wins.marine;
}

function updateThemeUI() {
    const theme = themeManager.getCurrentTheme();

    // Get custom player names or use theme defaults
    const player1Name = themeManager.getPlayerName('pirate');
    const player2Name = themeManager.getPlayerName('marine');

    // Update title text
    document.querySelector('.pirate-text').textContent = player1Name.toUpperCase();
    document.querySelector('.marine-text').textContent = player2Name.toUpperCase();

    // Update title icons (above the team names)
    const pirateTitleIcon = document.querySelector('.title-pirate .title-icon');
    const marineTitleIcon = document.querySelector('.title-marine .title-icon');
    if (pirateTitleIcon) pirateTitleIcon.textContent = theme.pirateIcon;
    if (marineTitleIcon) marineTitleIcon.textContent = theme.marineIcon;

    // Update VS divider icons
    const iconRoger = document.querySelector('.icon-roger');
    const iconAdmiral = document.querySelector('.icon-admiral');
    if (iconRoger) iconRoger.textContent = theme.pirateIcon;
    if (iconAdmiral) iconAdmiral.textContent = theme.marineIcon;

    // Update stats labels
    document.querySelector('.pirate-stat .stat-label').innerHTML =
        `${theme.pirateIcon} ${player1Name} Wins`;
    document.querySelector('.marine-stat .stat-label').innerHTML =
        `${theme.marineIcon} ${player2Name} Wins`;

    // Update player indicator
    updatePlayerIndicator();
}

function toggleSettings() {
    soundManager.playClick();
    settingsContent.classList.toggle('hidden');
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
            timerDisplay.classList.add('warning');
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
    timerDisplay.classList.remove('warning');
}

function updateTimerDisplay() {
    timerValue.textContent = timeLeft;
}

function handleTimeout() {
    soundManager.playError();

    // Switch to other player - current player loses their turn
    gameEngine.switchPlayer();
    updatePlayerIndicator();

    // Start timer for next player
    startTimer();

    // If AI's turn now, make AI move
    if (gameMode === 'ai' && gameEngine.currentPlayer === 'marine') {
        makeAIMove();
    }
}

// ===================================
// BACKGROUND PARTICLES
// ===================================

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const isPirate = Math.random() > 0.5;

        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.background = isPirate ?
            'rgba(220, 20, 60, 0.4)' : 'rgba(30, 64, 175, 0.4)';
        particle.style.boxShadow = isPirate ?
            '0 0 12px rgba(255, 215, 0, 0.6)' : '0 0 12px rgba(147, 197, 253, 0.6)';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 15 + 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 8 + 's';

        particlesContainer.appendChild(particle);
    }
}

// ===================================
// INITIALIZE ON PAGE LOAD
// ===================================

window.addEventListener('DOMContentLoaded', () => {
    init();
    createParticles();
});

// Add necessary animations
const style = document.createElement('style');
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
