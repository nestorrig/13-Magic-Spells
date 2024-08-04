import { Howl, Howler } from "howler";
import { EVENTS, observerEmitter } from "@/Events/Events.js";

export default class AudioController {
  constructor() {
    this.ambientMusic = new Howl({
      src: ["/audio/background.mp3"],
      loop: true,
      volume: 0.5,
      onload: () => {
        console.log("Audio loaded");
      },
    });

    this.soundEffects = {
      camera: new Howl({ src: ["/audio/cameraMove.mp3"], volume: 1.0 }),
      table: new Howl({ src: ["/audio/portal.mp3"], volume: 1.0 }),
      rocks: new Howl({ src: ["/audio/rock.mp3"], volume: 0.6 }),
      trees: new Howl({ src: ["/audio/trees.mp3"], volume: 1.0 }),
      texture: new Howl({ src: ["/audio/texture.mp3"], volume: 1.0 }),
      reset: new Howl({ src: ["/audio/reset.mp3"], volume: 1.0 }),
    };

    this.isMuted = false;
    this.isEffectsMuted = false;
    this.setEventListeners();
  }

  startAmbientMusic() {
    this.ambientMusic.play();
  }

  stopAmbientMusic() {
    this.ambientMusic.pause();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
  }

  playSoundEffect(effectName) {
    if (this.isEffectsMuted) return;
    if (this.soundEffects[effectName]) {
      this.soundEffects[effectName].play();
    } else {
      console.error(`Sound effect "${effectName}" not found.`);
    }
  }

  setEventListeners() {
    // Agrega los eventos necesarios para controlar el audio
    observerEmitter.on(EVENTS.AUDIO.AMBIENT, (state = true) => {
      if (state) {
        this.startAmbientMusic();
      } else {
        this.stopAmbientMusic();
      }
    });
    observerEmitter.on(EVENTS.AUDIO.EFFECTS, () => {
      this.isEffectsMuted = !this.isEffectsMuted;
    });
    observerEmitter.on(EVENTS.AUDIO.PLAY_EFFECT, (effect) => {
      this.playSoundEffect(effect);
    });
  }
}

