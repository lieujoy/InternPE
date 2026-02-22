// ===================================
// AI PLAYER — FREE CELL MINIMAX
// Places pieces on any empty cell (no gravity).
// ===================================

class AIPlayer {
  constructor(difficulty = "medium") {
    this.difficulty = difficulty;
    this.lastMoveExplanation = "";
    this.transpositionTable = new Map();
    // Depth limits tuned for 42-cell branching factor with alpha-beta pruning
    this.depthLimits = {
      easy: 0, // Pure random — instant response
      medium: 2, // ~1764 nodes max with pruning
      hard: 3, // ~74k nodes max with pruning
      extreme: 4, // ~3M nodes max with pruning + time cap
    };
    // Hard time caps so the UI never freezes
    this.timeLimits = {
      easy: 50,
      medium: 250,
      hard: 800,
      extreme: 2000,
    };
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    this.transpositionTable.clear();
  }

  // ===================================
  // MAIN ENTRY POINT
  // ===================================

  getBestMove(gameEngine, player) {
    this.lastMoveExplanation = "";
    const validCells = gameEngine.getValidCells();

    if (validCells.length === 0) return null;

    if (this.difficulty === "easy") {
      return this._easyMove(gameEngine, player, validCells);
    }

    this.transpositionTable.clear();
    return this._minimaxMove(gameEngine, player, validCells);
  }

  // ===================================
  // EASY MODE — smart-random (no minimax)
  // ===================================

  _easyMove(gameEngine, player, validCells) {
    const opponent = player === "pirate" ? "marine" : "pirate";

    // 1. Always take an immediate win
    for (const { row, col } of validCells) {
      gameEngine.makeMove(row, col, player);
      const win = gameEngine.checkWin(row, col);
      gameEngine.undoMove();
      if (win) {
        this.lastMoveExplanation = "🎯 AI spotted a winning move!";
        return { row, col };
      }
    }

    // 2. 50% chance to block opponent's immediate win
    if (Math.random() < 0.5) {
      for (const { row, col } of validCells) {
        gameEngine.makeMove(row, col, opponent);
        const win = gameEngine.checkWin(row, col);
        gameEngine.undoMove();
        if (win) {
          this.lastMoveExplanation = "🛡️ AI blocked your winning move!";
          return { row, col };
        }
      }
    }

    // 3. Pure random from all valid cells — guaranteed non-null
    const pick = validCells[Math.floor(Math.random() * validCells.length)];
    this.lastMoveExplanation = "🎲 AI made a random move!";
    return { row: pick.row, col: pick.col };
  }

  // ===================================
  // MEDIUM / HARD / EXTREME — minimax
  // ===================================

  _minimaxMove(gameEngine, player, validCells) {
    const opponent = player === "pirate" ? "marine" : "pirate";
    const depth = this.depthLimits[this.difficulty];
    const ordered = this._orderCells(validCells, gameEngine);

    let bestScore = -Infinity;
    let bestMove = ordered[0]; // Safe default — never null
    const startTime = Date.now();
    const timeLimit = this.timeLimits[this.difficulty];

    for (const { row, col } of ordered) {
      if (Date.now() - startTime > timeLimit) break; // Time escape

      gameEngine.makeMove(row, col, player);
      const score = this._minimax(
        gameEngine,
        depth - 1,
        -Infinity,
        Infinity,
        false,
        player,
        opponent,
        startTime,
        timeLimit,
      );
      gameEngine.undoMove();

      if (score > bestScore) {
        bestScore = score;
        bestMove = { row, col };
      }
    }

    return bestMove;
  }

  // ===================================
  // MINIMAX WITH ALPHA-BETA + TRANSPOSITION + TIME ESCAPE
  // ===================================

  _minimax(
    gameEngine,
    depth,
    alpha,
    beta,
    isMaximizing,
    player,
    opponent,
    startTime,
    timeLimit,
  ) {
    // Time escape — return heuristic if we've been thinking too long
    if (Date.now() - startTime > timeLimit) {
      return gameEngine.evaluateBoard(player);
    }

    // Transposition table lookup
    const key = this._boardKey(gameEngine, isMaximizing);
    const cached = this.transpositionTable.get(key);
    if (cached !== undefined && cached.depth >= depth) {
      return cached.score;
    }

    // Terminal checks
    const last = gameEngine.moveHistory[gameEngine.moveHistory.length - 1];
    if (last) {
      const win = gameEngine.checkWin(last.row, last.col);
      if (win) {
        const score =
          win.player === player ? 1000000 + depth : -1000000 - depth;
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

    const validCells = gameEngine.getValidCells();
    const ordered = this._orderCells(validCells, gameEngine);
    let result;

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const { row, col } of ordered) {
        if (Date.now() - startTime > timeLimit) break;
        gameEngine.makeMove(row, col, player);
        const score = this._minimax(
          gameEngine,
          depth - 1,
          alpha,
          beta,
          false,
          player,
          opponent,
          startTime,
          timeLimit,
        );
        gameEngine.undoMove();
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Alpha-beta cut
      }
      result = maxScore;
    } else {
      let minScore = Infinity;
      for (const { row, col } of ordered) {
        if (Date.now() - startTime > timeLimit) break;
        gameEngine.makeMove(row, col, opponent);
        const score = this._minimax(
          gameEngine,
          depth - 1,
          alpha,
          beta,
          true,
          player,
          opponent,
          startTime,
          timeLimit,
        );
        gameEngine.undoMove();
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Alpha-beta cut
      }
      result = minScore;
    }

    this.transpositionTable.set(key, { score: result, depth });
    return result;
  }

  // ===================================
  // HINT SYSTEM
  // ===================================

  getHint(gameEngine, player) {
    const opponent = player === "pirate" ? "marine" : "pirate";
    const validCells = gameEngine.getValidCells();
    if (validCells.length === 0) return null;

    const ordered = this._orderCells(validCells, gameEngine);
    const startTime = Date.now();
    const timeLimit = 400;

    this.transpositionTable.clear();

    let bestScore = -Infinity;
    let bestMove = ordered[0];

    for (const { row, col } of ordered) {
      if (Date.now() - startTime > timeLimit) break;
      gameEngine.makeMove(row, col, player);
      const score = this._minimax(
        gameEngine,
        1,
        -Infinity,
        Infinity,
        false,
        player,
        opponent,
        startTime,
        timeLimit,
      );
      gameEngine.undoMove();
      if (score > bestScore) {
        bestScore = score;
        bestMove = { row, col };
      }
    }

    this.transpositionTable.clear();
    return bestMove;
  }

  // ===================================
  // HELPERS
  // ===================================

  /** Sort cells closest to center first — improves alpha-beta pruning dramatically */
  _orderCells(cells, gameEngine) {
    const centerRow = (gameEngine.ROWS - 1) / 2;
    const centerCol = (gameEngine.COLS - 1) / 2;
    return [...cells].sort((a, b) => {
      const distA = Math.abs(a.row - centerRow) + Math.abs(a.col - centerCol);
      const distB = Math.abs(b.row - centerRow) + Math.abs(b.col - centerCol);
      return distA - distB;
    });
  }

  /** Full board state fingerprint for transposition table */
  _boardKey(gameEngine, isMaximizing) {
    let key = "";
    for (let r = 0; r < gameEngine.ROWS; r++) {
      for (let c = 0; c < gameEngine.COLS; c++) {
        const p = gameEngine.board[r][c];
        key += p === "pirate" ? "P" : p === "marine" ? "M" : ".";
      }
    }
    return key + (isMaximizing ? "+" : "-");
  }

  // Simulate thinking time for UX realism
  async makeMove(gameEngine, player, showThinking = true) {
    if (showThinking) {
      const thinkingTime =
        {
          easy: 200,
          medium: 500,
          hard: 800,
          extreme: 1000,
        }[this.difficulty] || 500;
      await new Promise((resolve) => setTimeout(resolve, thinkingTime));
    }

    // CRITICAL: Save currentPlayer before evaluation.
    // undoMove() mutates currentPlayer as a side-effect. If the AI's
    // evaluation loops (e.g. blocking-check) end on an opponent undo,
    // currentPlayer is left pointing at the opponent. This causes the
    // subsequent real switchPlayer() call to flip the wrong direction,
    // permanently locking out human clicks.
    const savedCurrentPlayer = gameEngine.currentPlayer;
    const move = this.getBestMove(gameEngine, player);
    gameEngine.currentPlayer = savedCurrentPlayer; // restore — must always run
    return move;
  }
}
