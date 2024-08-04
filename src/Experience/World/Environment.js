import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from "gsap";

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
    this.setPointLight();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 1.5);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(0.38, 2, -0.75);
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

  setPointLight() {
    this.pointLight = new THREE.PointLight("#737373", 1, 7, 2);
    // this.pointLight = new THREE.PointLight("#FFAF00", 1, 7, 2);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.camera.far = 7;
    this.pointLight.shadow.mapSize.set(1024, 1024);
    this.pointLight.shadow.normalBias = 0.05;
    this.pointLight.position.set(-0.07, 3, -6.57);

    this.pointLightHelper = new THREE.PointLightHelper(this.pointLight, 0.1);
    // this.scene.add(this.pointLightHelper);

    this.scene.add(this.pointLight);

    // Debug

    if (this.debug.active) {
      this.debugFolder
        .add(this.pointLight, "intensity")
        .name("pointLightIntensity")
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.pointLight.position, "x")
        .name("pointLightX")
        .min(-10)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.pointLight.position, "y")
        .name("pointLightY")
        .min(-10)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.pointLight.position, "z")
        .name("pointLightZ")
        .min(-10)
        .max(10)
        .step(0.001);
    }
  }

  animateLightColor(light, startColor, endColor, duration) {
    const colorObject = { r: startColor.r, g: startColor.g, b: startColor.b };

    gsap.to(colorObject, {
      r: endColor.r,
      g: endColor.g,
      b: endColor.b,
      duration,
      onUpdate: () => {
        light.color.setRGB(colorObject.r, colorObject.g, colorObject.b);
      },
    });
  }

  animatePointLightToWarm() {
    this.animateLightColor(
      this.pointLight,
      new THREE.Color(0xffffff),
      new THREE.Color(0xffaf00),
      1.5
    );
  }

  animatePointLightToCool() {
    this.animateLightColor(
      this.pointLight,
      new THREE.Color(0xffaf00),
      new THREE.Color(0x737373),
      1.5
    );
  }

  update() {}
}