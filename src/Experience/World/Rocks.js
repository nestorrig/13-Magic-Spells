import * as THREE from "three";
import Experience from "../Experience.js";

export default class Rocks {
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
      }
    });

    if (this.debug.active) {
      this.debug.genaralHelper(this.model, "Rocks");
    }
  }

  update() {
    // this.animation.mixer.update(this.time.delta * 0.001)
  }
}
