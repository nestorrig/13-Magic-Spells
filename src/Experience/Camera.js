import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from "gsap";

const cameraPlaces = {
  center: {
    position: new THREE.Vector3(0, 0, 0),
    target: new THREE.Vector3(0, 0, 0),
    duration: 2,
  },
  initial: {
    position: new THREE.Vector3(1.306, 3.359, -6.016),
    target: new THREE.Vector3(0.067, 2.688, -6.948),
    duration: 2,
  },
  top: {
    position: new THREE.Vector3(-0.4673, 3.4236, -9.403),
    target: new THREE.Vector3(-0.247, 2.62, -6.67),
    duration: 2,
    // position: new THREE.Vector3(-0.1317, 3.23, -9.2),
    // target: new THREE.Vector3(-0.247, 2.62, -6.67),
    // duration: 2,
  },
  topTree: {
    position: new THREE.Vector3(0.9113, 4.7316, -5.098),
    target: new THREE.Vector3(2.019, 1.35, 1.887),
    duration: 2,
  },
  topTable: {
    position: new THREE.Vector3(0.4873, 2.4733, -5.6239),
    target: new THREE.Vector3(0.5, -0.1501, 1.6),
    duration: 2,
  },
  topRocks: {
    position: new THREE.Vector3(-2.3564, 3.1795, -2.3481),
    target: new THREE.Vector3(-1.3, 0.718, 1.711),
    duration: 2,
  },
};

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Camera");
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
    this.instance.position.set(1.306, 3.359, -6.016);
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
    this.controls.target.set(0.067, 2.688, -6.948);
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
          cameraPlaces.center.position,
          cameraPlaces.center.target,
          cameraPlaces.center.duration
        );
      };
      this.debugFolder.moveCamera2 = () => {
        this.animateCamera(
          cameraPlaces.initial.position,
          cameraPlaces.initial.target,
          cameraPlaces.initial.duration
        );
      };
      this.debugFolder.moveCamera3 = () => {
        this.animateCamera(
          cameraPlaces.top.position,
          cameraPlaces.top.target,
          cameraPlaces.top.duration
        );
      };
      this.debugFolder.moveCamera4 = () => {
        this.animateCamera(
          cameraPlaces.topTree.position,
          cameraPlaces.topTree.target,
          cameraPlaces.topTree.duration
        );
      };
      this.debugFolder.moveCamera5 = () => {
        this.animateCamera(
          cameraPlaces.topTable.position,
          cameraPlaces.topTable.target,
          cameraPlaces.topTable.duration
        );
      };
      this.debugFolder.moveCamera6 = () => {
        this.animateCamera(
          cameraPlaces.topRocks.position,
          cameraPlaces.topRocks.target,
          cameraPlaces.topRocks.duration
        );
      };
      this.debugFolder.add(this.debugFolder, "moveCamera1");
      this.debugFolder.add(this.debugFolder, "moveCamera2");
      this.debugFolder.add(this.debugFolder, "moveCamera3");
      this.debugFolder.add(this.debugFolder, "moveCamera4");
      this.debugFolder.add(this.debugFolder, "moveCamera5");
      this.debugFolder.add(this.debugFolder, "moveCamera6");
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