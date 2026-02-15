// ===================================
// AI PLAYER - MINIMAX ALGORITHM
// ===================================

class AIPlayer {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.depthLimits = {
            easy: 1,
            medium: 3,
            hard: 6
        };
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    getBestMove(gameEngine, player) {
        if (this.difficulty === 'easy') {
            return this.getRandomMove(gameEngine);
        }

        const depth = this.depthLimits[this.difficulty];
        const opponent = player === 'pirate' ? 'marine' : 'pirate';

        let bestScore = -Infinity;
        let bestCol = null;
        let bestRow = null;

        const validCols = gameEngine.getValidColumns();

        // Try each valid column
        for (const col of validCols) {
            const row = gameEngine.getLowestEmptyRow(col);

            // Make the move
            gameEngine.makeMove(row, col, player);

            // Get the minimax score
            const score = this.minimax(gameEngine, depth - 1, -Infinity, Infinity, false, player, opponent);

            // Undo the move
            gameEngine.undoMove();

            // Update best move
            if (score > bestScore) {
                bestScore = score;
                bestCol = col;
                bestRow = row;
            }
        }

        return { row: bestRow, col: bestCol, score: bestScore };
    }

    minimax(gameEngine, depth, alpha, beta, isMaximizing, player, opponent) {
        // Check for terminal states
        const lastMove = gameEngine.moveHistory[gameEngine.moveHistory.length - 1];

        if (lastMove) {
            const winInfo = gameEngine.checkWin(lastMove.row, lastMove.col);
            if (winInfo) {
                // Win/loss detection
                if (winInfo.player === player) return 1000000 + depth; // Prefer faster wins
                if (winInfo.player === opponent) return -1000000 - depth; // Prefer slower losses
            }
        }

        if (gameEngine.isBoardFull()) {
            return 0; // Draw
        }

        if (depth === 0) {
            return gameEngine.evaluateBoard(player);
        }

        const validCols = gameEngine.getValidColumns();

        if (isMaximizing) {
            let maxScore = -Infinity;

            for (const col of validCols) {
                const row = gameEngine.getLowestEmptyRow(col);
                gameEngine.makeMove(row, col, player);
                const score = this.minimax(gameEngine, depth - 1, alpha, beta, false, player, opponent);
                gameEngine.undoMove();

                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);

                if (beta <= alpha) {
                    break; // Alpha-beta pruning
                }
            }

            return maxScore;
        } else {
            let minScore = Infinity;

            for (const col of validCols) {
                const row = gameEngine.getLowestEmptyRow(col);
                gameEngine.makeMove(row, col, opponent);
                const score = this.minimax(gameEngine, depth - 1, alpha, beta, true, player, opponent);
                gameEngine.undoMove();

                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);

                if (beta <= alpha) {
                    break; // Alpha-beta pruning
                }
            }

            return minScore;
        }
    }

    getRandomMove(gameEngine) {
        const validCols = gameEngine.getValidColumns();
        const randomCol = validCols[Math.floor(Math.random() * validCols.length)];
        const randomRow = gameEngine.getLowestEmptyRow(randomCol);
        return { row: randomRow, col: randomCol };
    }

    // Simulate AI "thinking" time for better UX
    async makeMove(gameEngine, player, showThinking = true) {
        if (showThinking) {
            // Add a delay to make it feel more natural
            const thinkingTime = this.difficulty === 'easy' ? 500 :
                this.difficulty === 'medium' ? 800 : 1200;
            await new Promise(resolve => setTimeout(resolve, thinkingTime));
        }

        return this.getBestMove(gameEngine, player);
    }
}
