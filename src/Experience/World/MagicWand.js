import * as THREE from "three";
import Experience from "../Experience.js";

export default class MagicWand {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.debugObject = {
      radiusTop: 0.02,
      radiusBottom: 0.03,
      height: 1,
      radialSegments: 64,
      heightSegments: 64,
    };

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("MagicWand");
    }

    this.setWand();
    this.setAnimation();
  }

  setWand() {
    this.geometry = new THREE.CylinderGeometry(
      this.debugObject.radiusTop,
      this.debugObject.radiusBottom,
      this.debugObject.height,
      this.debugObject.radialSegments,
      this.debugObject.heightSegments
    );
    this.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    this.magicWand = new THREE.Mesh(this.geometry, this.material);
    this.magicWand.castShadow = true;

    this.magicWand.position.set(0, 0.5, 0);
    this.scene.add(this.magicWand);

    // Debug
    if (this.debug.active) {
      // this.debug.genaralHelper(this.magicWand, "magicWand");
      this.debugFolder
        .add(this.debugObject, "radiusTop")
        .min(0.01)
        .max(1)
        .step(0.01)
        .name("Radius Top")
        .onChange(() => this.updateGeometry());
      this.debugFolder
        .add(this.debugObject, "radiusBottom")
        .min(0.01)
        .max(1)
        .step(0.01)
        .name("Radius Bottom")
        .onChange(() => this.updateGeometry());
      this.debugFolder
        .add(this.debugObject, "height")
        .min(1)
        .max(10)
        .step(0.01)
        .name("Height")
        .onChange(() => this.updateGeometry());
      this.debugFolder
        .add(this.debugObject, "radialSegments")
        .min(3)
        .max(64)
        .step(1)
        .name("Radial Segments")
        .onChange(() => this.updateGeometry());
      this.debugFolder
        .add(this.debugObject, "heightSegments")
        .min(1)
        .max(64)
        .step(1)
        .name("Height Segments")
        .onChange(() => this.updateGeometry());
    }
  }

  updateGeometry() {
    console.log("Updating geometry");

    // Dispose the old geometry
    this.magicWand.geometry.dispose();

    // Create the new geometry
    const newGeometry = new THREE.CylinderGeometry(
      this.debugObject.radiusTop,
      this.debugObject.radiusBottom,
      this.debugObject.height,
      this.debugObject.radialSegments,
      this.debugObject.heightSegments
    );

    // Update the mesh geometry
    this.magicWand.geometry = newGeometry;

    // If necessary, update other properties or add/remove the mesh from the scene
    this.scene.remove(this.magicWand);
    this.magicWand = new THREE.Mesh(newGeometry, this.material);
    this.scene.add(this.magicWand);
  }

  setAnimation() {
    this.animation = {};
  }

  update() {
    if (this.animation.mixer) {
      this.animation.mixer.update(this.time.delta * 0.001);
    }
  }
}
