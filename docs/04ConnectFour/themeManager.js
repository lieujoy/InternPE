// ===================================
// THEME MANAGER - 11 ANIME THEMES
// Complete theme system with backgrounds & animations
// ===================================

class ThemeManager {
    constructor() {
        this.themes = {
            onePiece: {
                name: 'One Piece',
                pirateColor: '#DC143C',
                marineColor: '#1E40AF',
                pirateName: 'Straw Hats',
                marineName: 'Marines',
                pirateIcon: '👒',
                marineIcon: '⚓',
                piratePieceIcon: '👒',
                marinePieceIcon: '⚓',
                pirateGradient: 'linear-gradient(135deg, #DC143C, #FFD700)',
                marineGradient: 'linear-gradient(135deg, #1E40AF, #93C5FD)',
                background: 'ocean-pirate'
            },
            naruto: {
                name: 'Naruto',
                pirateColor: '#FF6B35',
                marineColor: '#1A1A2E',
                pirateName: 'Konoha',
                marineName: 'Akatsuki',
                pirateIcon: '🍃',
                marineIcon: '☁️',
                piratePieceIcon: '🍃',
                marinePieceIcon: '☁️',
                pirateGradient: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                marineGradient: 'linear-gradient(135deg, #1A1A2E, #E94560)',
                background: 'ninja-village'
            },
            dragonBall: {
                name: 'Dragon Ball',
                pirateColor: '#FF8C00',
                marineColor: '#4B0082',
                pirateName: 'Goku',
                marineName: 'Vegeta',
                pirateIcon: '🔮',
                marineIcon: '⚡',
                piratePieceIcon: '🔮',
                marinePieceIcon: '⚡',
                pirateGradient: 'linear-gradient(135deg, #FF8C00, #FFD700)',
                marineGradient: 'linear-gradient(135deg, #4B0082, #8A2BE2)',
                background: 'space-battle'
            },
            onePunchMan: {
                name: 'One Punch Man',
                pirateColor: '#FFD700',
                marineColor: '#8B0000',
                pirateName: 'Saitama',
                marineName: 'Monsters',
                pirateIcon: '👊',
                marineIcon: '👾',
                piratePieceIcon: '👊',
                marinePieceIcon: '👾',
                pirateGradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
                marineGradient: 'linear-gradient(135deg, #8B0000, #DC143C)',
                background: 'hero-battle'
            },
            demonSlayer: {
                name: 'Demon Slayer',
                pirateColor: '#2C3E50',
                marineColor: '#E74C3C',
                pirateName: 'Slayers',
                marineName: 'Demons',
                pirateIcon: '⚔️',
                marineIcon: '🩸',
                piratePieceIcon: '⚔️',
                marinePieceIcon: '👿',
                pirateGradient: 'linear-gradient(135deg, #2C3E50, #3498DB)',
                marineGradient: 'linear-gradient(135deg, #E74C3C, #C0392B)',
                background: 'demon-night'
            },
            attackOnTitan: {
                name: 'Attack on Titan',
                pirateColor: '#16A085',
                marineColor: '#8B4513',
                pirateName: 'Scouts',
                marineName: 'Titans',
                pirateIcon: '🗡️',
                marineIcon: '👹',
                piratePieceIcon: '🗡️',
                marinePieceIcon: '👹',
                pirateGradient: 'linear-gradient(135deg, #16A085, #1ABC9C)',
                marineGradient: 'linear-gradient(135deg, #8B4513, #D2691E)',
                background: 'wall-defense'
            },
            pokemon: {
                name: 'Pokemon',
                pirateColor: '#FFCB05',
                marineColor: '#3B4CCA',
                pirateName: 'Trainers',
                marineName: 'Rivals',
                pirateIcon: '⚡',
                marineIcon: '🔮',
                piratePieceIcon: '⚡',
                marinePieceIcon: '🔮',
                pirateGradient: 'linear-gradient(135deg, #FFCB05, #B3A125)',
                marineGradient: 'linear-gradient(135deg, #3B4CCA, #8B8BE0)',
                background: 'pokemon-arena'
            },
            jujutsuKaisen: {
                name: 'Jujutsu Kaisen',
                pirateColor: '#E8E8E8',
                marineColor: '#000000',
                pirateName: 'Sorcerers',
                marineName: 'Curses',
                pirateIcon: '✨',
                marineIcon: '👻',
                piratePieceIcon: '✨',
                marinePieceIcon: '👻',
                pirateGradient: 'linear-gradient(135deg, #E8E8E8, #FFFFFF)',
                marineGradient: 'linear-gradient(135deg, #000000, #2C2C2C)',
                background: 'cursed-realm'
            },
            hunterXHunter: {
                name: 'Hunter x Hunter',
                pirateColor: '#27AE60',
                marineColor: '#E67E22',
                pirateName: 'Hunters',
                marineName: 'Spiders',
                pirateIcon: '🎣',
                marineIcon: '🕷️',
                piratePieceIcon: '🎣',
                marinePieceIcon: '🕷️',
                pirateGradient: 'linear-gradient(135deg, #27AE60, #2ECC71)',
                marineGradient: 'linear-gradient(135deg, #E67E22, #D35400)',
                background: 'hunter-exam'
            },
            bleach: {
                name: 'Bleach',
                pirateColor: '#3498DB',
                marineColor: '#8E44AD',
                pirateName: 'Shinigami',
                marineName: 'Hollows',
                pirateIcon: '⚔️',
                marineIcon: '😈',
                piratePieceIcon: '⚔️',
                marinePieceIcon: '👺',
                pirateGradient: 'linear-gradient(135deg, #3498DB, #5DADE2)',
                marineGradient: 'linear-gradient(135deg, #8E44AD, #9B59B6)',
                background: 'soul-society'
            },
            berserk: {
                name: 'Berserk',
                pirateColor: '#2C2C2C',
                marineColor: '#8B0000',
                pirateName: 'Guts',
                marineName: 'Apostles',
                pirateIcon: '⚔️',
                marineIcon: '🩸',
                piratePieceIcon: '⚔️',
                marinePieceIcon: '🩸',
                pirateGradient: 'linear-gradient(135deg, #2C2C2C, #4A4A4A)',
                marineGradient: 'linear-gradient(135deg, #8B0000, #DC143C)',
                background: 'dark-fantasy'
            }
        };

        this.currentTheme = 'onePiece';
        this.customPlayerNames = {
            pirate: null,
            marine: null
        };
        this.loadThemeFromStorage();
    }

    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            const theme = this.themes[themeName];

            // Update CSS variables
            document.documentElement.style.setProperty('--pirate-primary', theme.pirateColor);
            document.documentElement.style.setProperty('--marine-primary', theme.marineColor);
            document.documentElement.style.setProperty('--pirate-shadow', this.hexToRgba(theme.pirateColor, 0.8));
            document.documentElement.style.setProperty('--marine-shadow', this.hexToRgba(theme.marineColor, 0.8));

            // Save to localStorage
            localStorage.setItem('connectfour-theme', themeName);

            // Apply theme-specific background class
            this.applyThemeBackground(theme.background);
        }
    }

    applyThemeBackground(backgroundType) {
        // Remove all theme background classes
        document.body.classList.remove(
            'theme-ocean-pirate', 'theme-ninja-village', 'theme-space-battle',
            'theme-hero-battle', 'theme-demon-night', 'theme-wall-defense',
            'theme-pokemon-arena', 'theme-cursed-realm', 'theme-hunter-exam',
            'theme-soul-society', 'theme-dark-fantasy'
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
        const savedTheme = localStorage.getItem('connectfour-theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme('onePiece');
        }

        // Always load custom player names
        this.loadPlayerNamesFromStorage();
    }

    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }

    getAllThemes() {
        return Object.keys(this.themes).map(key => ({
            id: key,
            ...this.themes[key]
        }));
    }

    setPlayerNames(pirateName, marineName) {
        this.customPlayerNames.pirate = pirateName || null;
        this.customPlayerNames.marine = marineName || null;

        // Save to localStorage
        localStorage.setItem('connectfour-player1-name', pirateName || '');
        localStorage.setItem('connectfour-player2-name', marineName || '');
    }

    getPlayerName(player) {
        // Return custom name if set, otherwise theme default
        if (player === 'pirate') {
            return this.customPlayerNames.pirate || this.themes[this.currentTheme].pirateName;
        } else {
            return this.customPlayerNames.marine || this.themes[this.currentTheme].marineName;
        }
    }

    loadPlayerNamesFromStorage() {
        const pirateName = localStorage.getItem('connectfour-player1-name');
        const marineName = localStorage.getItem('connectfour-player2-name');

        if (pirateName) this.customPlayerNames.pirate = pirateName;
        if (marineName) this.customPlayerNames.marine = marineName;
    }

    // Get piece icon for theme-aware game pieces
    getPieceIcon(player) {
        const theme = this.themes[this.currentTheme];
        return player === 'pirate' ? theme.piratePieceIcon : theme.marinePieceIcon;
    }
}
