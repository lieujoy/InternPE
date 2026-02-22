// ===================================
// SOUND MANAGER
// ===================================

class SoundManager {
  constructor() {
    this.sounds = {};
    this.muted = false;
    this.volume = 0.5;
    this.loadSettings();
  }

  // Create simple sound effects using Web Audio API
  init() {
    this.audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
  }

  playPieceDrop() {
    if (this.muted) return;
    this.playTone(200, 0.1, "sine");
  }

  playWin() {
    if (this.muted) return;
    // Victory fanfare
    this.playTone(523, 0.15, "square"); // C
    setTimeout(() => this.playTone(659, 0.15, "square"), 150); // E
    setTimeout(() => this.playTone(784, 0.3, "square"), 300); // G
  }

  playClick() {
    if (this.muted) return;
    this.playTone(800, 0.05, "sine");
  }

  playHover() {
    if (this.muted) return;
    this.playTone(600, 0.03, "sine");
  }

  playError() {
    if (this.muted) return;
    this.playTone(150, 0.2, "sawtooth");
  }

  playTone(frequency, duration, type = "sine") {
    if (!this.audioContext) this.init();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration,
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem("connectfour-volume", this.volume);
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("connectfour-muted", this.muted);
    return this.muted;
  }

  loadSettings() {
    const savedVolume = localStorage.getItem("connectfour-volume");
    const savedMuted = localStorage.getItem("connectfour-muted");

    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }

    if (savedMuted !== null) {
      this.muted = savedMuted === "true";
    }
  }

  isMuted() {
    return this.muted;
  }

  getVolume() {
    return this.volume;
  }
}
