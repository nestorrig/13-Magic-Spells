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

    this.setTextures();
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
    this.magicWand = new THREE.Mesh(this.geometry, this.material);
    this.magicWand.castShadow = true;

    this.magicWand.position.set(0, 0.5, 0);
    this.scene.add(this.magicWand);

    // Debug
    if (this.debug.active) {
      this.debug.genaralHelper(this.magicWand, "magicWand");
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

      this.debugFolder.changeTexture = () => this.changeTexture();
      this.debugFolder.add(this.debugFolder, "changeTexture");
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

  setTextures() {
    this.textures = {};
    console.log(this.resources.items);
    this.textures.color = this.resources.items.woodTableColorTexture;

    this.textures.normal = this.resources.items.woodTableNormalTexture;

    this.textures.displacement =
      this.resources.items.woodTableDisplacementTexture;

    this.textures.ARM = this.resources.items.woodTableARMTexture;

    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
      aoMap: this.textures.ARM,
      roughnessMap: this.textures.ARM,
      metalnessMap: this.textures.ARM,
    });
  }

  changeTexture() {
    this.magicWand.material.map = this.resources.items.rosewoodVeneerColorTexture;
    this.magicWand.material.normalMap = this.resources.items.rosewoodVeneerNormalTexture;
    this.magicWand.material.aoMap = this.resources.items.rosewoodVeneerARMTexture;
    this.magicWand.material.roughnessMap = this.resources.items.rosewoodVeneerARMTexture;
    this.magicWand.material.metalnessMap = this.resources.items.rosewoodVeneerARMTexture;
  }

  update() {
    if (this.animation.mixer) {
      this.animation.mixer.update(this.time.delta * 0.001);
    }
  }
}
