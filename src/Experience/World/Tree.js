import * as THREE from "three";
import Experience from "../Experience.js";
import gsap from "gsap";

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
        this.animateScale(0.2);
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
    // this.model.scale.set(0., 0., 0.);
    this.model.position.set(2, -0.1, 1);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });

    if (this.debug.active) {
      this.debug.genaralHelper(this.model, "Tree");
    }
  }

  animateScale(newScale) {
    gsap.to(this.model.scale, {
      duration: 1,
      x: newScale,
      y: newScale,
      z: newScale,
      ease: "elastic.out(1, 0.3)",
    });
    gsap.to(this.model.position, {
      duration: 1,
      y: 0.05,
    });
  }

  restartAnimation() {
    this.model.scale.set(1, 1, 1);
    this.model.position.set(2, -0.1, 1);
  }

  update() {
    // this.animation.mixer.update(this.time.delta * 0.001)
  }
}
