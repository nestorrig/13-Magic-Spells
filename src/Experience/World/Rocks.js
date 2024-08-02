import * as THREE from "three";
import Experience from "../Experience.js";
import gsap from "gsap";

export default class Rocks {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.animationState = false;
    this.rocks = []; // Array para almacenar las rocas
    this.originalPositions = []; // Array para almacenar las posiciones originales
    this.originalRotations = []; // Array para almacenar las rotaciones originales
    this.animations = []; // Array para almacenar las animaciones activas

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("rocks");

      this.debugFolder.animateLevitate = () => {
        this.animationState = !this.animationState;
        if (this.animationState) {
          this.animateLevitate();
        } else {
          this.resetAnimation();
        }
      };
      this.debugFolder.add(this.debugFolder, "animateLevitate");
    }

    // Resource
    this.resource = this.resources.items.rocksModel;

    this.setModel();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.2, 0.2, 0.2);
    this.model.position.set(-1.3, 0.12, 1.36);
    this.model.rotation.set(0, 1.86, 0);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        this.rocks.push(child); // Añadir la roca al array
        this.originalPositions.push(child.position.clone()); // Guardar la posición original
        this.originalRotations.push(child.rotation.clone()); // Guardar la rotación original
      }
    });

    if (this.debug.active) {
      this.debug.genaralHelper(this.model, "Rocks");
    }
  }

  animateLevitate() {
    this.rocks.forEach((rock) => {
      const durationRotation = Math.random() * (6 - 2.5) + 2.5;
      const durationYoyo = Math.random() * (2.5 - 1) + 1;
      const randomHeight = Math.random() * (6 - 4) + 4;

      const positionTween = gsap.to(rock.position, {
        duration: 2,
        y: randomHeight,
        ease: "sine.inOut",
        onComplete: () => {
          const loopTween = gsap.to(rock.position, {
            duration: durationYoyo,
            y: randomHeight - (Math.random() * 1 + 0.5),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
          this.animations.push(loopTween);
        },
      });

      const rotationTween = gsap.to(rock.rotation, {
        duration: durationRotation,
        x: "+=" + Math.PI * 2,
        y: "+=" + Math.PI * 2,
        z: "+=" + Math.PI * 2,
        repeat: -1,
        ease: "none",
      });

      this.animations.push(positionTween, rotationTween);
    });
  }

  resetAnimation() {
    // Detener todas las animaciones activas
    this.animations.forEach((animation) => {
      animation.kill();
    });
    this.animations = [];

    // Restablecer las posiciones y rotaciones originales
    this.rocks.forEach((rock, index) => {
      rock.position.copy(this.originalPositions[index]);
      rock.rotation.copy(this.originalRotations[index]);
    });
  }

  update() {
    // No necesitamos hacer nada aquí para esta animación
  }
}
