// ===================================
// GAME ENGINE - CORE LOGIC
// ===================================

class GameEngine {
    constructor(rows = 6, cols = 7) {
        this.ROWS = rows;
        this.COLS = cols;
        this.board = [];
        this.currentPlayer = 'pirate';
        this.gameActive = true;
        this.moveHistory = [];
        this.initializeBoard();
    }

    initializeBoard() {
        this.board = Array(this.ROWS).fill(null).map(() => Array(this.COLS).fill(null));
        this.currentPlayer = 'pirate';
        this.gameActive = true;
        this.moveHistory = [];
    }

    resetGame() {
        this.initializeBoard();
    }

    isValidMove(row, col) {
        return (
            row >= 0 &&
            row < this.ROWS &&
            col >= 0 &&
            col < this.COLS &&
            this.board[row][col] === null
        );
    }

    makeMove(row, col, player = null) {
        if (!this.gameActive || !this.isValidMove(row, col)) {
            return false;
        }

        const playerToMove = player || this.currentPlayer;
        this.board[row][col] = playerToMove;
        this.moveHistory.push({ row, col, player: playerToMove });
        return true;
    }

    undoMove() {
        if (this.moveHistory.length === 0) return null;

        const lastMove = this.moveHistory.pop();
        this.board[lastMove.row][lastMove.col] = null;
        this.currentPlayer = lastMove.player;
        this.gameActive = true;

        return lastMove;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'pirate' ? 'marine' : 'pirate';
    }

    getLowestEmptyRow(col) {
        for (let row = this.ROWS - 1; row >= 0; row--) {
            if (this.board[row][col] === null) {
                return row;
            }
        }
        return -1;
    }

    getValidColumns() {
        const validCols = [];
        for (let col = 0; col < this.COLS; col++) {
            if (this.getLowestEmptyRow(col) !== -1) {
                validCols.push(col);
            }
        }
        return validCols;
    }

    checkWin(row, col) {
        const player = this.board[row][col];
        if (!player) return null;

        const directions = [
            { dr: 0, dc: 1 },  // Horizontal
            { dr: 1, dc: 0 },  // Vertical
            { dr: 1, dc: 1 },  // Diagonal \
            { dr: 1, dc: -1 }  // Diagonal /
        ];

        for (const { dr, dc } of directions) {
            const count = 1 +
                this.countDirection(row, col, dr, dc, player) +
                this.countDirection(row, col, -dr, -dc, player);

            if (count >= 4) {
                const positions = this.getWinningPositions(row, col, dr, dc, player);
                return { positions, direction: { dr, dc }, player };
            }
        }

        return null;
    }

    countDirection(row, col, dr, dc, player) {
        let count = 0;
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS && this.board[r][c] === player) {
            count++;
            r += dr;
            c += dc;
        }

        return count;
    }

    getWinningPositions(row, col, dr, dc, player) {
        const positions = [[row, col]];

        // Forward direction
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS && this.board[r][c] === player) {
            positions.push([r, c]);
            r += dr;
            c += dc;
        }

        // Backward direction
        r = row - dr;
        c = col - dc;
        while (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS && this.board[r][c] === player) {
            positions.unshift([r, c]);
            r -= dr;
            c -= dc;
        }

        return positions;
    }

    isBoardFull() {
        return this.board[0].every(cell => cell !== null);
    }

    // Get a copy of the board for AI analysis
    getBoardCopy() {
        return this.board.map(row => [...row]);
    }

    // Evaluate board state for AI (heuristic function)
    evaluateBoard(player) {
        let score = 0;
        const opponent = player === 'pirate' ? 'marine' : 'pirate';

        // Check all possible 4-in-a-row positions
        const directions = [
            { dr: 0, dc: 1 },  // Horizontal
            { dr: 1, dc: 0 },  // Vertical
            { dr: 1, dc: 1 },  // Diagonal \
            { dr: 1, dc: -1 }  // Diagonal /
        ];

        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                for (const { dr, dc } of directions) {
                    score += this.evaluateWindow(row, col, dr, dc, player, opponent);
                }
            }
        }

        return score;
    }

    evaluateWindow(row, col, dr, dc, player, opponent) {
        let playerCount = 0;
        let opponentCount = 0;
        let emptyCount = 0;

        // Check 4 consecutive cells
        for (let i = 0; i < 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;

            if (r < 0 || r >= this.ROWS || c < 0 || c >= this.COLS) {
                return 0; // Out of bounds
            }

            const cell = this.board[r][c];
            if (cell === player) playerCount++;
            else if (cell === opponent) opponentCount++;
            else emptyCount++;
        }

        // Scoring logic
        if (playerCount === 4) return 100;      // Win
        if (opponentCount === 4) return -100;   // Loss
        if (playerCount === 3 && emptyCount === 1) return 5;
        if (playerCount === 2 && emptyCount === 2) return 2;
        if (opponentCount === 3 && emptyCount === 1) return -4; // Block opponent

        return 0;
    }
}
