import * as THREE from "three";
import Experience from "../Experience.js";

export default class Table {
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
    this.resource = this.resources.items.picnicTableModel;

    this.setModel();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.8, 0.8, 0.8);
    this.model.position.set(0.5, 0, 1.1);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });

    if (this.debug.active) {
      this.debug.genaralHelper(this.model, "Picnic Table");
    }
  }

  update() {
    // this.animation.mixer.update(this.time.delta * 0.001)
  }
}
