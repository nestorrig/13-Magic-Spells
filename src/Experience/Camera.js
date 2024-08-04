import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from "gsap";
import { EVENTS, observerEmitter } from "../Events/Events.js";

const cameraPlaces = {
  center: {
    position: new THREE.Vector3(0, 0, 0),
    target: new THREE.Vector3(0, 0, 0),
    duration: 2,
  },
  initial: {
    position: new THREE.Vector3(1.306, 3.359, -6.016),
    target: new THREE.Vector3(0, 2.6, -7),
    duration: 2,
  },
  reset: {
    position: new THREE.Vector3(-0.292, 3.154, -5.368),
    target: new THREE.Vector3(-0.058, 2.733, -6.72),
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
    position: new THREE.Vector3(2.293, 0.897, -3.722),
    target: new THREE.Vector3(2.739, 0.6499, 0.943),
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
    this.cameraEvents();
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
    this.controls.target.set(0, 2.6, -7);
    this.controls.enablePan = false;
    this.controls.enableRotate = false;
    this.controls.maxDistance = 7;
    this.controls.minDistance = 0.5;

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
      this.debugFolder.resetCamera = () => {
        this.animateCamera(
          cameraPlaces.reset.position,
          cameraPlaces.reset.target,
          cameraPlaces.reset.duration
        );
      };

      this.debugFolder.add(this.debugFolder, "resetCamera");
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
    this.controls.enabled = false;
    observerEmitter.trigger(EVENTS.AUDIO.PLAY_EFFECT, ["camera"]);
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
      onComplete: () => {
        this.controls.enabled = true;
      },
    });
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  cameraEvents() {
    observerEmitter.on(EVENTS.CAMERA_MOVES.MOVE_TO_HOME, () => {
      this.animateCamera(
        cameraPlaces.initial.position,
        cameraPlaces.initial.target,
        cameraPlaces.initial.duration
      );
    });
    observerEmitter.on(EVENTS.CAMERA_MOVES.MOVE_TO_GENERAL, (delay) => {
      setTimeout(() => {
        this.animateCamera(
          cameraPlaces.top.position,
          cameraPlaces.top.target,
          cameraPlaces.top.duration
        );
      }, delay * 1000);
    });
    observerEmitter.on(EVENTS.CAMERA_MOVES.MOVE_TO_TABLE, () => {
      this.animateCamera(
        cameraPlaces.topTable.position,
        cameraPlaces.topTable.target,
        cameraPlaces.topTable.duration
      );
      setTimeout(() => {
        this.experience.world.table.animateTeleport();
      }, cameraPlaces.topTable.duration * 1000);
    });
    observerEmitter.on(EVENTS.CAMERA_MOVES.MOVE_TO_TREES, () => {
      this.animateCamera(
        cameraPlaces.topTree.position,
        cameraPlaces.topTree.target,
        cameraPlaces.topTree.duration
      );
      setTimeout(() => {
        this.experience.world.tree.animateScale();
      }, cameraPlaces.topTree.duration * 1000);
    });
    observerEmitter.on(EVENTS.CAMERA_MOVES.MOVE_TO_ROCKS, () => {
      this.animateCamera(
        cameraPlaces.topRocks.position,
        cameraPlaces.topRocks.target,
        cameraPlaces.topRocks.duration
      );
      setTimeout(() => {
        this.experience.world.rocks.animateLevitate();
      }, cameraPlaces.topRocks.duration * 1000);
    });
  }

  update() {
    this.controls.update();
  }
}