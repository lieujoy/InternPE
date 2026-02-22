// ===================================
// AI PLAYER — MINIMAX
// ===================================

class AIPlayer {
  constructor(difficulty = "medium") {
    this.difficulty = difficulty;
    this.lastMoveExplanation = ""; // For Easy mode: why did AI make this move?
    this.transpositionTable = new Map(); // Bug fix: cache seen states for Extreme
    this.depthLimits = {
      easy: 1,
      medium: 4, // Improved: was 3
      hard: 7, // Improved: was 6
      extreme: 12, // New: perfect play, never loses
    };
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    this.transpositionTable.clear();
  }

  /** Find the move that threatens the most offensive 3-in-a-row sequences */
  getBestOffensiveMove(gameEngine, player) {
    const validCols = gameEngine.getValidColumns();
    let bestScore = -1;
    let bestMove = null;

    for (const col of validCols) {
      const row = gameEngine.getLowestEmptyRow(col);
      gameEngine.makeMove(row, col, player);

      // Check immediate win first
      const win = gameEngine.checkWin(row, col);
      if (win) {
        gameEngine.undoMove();
        return { row, col, score: Infinity };
      }

      const score = gameEngine.evaluateBoard(player);
      gameEngine.undoMove();

      if (score > bestScore) {
        bestScore = score;
        bestMove = { row, col, score };
      }
    }
    return bestMove;
  }

  /** Find a move that immediately blocks an opponent 3-in-a-row / win threat */
  getImmediateBlockMove(gameEngine, player) {
    const opponent = player === "pirate" ? "marine" : "pirate";
    const validCols = gameEngine.getValidColumns();

    for (const col of validCols) {
      const row = gameEngine.getLowestEmptyRow(col);
      // Temporarily place opponent piece to see if they'd win
      gameEngine.makeMove(row, col, opponent);
      const win = gameEngine.checkWin(row, col);
      gameEngine.undoMove();

      if (win) {
        return { row, col, score: 999 };
      }
    }
    return null;
  }

  // ===================================
  // MAIN MOVE SELECTION
  // ===================================

  getBestMove(gameEngine, player) {
    this.lastMoveExplanation = "";

    if (this.difficulty === "easy") {
      return this.getEasyMove(gameEngine, player);
    }

    this.transpositionTable.clear();
    const depth = this.depthLimits[this.difficulty] || this.depthLimits.medium;
    const opponent = player === "pirate" ? "marine" : "pirate";

    // Column order: prefer centre columns for better heuristics
    const validCols = this.orderColumns(gameEngine);

    let bestScore = -Infinity;
    let bestCol = null;
    let bestRow = null;

    for (const col of validCols) {
      const row = gameEngine.getLowestEmptyRow(col);
      gameEngine.makeMove(row, col, player);
      const score = this.minimax(
        gameEngine,
        depth - 1,
        -Infinity,
        Infinity,
        false,
        player,
        opponent,
      );
      gameEngine.undoMove();

      if (score > bestScore) {
        bestScore = score;
        bestCol = col;
        bestRow = row;
      }
    }

    return { row: bestRow, col: bestCol, score: bestScore };
  }

  // ===================================
  // EASY MODE — with move explanation
  // ===================================

  getEasyMove(gameEngine, player) {
    const opponent = player === "pirate" ? "marine" : "pirate";
    const validCols = gameEngine.getValidColumns();

    // 1. Win immediately if possible
    for (const col of validCols) {
      const row = gameEngine.getLowestEmptyRow(col);
      gameEngine.makeMove(row, col, player);
      const win = gameEngine.checkWin(row, col);
      gameEngine.undoMove();
      if (win) {
        this.lastMoveExplanation = "🎯 AI spotted a winning move!";
        return { row, col };
      }
    }

    // 2. Block opponent's immediate win (~50% chance — keeps easy feeling beatable)
    if (Math.random() < 0.5) {
      for (const col of validCols) {
        const row = gameEngine.getLowestEmptyRow(col);
        gameEngine.makeMove(row, col, opponent);
        const win = gameEngine.checkWin(row, col);
        gameEngine.undoMove();
        if (win) {
          this.lastMoveExplanation = "🛡️ AI blocked your winning move!";
          return { row, col };
        }
      }
    }

    // 3. Otherwise random
    return this.getRandomMove(gameEngine);
  }

  // ===================================
  // MINIMAX WITH ALPHA-BETA + TRANSPOSITION TABLE
  // ===================================

  minimax(gameEngine, depth, alpha, beta, isMaximizing, player, opponent) {
    // Transposition table lookup
    const key = this.boardKey(gameEngine, isMaximizing);
    const cached = this.transpositionTable.get(key);
    if (cached !== undefined && cached.depth >= depth) {
      return cached.score;
    }

    // Terminal state checks
    const lastMove = gameEngine.moveHistory[gameEngine.moveHistory.length - 1];
    if (lastMove) {
      const winInfo = gameEngine.checkWin(lastMove.row, lastMove.col);
      if (winInfo) {
        const score =
          winInfo.player === player
            ? 1000000 + depth // Prefer faster wins
            : -1000000 - depth; // Prefer slower losses
        this.transpositionTable.set(key, { score, depth });
        return score;
      }
    }

    if (gameEngine.isBoardFull()) return 0;
    if (depth === 0) {
      const score = gameEngine.evaluateBoard(player);
      this.transpositionTable.set(key, { score, depth });
      return score;
    }

    const validCols = this.orderColumns(gameEngine);
    let result;

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const col of validCols) {
        const row = gameEngine.getLowestEmptyRow(col);
        gameEngine.makeMove(row, col, player);
        const score = this.minimax(
          gameEngine,
          depth - 1,
          alpha,
          beta,
          false,
          player,
          opponent,
        );
        gameEngine.undoMove();
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      result = maxScore;
    } else {
      let minScore = Infinity;
      for (const col of validCols) {
        const row = gameEngine.getLowestEmptyRow(col);
        gameEngine.makeMove(row, col, opponent);
        const score = this.minimax(
          gameEngine,
          depth - 1,
          alpha,
          beta,
          true,
          player,
          opponent,
        );
        gameEngine.undoMove();
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
      result = minScore;
    }

    this.transpositionTable.set(key, { score: result, depth });
    return result;
  }

  // ===================================
  // HINT SYSTEM
  // ===================================

  /**
   * Returns the best move for the CURRENT player (used for Hint button).
   * Runs a medium-depth minimax regardless of selected difficulty,
   * so hints are always high quality but not slow.
   */
  getHint(gameEngine, player) {
    const opponent = player === "pirate" ? "marine" : "pirate";
    const depth = 5; // Fixed depth for hints — fast and smart
    const validCols = this.orderColumns(gameEngine);

    let bestScore = -Infinity;
    let bestCol = null;
    let bestRow = null;

    this.transpositionTable.clear();

    for (const col of validCols) {
      const row = gameEngine.getLowestEmptyRow(col);
      gameEngine.makeMove(row, col, player);
      const score = this.minimax(
        gameEngine,
        depth - 1,
        -Infinity,
        Infinity,
        false,
        player,
        opponent,
      );
      gameEngine.undoMove();

      if (score > bestScore) {
        bestScore = score;
        bestCol = col;
        bestRow = row;
      }
    }

    this.transpositionTable.clear();
    return { row: bestRow, col: bestCol, score: bestScore };
  }

  // ===================================
  // HELPERS
  // ===================================

  /** Order columns center-first for better alpha-beta pruning */
  orderColumns(gameEngine) {
    const cols = gameEngine.getValidColumns();
    const center = Math.floor(gameEngine.COLS / 2);
    return cols.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
  }

  getRandomMove(gameEngine) {
    const validCols = gameEngine.getValidColumns();
    const randomCol = validCols[Math.floor(Math.random() * validCols.length)];
    const randomRow = gameEngine.getLowestEmptyRow(randomCol);
    return { row: randomRow, col: randomCol };
  }

  /** Light board fingerprint for transposition table — column heights only */
  boardKey(gameEngine, isMaximizing) {
    const heights = [];
    for (let c = 0; c < gameEngine.COLS; c++) {
      let h = 0;
      for (let r = 0; r < gameEngine.ROWS; r++) {
        if (gameEngine.board[r][c] !== null) h++;
      }
      heights.push(`${gameEngine.board.map((row) => row[c] || ".").join("")}`);
    }
    return heights.join("|") + (isMaximizing ? "+" : "-");
  }

  // Simulate AI "thinking" time for UX
  async makeMove(gameEngine, player, showThinking = true) {
    if (showThinking) {
      const thinkingTime =
        {
          easy: 400,
          medium: 700,
          hard: 1100,
          extreme: 1500,
        }[this.difficulty] || 700;
      await new Promise((resolve) => setTimeout(resolve, thinkingTime));
    }
    return this.getBestMove(gameEngine, player);
  }
}
