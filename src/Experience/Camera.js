import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from "gsap";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Camera");
      console.log(this.debug);
    }
    this.setInstance();
    this.setControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    this.instance.position.set(6, 4, 8);
    this.scene.add(this.instance);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.instance.position, "x")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("Camera X")
        .listen();
      this.debugFolder
        .add(this.instance.position, "y")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("Camera Y")
        .listen();
      this.debugFolder
        .add(this.instance.position, "z")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("Camera Z")
        .listen();
    }
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;

    if (this.debug.active) {
      this.debugFolder
        .add(this.controls.target, "x")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("Target X")
        .listen();
      this.debugFolder
        .add(this.controls.target, "y")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("Target Y")
        .listen();
      this.debugFolder
        .add(this.controls.target, "z")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("Target Z")
        .listen();

      this.debugFolder.moveCamera1 = () => {
        this.animateCamera(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, 0),
          2
        );
      };
      this.debugFolder.moveCamera2 = () => {
        this.animateCamera(
          new THREE.Vector3(0, 0, 5),
          new THREE.Vector3(0, 0, 0),
          2
        );
      };
      this.debugFolder.moveCamera3 = () => {
        this.animateCamera(
          new THREE.Vector3(0, 5, 0),
          new THREE.Vector3(0, 0, 0),
          2
        );
      };
      this.debugFolder.moveCamera4 = () => {
        this.animateCamera(
          new THREE.Vector3(5, 0, 0),
          new THREE.Vector3(0, 0, 0),
          2
        );
      };
      this.debugFolder.moveCamera5 = () => {
        this.animateCamera(
          new THREE.Vector3(0, 5, 5),
          new THREE.Vector3(0, 5, 0),
          2
        );
      };
      this.debugFolder.add(this.debugFolder, "moveCamera1");
      this.debugFolder.add(this.debugFolder, "moveCamera2");
      this.debugFolder.add(this.debugFolder, "moveCamera3");
      this.debugFolder.add(this.debugFolder, "moveCamera4");
      this.debugFolder.add(this.debugFolder, "moveCamera5");
    }
  }

  animateCamera(position, target, duration) {
    const initialPosition = position.clone();
    const initialTarget = target.clone();

    gsap.to(this.instance.position, {
      x: initialPosition.x,
      y: initialPosition.y,
      z: initialPosition.z,
      duration: duration,
      onUpdate: () => {
        this.instance.updateProjectionMatrix();
      },
    });

    gsap.to(this.controls.target, {
      x: initialTarget.x,
      y: initialTarget.y,
      z: initialTarget.z,
      duration: duration,
      onUpdate: () => {
        this.controls.update();
      },
    });
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}