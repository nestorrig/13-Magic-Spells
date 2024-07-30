import * as THREE from 'three'
import Experience from '../Experience.js'
import { Sky } from "three/examples/jsm/Addons.js";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.renderer = this.experience.renderer.instance;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }

    this.setSunLight();
    this.setAmbientLight();
    this.setSky();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 1);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(-1.36, 2, -1.25);
    this.scene.add(this.sunLight);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.sunLight, "intensity")
        .name("sunLightIntensity")
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "x")
        .name("sunLightX")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "y")
        .name("sunLightY")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "z")
        .name("sunLightZ")
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight("#737373", 3);
    this.scene.add(this.ambientLight);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.ambientLight, "intensity")
        .name("ambientLightIntensity")
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .addColor({ color: this.ambientLight.color.getHex() }, "color")
        .name("ambientLightColor")
        .onChange((color) => {
          this.ambientLight.color.set(color);
        });
    }
  }

  setSky() {
    this.sky = new Sky();
    this.sky.scale.setScalar(450000);
    this.scene.add(this.sky);

    this.sun = new THREE.Vector3();

    this.effectController = {
      turbidity: 5.2,
      rayleigh: 4,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
      elevation: 0.7,
      azimuth: 9.9,
      //   exposure: this.renderer.toneMappingExposure,
    };

    const guiChanged = () => {
      const uniforms = this.sky.material.uniforms;
      uniforms["turbidity"].value = this.effectController.turbidity;
      uniforms["rayleigh"].value = this.effectController.rayleigh;
      uniforms["mieCoefficient"].value = this.effectController.mieCoefficient;
      uniforms["mieDirectionalG"].value = this.effectController.mieDirectionalG;

      const phi = THREE.MathUtils.degToRad(
        90 - this.effectController.elevation
      );
      const theta = THREE.MathUtils.degToRad(this.effectController.azimuth);

      this.sun.setFromSphericalCoords(1, phi, theta);

      uniforms["sunPosition"].value.copy(this.sun);

      //   this.renderer.toneMappingExposure = this.effectController.exposure;
      //   this.renderer.render(this.scene, this.camera);
    };
    if (this.debug.active) {
      this.debugFolder
        .add(this.effectController, "turbidity", 0.0, 20.0, 0.1)
        .onChange(guiChanged);
      this.debugFolder
        .add(this.effectController, "rayleigh", 0.0, 4, 0.001)
        .onChange(guiChanged);
      this.debugFolder
        .add(this.effectController, "mieCoefficient", 0.0, 0.1, 0.001)
        .onChange(guiChanged);
      this.debugFolder
        .add(this.effectController, "mieDirectionalG", 0.0, 1, 0.001)
        .onChange(guiChanged);
      this.debugFolder
        .add(this.effectController, "elevation", 0, 90, 0.1)
        .onChange(guiChanged);
      this.debugFolder
        .add(this.effectController, "azimuth", -180, 180, 0.1)
        .onChange(guiChanged);
      //   this.debugFolder
      //     .add(this.effectController, "exposure", 0, 1, 0.0001)
      //     .onChange(guiChanged);

      guiChanged();
    }
  }
  update() {
    // console.log(this.starsMaterial.uniforms.time.value);
    this.starsMaterial.uniforms.time.value += 0.01;
  }
}