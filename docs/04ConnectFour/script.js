// ===================================
// CONNECT FOUR - NOVA VS VOID
// Cosmic Theme with Enhanced UX
// ===================================

// Game State
const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 'pirate'; // pirate = Straw Hats, marine = World Government
let gameActive = true;
let animating = false; // Prevent multiple taps during animation
let wins = { pirate: 0, marine: 0 };
let currentArrows = []; // Track current arrows for clearing

// DOM Elements
const gameBoard = document.getElementById('gameBoard');
const playerIndicator = document.getElementById('playerIndicator');
const resetBtn = document.getElementById('resetBtn');
const victoryModal = document.getElementById('victoryModal');
const victoryTitle = document.getElementById('victoryTitle');
const victoryMessage = document.getElementById('victoryMessage');
const victoryIcon = document.getElementById('victoryIcon');
const playAgainBtn = document.getElementById('playAgainBtn');
const novaWinsDisplay = document.getElementById('pirateWins');
const voidWinsDisplay = document.getElementById('marineWins');
const arrowOverlay = document.getElementById('arrowOverlay');
const turnIconAbove = document.querySelector('.turn-icon-above');
const turnLabel = document.querySelector('.turn-label');

// Initialize Game
function initGame() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    currentPlayer = 'pirate';
    gameActive = true;
    animating = false;
    createBoard();
    updatePlayerIndicator();
    updateWinsDisplay();

    // Set initial theme to pirate
    document.body.classList.add('pirate-theme');
    document.body.classList.remove('marine-theme');
}

// Create Board UI with ALL 42 cells visible and DIRECTLY CLICKABLE
function createBoard() {
    gameBoard.innerHTML = '';

    // Create 6 rows × 7 columns grid
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Make each cell directly clickable
            cell.addEventListener('click', () => handleCellClick(row, col));

            gameBoard.appendChild(cell);
        }
    }
}

// Handle Direct Cell Click (Strategic Placement)
function handleCellClick(row, col) {
    // Prevent multiple taps during animation or if cell is occupied
    if (!gameActive || animating || board[row][col] !== null) return;

    // Set animating flag to prevent rapid taps
    animating = true;

    // Place piece directly in selected cell
    board[row][col] = currentPlayer;

    // Mark cell as filled and show piece immediately
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"].cell`);
    if (cell) {
        cell.classList.add('filled');
        animatePiecePlacement(row, col, currentPlayer);
    }

    // Check for win after piece placement
    setTimeout(() => {
        const winInfo = checkWin(row, col);

        if (winInfo) {
            handleWin(winInfo);
        } else if (isBoardFull()) {
            handleDraw();
        } else {
            switchPlayer();
            animating = false; // Re-enable clicks
        }
    }, 400); // Faster than drop animation
}

// Get Lowest Empty Row in Column
function getLowestEmptyRow(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === null) {
            return row;
        }
    }
    return -1;
}

// Animate Piece Placement (Strategic - no drop)
function animatePiecePlacement(row, col, player) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"].cell`);

    if (cell) {
        const piece = document.createElement('div');
        piece.className = `piece ${player}`;
        cell.appendChild(piece);

        // Add impact particle effect immediately
        setTimeout(() => {
            createLandingParticles(cell, player);
        }, 150);
    }
}

// Create Landing Particles Effect
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

// Add particle burst animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
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
`;
document.head.appendChild(particleStyle);

// Switch Player
function switchPlayer() {
    currentPlayer = currentPlayer === 'pirate' ? 'marine' : 'pirate';
    updatePlayerIndicator();
}

// Update Player Indicator
function updatePlayerIndicator() {
    if (currentPlayer === 'pirate') {
        playerIndicator.classList.remove('marine');
        playerIndicator.classList.add('pirate');

        // Update icon and text
        turnIconAbove.textContent = '👒';
        turnLabel.textContent = "STRAW HATS' TURN";

        // Change body theme to pirate
        document.body.classList.remove('marine-theme');
        document.body.classList.add('pirate-theme');
    } else {
        playerIndicator.classList.remove('pirate');
        playerIndicator.classList.add('marine');

        // Update icon and text
        turnIconAbove.textContent = '⚓';
        turnLabel.textContent = "MARINES' TURN";

        // Change body theme to marine
        document.body.classList.remove('pirate-theme');
        document.body.classList.add('marine-theme');
    }
}

// Check for Win
function checkWin(row, col) {
    const directions = [
        { dr: 0, dc: 1 },  // Horizontal
        { dr: 1, dc: 0 },  // Vertical
        { dr: 1, dc: 1 },  // Diagonal \
        { dr: 1, dc: -1 }  // Diagonal /
    ];

    for (const { dr, dc } of directions) {
        const count = 1 +
            countDirection(row, col, dr, dc) +
            countDirection(row, col, -dr, -dc);

        if (count >= 4) {
            const positions = getWinningPositions(row, col, dr, dc);
            return { positions, direction: { dr, dc } };
        }
    }

    return null;
}

// Count Consecutive Pieces in Direction
function countDirection(row, col, dr, dc) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;

    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
        count++;
        r += dr;
        c += dc;
    }

    return count;
}

// Get Winning Positions
function getWinningPositions(row, col, dr, dc) {
    const positions = [[row, col]];

    // Forward direction
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
        positions.push([r, c]);
        r += dr;
        c += dc;
    }

    // Backward direction
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
        positions.unshift([r, c]);
        r -= dr;
        c -= dc;
    }
    const cells = [];

    // Check in both directions
    for (let i = -3; i <= 3; i++) {
        const r = row + dr * i;
        const c = col + dc * i;

        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
            cells.push({ row: r, col: c });
        } else if (cells.length > 0) {
            break;
        }
    }
    return positions; // This line was missing, assuming it should return positions
}

// Themed Victory Animation
function showThemedVictoryAnimation() {
    // Create victory overlay
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

    if (currentPlayer === 'pirate') {
        // Pirate Victory: Jolly Roger Explosion
        overlay.innerHTML = `
            <div style="
                font-size: 20rem;
                animation: jollyRogerExplosion 2s cubic-bezier(0.34, 1.56, 0.64, 1);
                filter: drop-shadow(0 0 80px rgba(230, 57, 70, 1)) drop-shadow(0 0 120px rgba(255, 215, 0, 0.8));
            ">💀</div>
            <style>
                @keyframes jollyRogerExplosion {
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
    } else {
        // Marine Victory: Justice Symbol Flash
        overlay.innerHTML = `
            <div style="
                font-size: 20rem;
                animation: justiceFlash 2s cubic-bezier(0.34, 1.56, 0.64, 1);
                filter: drop-shadow(0 0 80px rgba(43, 127, 230, 1)) drop-shadow(0 0 120px rgba(240, 240, 240, 0.8));
            ">⚓</div>
            <style>
                @keyframes justiceFlash {
                    0% {
                        transform: scale(0) rotate(180deg);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.3) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.1) rotate(-10deg);
                        opacity: 0.3;
                    }
                }
            </style>
        `;
    }

    document.body.appendChild(overlay);

    // Remove after 2 seconds
    setTimeout(() => {
        overlay.remove();
    }, 2000);
}

// Handle Win
function handleWin(winInfo) {
    gameActive = false;
    wins[currentPlayer]++;
    updateWinsDisplay();

    // Show themed victory animation
    showThemedVictoryAnimation();

    // Show victory modal after animation
    setTimeout(() => {
        showVictoryModal();
        animating = false;
    }, 2000);
}

// Handle Draw
function handleDraw() {
    gameActive = false;
    animating = false;
    victoryTitle.textContent = "DRAW!";
    victoryTitle.className = 'victory-title';
    victoryMessage.textContent = "The Grand Line battle ends in a stalemate!";
    victoryIcon.textContent = "⚖️";
    victoryModal.classList.add('show');
}

// Show Victory Modal
function showVictoryModal() {
    if (currentPlayer === 'pirate') {
        victoryTitle.textContent = "STRAW HATS WIN!";
        victoryTitle.className = 'victory-title pirate';
        victoryMessage.textContent = "We're gonna be King of the Pirates!";
        victoryIcon.textContent = "👒";
    } else {
        victoryTitle.textContent = "MARINES WIN!";
        victoryTitle.className = 'victory-title marine';
        victoryMessage.textContent = "Justice prevails! Absolute Justice!";
        victoryIcon.textContent = "⚓";
    }

    victoryModal.classList.add('show');
}

// Update Wins Display
function updateWinsDisplay() {
    novaWinsDisplay.textContent = wins.pirate;
    voidWinsDisplay.textContent = wins.marine;
}

// Check if Board is Full
function isBoardFull() {
    return board[0].every(cell => cell !== null);
}

// Reset Game
function resetGame() {
    victoryModal.classList.remove('show');
    initGame();
}

// Event Listeners
resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);

// Background Particles with Nova/Void Theme
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const isNova = Math.random() > 0.5;

        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.background = isNova ?
            'rgba(220, 20, 60, 0.4)' : 'rgba(30, 64, 175, 0.4)';
        particle.style.boxShadow = isNova ?
            '0 0 12px rgba(255, 215, 0, 0.6)' : '0 0 12px rgba(147, 197, 253, 0.6)';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 15 + 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 8 + 's';

        particlesContainer.appendChild(particle);
    }
}

// Float animation for particles
const floatStyle = document.createElement('style');
floatStyle.textContent = `
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
document.head.appendChild(floatStyle);

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initGame();
    createParticles();

    // Add screen shake effect for victories
    window.screenShake = function () {
        document.body.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    };
});

// Screen shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);
