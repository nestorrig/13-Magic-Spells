import * as THREE from "three";
import Experience from "../Experience.js";

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

  update() {
    // this.animation.mixer.update(this.time.delta * 0.001)
  }
}
