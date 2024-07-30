import * as THREE from 'three'
import Experience from "../Experience.js";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
  }

  setTextures() {
    this.textures = {};
    console.log(this.resources.items);
    this.textures.color = this.resources.items.floorColorTexture;
    // this.textures.color.colorSpace = THREE.SRGBColorSpace;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.resources.items.floorNormalTexture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;

    this.textures.displacement = this.resources.items.floorDisplacementTexture;
    this.textures.displacement.repeat.set(1.5, 1.5);
    this.textures.displacement.wrapS = THREE.RepeatWrapping;
    this.textures.displacement.wrapT = THREE.RepeatWrapping;

    this.textures.ARM = this.resources.items.floorARMTexture;
    this.textures.ARM.repeat.set(1.5, 1.5);
    this.textures.ARM.wrapS = THREE.RepeatWrapping;
    this.textures.ARM.wrapT = THREE.RepeatWrapping;

    this.textures.alpha = this.resources.items.floorAlphaTexture;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      alphaMap: this.textures.alpha,
      transparent: true,
      map: this.textures.color,
      normalMap: this.textures.normal,
      displacementMap: this.textures.displacement,
      displacementScale: 0.3,
      displacementBias: -0.05,
      aoMap: this.textures.ARM,
      roughnessMap: this.textures.ARM,
      metalnessMap: this.textures.ARM,
    });

    // debug
    if (this.experience.debug.active) {
      this.debugFolder = this.experience.debug.ui.addFolder("floor");

      this.debugFolder.add(this.material, "wireframe");
      this.debugFolder
        .add(this.material, "displacementScale")
        .min(0)
        .max(1)
        .step(0.001);
      this.debugFolder
        .add(this.material, "displacementBias")
        .min(-1)
        .max(1)
        .step(0.001);
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}