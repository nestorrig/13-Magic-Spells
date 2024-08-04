import * as THREE from "three";
import Experience from "../Experience.js";
import gsap from "gsap";
import { EVENTS, observerEmitter } from "@/Events/Events.js";

export default class Tree {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("fox");

      this.debugFolder.animateScale = () => {
        this.animateScale(0.4);
      };
      this.debugFolder.restartAnimation = () => {
        this.restartAnimation();
      };
      this.debugFolder.add(this.debugFolder, "restartAnimation");
      this.debugFolder.add(this.debugFolder, "animateScale");
    }

    // Resource
    this.resource = this.resources.items.treeModel;

    this.setModel();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(2, 2, 2);
    this.model.position.set(2, -0.1, 1);
    this.scene.add(this.model);

    this.originalScales = {};

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
      if (child instanceof THREE.Group) {
        // Guarda la escala original de los hijos
        this.originalScales[child.name] = child.scale.clone();

        switch (child.name) {
          case "pine_sapling_small_a":
            break;
          case "pine_sapling_small_b":
            child.position.set(0.7, 0, 0);
            break;
          case "pine_sapling_small_c":
            child.position.set(0.375, 0, -0.5);
            break;
          default:
            break;
        }
      }
    });

    if (this.debug.active) {
      this.debug.genaralHelper(this.model, "Tree");
    }
  }

  animateScale(newScale = 0.4) {
    observerEmitter.trigger(EVENTS.AUDIO.PLAY_EFFECT, ["trees"]);
    this.model.traverse((child) => {
      if (child instanceof THREE.Group) {
        switch (child.name) {
          case "pine_sapling_small_a":
          case "pine_sapling_small_b":
          case "pine_sapling_small_c":
            gsap.to(child.scale, {
              duration: 1,
              x: newScale,
              y: newScale,
              z: newScale,
              ease: "elastic.out(1, 0.3)",
              onComplete: () => {
                observerEmitter.trigger(EVENTS.CAMERA_MOVES.MOVE_TO_GENERAL);
                observerEmitter.trigger(EVENTS.DISABLE_ALL_BUTTONS);
              },
            });
            break;
          default:
            break;
        }
      }
    });
  }

  restartAnimation() {
    this.model.traverse((child) => {
      if (child instanceof THREE.Group) {
        if (this.originalScales[child.name]) {
          const originalScale = this.originalScales[child.name];
          child.scale.set(originalScale.x, originalScale.y, originalScale.z);
        }
      }
    });
  }

  update() {
    // this.animation.mixer.update(this.time.delta * 0.001)
  }
}
