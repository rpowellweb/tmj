
export class AudioManager {
  private synthesis: SpeechSynthesis | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  async initialize(): Promise<boolean> {
    if (!this.synthesis) return false;
    
    // Load voices and wait for them to be available
    return new Promise((resolve) => {
      if (this.synthesis!.getVoices().length > 0) {
        this.isInitialized = true;
        resolve(true);
      } else {
        this.synthesis!.addEventListener('voiceschanged', () => {
          this.isInitialized = true;
          resolve(true);
        }, { once: true });
      }
    });
  }

  speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis || !this.isInitialized) {
        reject(new Error('Speech synthesis not available'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice parameters
      utterance.rate = options.rate ?? 0.9;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 0.8;

      // Try to use a clear, natural voice
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Natural') || voice.name.includes('Enhanced') || voice.default)
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  async speakWithDelay(text: string, delayMs: number = 500): Promise<void> {
    await this.speak(text);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isSupported(): boolean {
    return !!(this.synthesis && this.isInitialized);
  }
}

// Singleton instance
export const audioManager = new AudioManager();
