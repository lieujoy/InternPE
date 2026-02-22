// ===================================
// THEME MANAGER - 11 ANIME THEMES
// Complete theme system with backgrounds & animations
// ===================================

class ThemeManager {
  constructor() {
    this.themes = {
      // One Piece
      onePiece: {
        name: "One Piece",
        pirateColor: "#DC143C",
        marineColor: "#1E40AF",
        pirateName: "Straw Hats",
        marineName: "Marines",
        pirateIcon: "👒",
        marineIcon: "⚓",
        piratePieceIcon: "👒",
        marinePieceIcon: "⚓",
        pirateGradient: "linear-gradient(135deg, #DC143C, #FFD700)",
        marineGradient: "linear-gradient(135deg, #1E40AF, #93C5FD)",
        background: "marineford-war",
        bgGradient:
          "linear-gradient(180deg, #b3e5fc 0%, #01579b 40%, #bf360c 80%, #4a0000 100%)", // Aokiji Ice -> Deep Ocean -> Akainu Magma -> Scorched Earth
        subtitle: "🏴‍☠️ Connect Four • Paramount War ⚔️",
        vsIcon: "⚔️",
        winMessage: "We're gonna be King of the Pirates!",
        loseMessage: "The Marines have captured the Straw Hat crew!",
        drawMessage: "A stalemate on the Grand Line!",
      },
      naruto: {
        name: "Naruto",
        pirateColor: "#FF6B35",
        marineColor: "#4CA1AF",
        pirateName: "Konoha",
        marineName: "Akatsuki",
        pirateIcon: "🍃",
        marineIcon: "☁️",
        piratePieceIcon: "🍃",
        marinePieceIcon: "☁️",
        pirateGradient: "linear-gradient(135deg, #FF6B35, #F7931E)",
        marineGradient: "linear-gradient(135deg, #1A1A2E, #E94560)",
        background: "valley-of-end",
        bgGradient:
          "linear-gradient(180deg, #1565c0 0%, #546e7a 45%, #e65100 100%)", // Valley of the End: Blue Waterfall -> Dark Stone Cliffs -> Orange Chakra Clash
        subtitle: "🍃 Connect Four • Valley of the End ⚡",
        vsIcon: "🌀",
        winMessage: "Believe it! I'm going to be the next Hokage!",
        loseMessage: "The Akatsuki have captured the Tailed Beast!",
        drawMessage: "Our chakra levels are perfectly matched!",
      },
      dragonBall: {
        name: "Dragon Ball",
        pirateColor: "#FF8C00",
        marineColor: "#9932CC", // Dark Orchid for Frieza
        pirateName: "Z Fighters",
        marineName: "Frieza Force",
        pirateIcon: "🐉", // Dragon matches Anime Title
        marineIcon: "👽", // Alien matches Frieza
        piratePieceIcon: "🐉",
        marinePieceIcon: "👽",
        pirateGradient: "linear-gradient(135deg, #FF8C00, #FFD700)",
        marineGradient: "linear-gradient(135deg, #4B0082, #8A2BE2)",
        background: "namek-exploding",
        bgGradient:
          "linear-gradient(180deg, #00acc1 0%, #388e3c 45%, #e64a19 100%)", // Namek: Iconic Teal Alien Sky -> Green Planet Surface -> Volcanic Explosion
        subtitle: "🔮 Connect Four • Destruction of Namek 🪐",
        vsIcon: "💥",
        winMessage: "This is the power of Ultra Instinct!",
        loseMessage: "The planet has been destroyed by Frieza!",
        drawMessage: "Neither of us is backing down!",
      },
      onePunchMan: {
        name: "One Punch Man",
        pirateColor: "#FFD700",
        marineColor: "#8B0000",
        pirateName: "Hero Association",
        marineName: "Monster Assoc.",
        pirateIcon: "👊",
        marineIcon: "👁️",
        piratePieceIcon: "👊",
        marinePieceIcon: "👾",
        pirateGradient: "linear-gradient(135deg, #FFD700, #FFA500)",
        marineGradient: "linear-gradient(135deg, #8B0000, #DC143C)",
        background: "city-z-ruins",
        bgGradient:
          "linear-gradient(180deg, #263238 0%, #546e7a 40%, #bf360c 80%, #f57f17 100%)", // City Z: Dark Storm Clouds -> Destroyed Concrete -> Fire & Embers
        subtitle: "👊 Connect Four • City Z Decimation 🏚️",
        vsIcon: "💥",
        winMessage: "Consecutive Normal Punches!",
        loseMessage: "The Hero Association has been overwhelmed!",
        drawMessage: "Playing games is harder than fighting monsters.",
      },
      demonSlayer: {
        name: "Demon Slayer",
        pirateColor: "#2C3E50",
        marineColor: "#FF4500", // Bright Red for Demons
        pirateName: "Demon Slayers",
        marineName: "12 Kizuki",
        pirateIcon: "🗡️", // Sword
        marineIcon: "👹", // Oni
        piratePieceIcon: "🗡️",
        marinePieceIcon: "👹",
        pirateGradient: "linear-gradient(135deg, #2C3E50, #3498DB)",
        marineGradient: "linear-gradient(135deg, #E74C3C, #C0392B)",
        background: "wisteria-night",
        bgGradient:
          "linear-gradient(180deg, #0a0014 0%, #4a0080 50%, #7b1fa2 100%)", // Infinity Castle: Black Spirit Void -> Demon Purple -> Glowing Violet Core
        subtitle: "⚔️ Connect Four • Infinity Castle Arc 👹",
        vsIcon: "⚔️",
        winMessage: "Total Concentration Breathing: Victory!",
        loseMessage: "Set your heart ablaze! Don't give up!",
        drawMessage: "Neither human nor demon could win this round.",
      },
      attackOnTitan: {
        name: "Attack on Titan",
        pirateColor: "#16A085",
        marineColor: "#8B4513",
        pirateName: "Survey Corps",
        marineName: "Titans",
        pirateIcon: "🕊️",
        marineIcon: "👣",
        piratePieceIcon: "🕊️",
        marinePieceIcon: "👣",
        pirateGradient: "linear-gradient(135deg, #16A085, #1ABC9C)",
        marineGradient: "linear-gradient(135deg, #8B4513, #D2691E)",
        background: "shiganshina-district",
        bgGradient:
          "linear-gradient(180deg, #37474f 0%, #455a64 35%, #3e2723 70%, #b71c1c 100%)", // Wall Maria: Storm Sky -> Stone Wall -> Brown Earth -> Blood Red Titan Breach
        subtitle: "🛡️ Connect Four • Shiganshina District 🧱",
        vsIcon: "⚔️",
        winMessage: "Dedicate your hearts! Humanity wins!",
        loseMessage: "The Walls have been breached!",
        drawMessage: "A temporary truce inside the Walls.",
      },
      pokemon: {
        name: "Pokemon",
        pirateColor: "#FFCB05",
        marineColor: "#3B4CCA",
        pirateName: "Pokemon League",
        marineName: "Team Rocket",
        pirateIcon: "🧢",
        marineIcon: "🚀",
        piratePieceIcon: "🧢",
        marinePieceIcon: "🚀",
        pirateGradient: "linear-gradient(135deg, #FFCB05, #B3A125)",
        marineGradient: "linear-gradient(135deg, #3B4CCA, #8B8BE0)",
        background: "stadium-battle",
        bgGradient:
          "linear-gradient(135deg, #0d47a1 0%, #1a237e 45%, #b71c1c 80%, #7f0000 100%)", // Indigo League Finals: Blue Trainer Side -> Stadium Center -> Red Rival Side
        subtitle: "⚡ Connect Four • Indigo League Final 🏆",
        vsIcon: "⚔️", // Changed from VS
        winMessage: "Critical Hit! It's super effective!",
        loseMessage: "Team Rocket is blasting off again!",
        drawMessage: "It's a draw! Both Pokemon are unable to battle!",
      },
      jujutsuKaisen: {
        name: "Jujutsu Kaisen",
        pirateColor: "#E0E0E0",
        marineColor: "#FF0033", // Maximum Red Contrast
        pirateName: "Jujutsu High",
        marineName: "Cursed Spirits",
        pirateIcon: "🤞",
        marineIcon: "☠️", // Skull & Crossbones for Cursed Spirits
        piratePieceIcon: "🤞",
        marinePieceIcon: "☠️",
        pirateGradient: "linear-gradient(135deg, #E8E8E8, #FFFFFF)",
        marineGradient: "linear-gradient(135deg, #000000, #2C2C2C)",
        background: "malevolent-shrine",
        bgGradient:
          "linear-gradient(180deg, #000000 0%, #880e4f 45%, #1a0000 100%)", // Sukuna Domain: Pure Black Void -> Blood Cursed Energy Pink-Red -> Engulfed in Darkness
        subtitle: "🤞 Connect Four • Shibuya Incident 🩸",
        vsIcon: "⛩️",
        winMessage: "Domain Expansion: Infinite Victory!",
        loseMessage: "You are strong. Stand proud.",
        drawMessage: "The Cursed Energy is balanced.",
      },
      hunterXHunter: {
        name: "Hunter x Hunter",
        pirateColor: "#27AE60",
        marineColor: "#E67E22",
        pirateName: "Hunters",
        marineName: "Spiders",
        pirateIcon: "🎣",
        marineIcon: "🕷️",
        piratePieceIcon: "🎣",
        marinePieceIcon: "🕷️",
        pirateGradient: "linear-gradient(135deg, #27AE60, #2ECC71)",
        marineGradient: "linear-gradient(135deg, #E67E22, #D35400)",
        background: "nen-forest",
        bgGradient:
          "linear-gradient(135deg, #1a1a2e 0%, #2e7d32 50%, #f57f17 100%)", // HxH: Dark Arena Night -> Greed Island Jungle -> Golden Nen Aura
        subtitle: "🎣 Connect Four • Heaven's Arena 🕷️",
        vsIcon: "🃏",
        winMessage: "Hunter License acquired!",
        loseMessage: "The Spiders have stolen the loot!",
        drawMessage: "Neither side could steal the badge.",
      },
      bleach: {
        name: "Bleach",
        pirateColor: "#3498DB",
        marineColor: "#9B59B6", // Lighter Purple for contrast
        pirateName: "Soul Reapers",
        marineName: "The Espada",
        pirateIcon: "👘",
        marineIcon: "🦴",
        piratePieceIcon: "👘",
        marinePieceIcon: "🦴",
        pirateGradient: "linear-gradient(135deg, #3498DB, #5DADE2)",
        marineGradient: "linear-gradient(135deg, #8E44AD, #9B59B6)",
        background: "hueco-mundo",
        bgGradient:
          "linear-gradient(180deg, #000000 0%, #1a237e 30%, #b0bec5 70%, #f5f5f5 100%)", // Hueco Mundo: Eternal Night Sky -> Twilight Indigo -> White Sand Desert
        subtitle: "⚔️ Connect Four • Thousand Year Blood War 🦋",
        vsIcon: "🦋",
        winMessage: "Bankai! The Soul Society is safe.",
        loseMessage: "The Soul Society has crumbled...",
        drawMessage: "The spiritual pressure is equal.",
      },
      berserk: {
        name: "Berserk",
        pirateColor: "#A9A9A9",
        marineColor: "#8B0000",
        pirateName: "Band of the Hawk",
        marineName: "God Hand",
        pirateIcon: "🗡️",
        marineIcon: "🦇",
        piratePieceIcon: "🗡️",
        marinePieceIcon: "🦇",
        pirateGradient: "linear-gradient(135deg, #2C2C2C, #4A4A4A)",
        marineGradient: "linear-gradient(135deg, #8B0000, #DC143C)",
        background: "eclipse-red",
        bgGradient:
          "linear-gradient(180deg, #1a0000 0%, #8b0000 40%, #3b0000 70%, #000000 100%)", // The Eclipse: Blood Moon Ritual -> Crimson Demonic Sky -> Void
        subtitle: "🗡️ Connect Four • The Eclipse 🌑",
        vsIcon: "🌘",
        winMessage: "I will determine my own destiny!",
        loseMessage: "The Eclipse has begun...",
        drawMessage: "The struggle continues against causality.",
      },
    };

    this.currentTheme = "onePiece";
    this.customPlayerNames = {
      pirate: null,
      marine: null,
    };
    this.loadThemeFromStorage();
  }

  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.currentTheme = themeName;
      const theme = this.themes[themeName];

      // Update CSS variables
      document.documentElement.style.setProperty(
        "--pirate-primary",
        theme.pirateColor,
      );
      document.documentElement.style.setProperty(
        "--marine-primary",
        theme.marineColor,
      );
      document.documentElement.style.setProperty(
        "--pirate-shadow",
        this.hexToRgba(theme.pirateColor, 0.8),
      );
      document.documentElement.style.setProperty(
        "--marine-shadow",
        this.hexToRgba(theme.marineColor, 0.8),
      );

      // Set Dynamic Background Gradient
      if (theme.bgGradient) {
        document.documentElement.style.setProperty(
          "--theme-bg",
          theme.bgGradient,
        );
      }

      // Save to localStorage
      localStorage.setItem("connectfour-theme", themeName);

      // Update browser tab title dynamically
      const themeTitles = {
        onePiece: "Connect Four — Paramount War ⚔️",
        naruto: "Connect Four — Valley of the End 🌀",
        dragonBall: "Connect Four — Destruction of Namek 🪐",
        onePunchMan: "Connect Four — City Z Decimation 👊",
        demonSlayer: "Connect Four — Infinity Castle 🗡️",
        attackOnTitan: "Connect Four — Shiganshina District 🧱",
        pokemon: "Connect Four — Indigo League Finals ⚡",
        jujutsuKaisen: "Connect Four — Shibuya Incident 🤞",
        hunterXHunter: "Connect Four — Heaven's Arena 🎣",
        bleach: "Connect Four — Thousand Year Blood War 🦋",
        berserk: "Connect Four — The Eclipse 🌑",
      };
      document.title =
        themeTitles[themeName] || "Connect Four — Anime Edition ⚔️";

      // Update the isolated bg-layer div class (keeps animations off the body)
      const bgLayer = document.getElementById("bgLayer");
      if (bgLayer) {
        bgLayer.className = `bg-layer theme-${theme.background}`;
      }

      // Apply theme-specific background class (kept for compatibility)
      this.applyThemeBackground(theme.background);
    }
  }

  applyThemeBackground(backgroundType) {
    // Remove all theme background classes
    document.body.classList.remove(
      // Legacy class names
      "theme-ocean-pirate",
      "theme-ninja-village",
      "theme-space-battle",
      "theme-hero-battle",
      "theme-demon-night",
      "theme-wall-defense",
      "theme-pokemon-arena",
      "theme-cursed-realm",
      "theme-hunter-exam",
      "theme-soul-society",
      "theme-dark-fantasy",
      // Active class names
      "theme-marineford-war",
      "theme-valley-of-end",
      "theme-namek-exploding",
      "theme-city-z-ruins",
      "theme-wisteria-night",
      "theme-shiganshina-district",
      "theme-stadium-battle",
      "theme-malevolent-shrine",
      "theme-nen-forest",
      "theme-hueco-mundo",
      "theme-eclipse-red",
    );

    // Add new theme background with smooth transition
    document.body.classList.add(`theme-${backgroundType}`);
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  loadThemeFromStorage() {
    // Task requirement: Always load One Piece on reload/start
    this.setTheme("onePiece");
    // Always load custom player names
    this.loadPlayerNamesFromStorage();
  }

  getCurrentTheme() {
    return this.themes[this.currentTheme];
  }

  getAllThemes() {
    return Object.keys(this.themes).map((key) => ({
      id: key,
      ...this.themes[key],
    }));
  }

  setPlayerNames(pirateName, marineName) {
    this.customPlayerNames.pirate = pirateName || null;
    this.customPlayerNames.marine = marineName || null;

    // Save to localStorage
    localStorage.setItem("connectfour-player1-name", pirateName || "");
    localStorage.setItem("connectfour-player2-name", marineName || "");
  }

  getPlayerName(player) {
    // Return custom name if set, otherwise theme default
    if (player === "pirate") {
      return (
        this.customPlayerNames.pirate ||
        this.themes[this.currentTheme].pirateName
      );
    } else {
      return (
        this.customPlayerNames.marine ||
        this.themes[this.currentTheme].marineName
      );
    }
  }

  loadPlayerNamesFromStorage() {
    const pirateName = localStorage.getItem("connectfour-player1-name");
    const marineName = localStorage.getItem("connectfour-player2-name");

    if (pirateName) this.customPlayerNames.pirate = pirateName;
    if (marineName) this.customPlayerNames.marine = marineName;
  }

  // Get piece icon for theme-aware game pieces
  getPieceIcon(player) {
    const theme = this.themes[this.currentTheme];
    return player === "pirate" ? theme.piratePieceIcon : theme.marinePieceIcon;
  }
}
