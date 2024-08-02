import * as THREE from "three";
import Experience from "../Experience.js";
import gsap from "gsap";

import vertexShader from "@/Shaders/Portal/vertex.glsl";
import fragmentShader from "@/Shaders/Portal/fragment.glsl";

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

      this.debugFolder.animateTeleport = () => {
        this.animateTeleport();
      };
      this.debugFolder.restartAnimation = () => {
        this.restartAnimation();
      };
      this.debugFolder.add(this.debugFolder, "animateTeleport");
      this.debugFolder.add(this.debugFolder, "restartAnimation");
    }

    // Resource
    this.resource = this.resources.items.picnicTableModel;

    this.setModel();
    this.setPortal();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.8, 0.8, 0.8);
    this.model.position.set(0.5, 0, 0.33);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.material.transparent = true;
      }
    });

    if (this.debug.active) {
      this.debug.genaralHelper(this.model, "Picnic Table");
    }
  }

  setPortal() {
    const shape = new THREE.Shape();
    const x = 0,
      y = 0;
    const width = 1.5,
      height = 1.25; // Tamaño del óvalo

    shape.moveTo(x, y - height);
    shape.absellipse(x, y, width, height, 0, Math.PI * 2, false, 0);

    const portalGeometry = new THREE.ShapeGeometry(shape);
    const portalMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() },
      },
    });
    this.portal = new THREE.Mesh(portalGeometry, portalMaterial);
    this.portal.scale.set(0, 0, 0);
    this.portal.rotation.set(0, Math.PI, 0);
    this.portal.position.set(0.5, 0.5, 1.5); // Posición detrás de la mesa
    this.scene.add(this.portal);
    if (this.debug.active) {
      this.debug.genaralHelper(this.portal, "Portal");
    }
  }

  animateTeleport() {
    // Escalar el portal
    gsap.to(this.portal.scale, {
      duration: 1,
      x: 1,
      y: 1,
      ease: "power1.inOut",
      onComplete: () => {
        // Mover la mesa hacia el portal
        gsap.to(this.model.position, {
          duration: 1,
          z: 4,
          ease: "power1.inOut",
          onComplete: () => {
            this.model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.visible = false;
              }
            });
            gsap.to(this.portal.scale, {
              delay: 0.5,
              duration: 1,
              x: 0,
              y: 0,
              ease: "power1.inOut",
            });
          },
        });
      },
    });
  }

  restartAnimation() {
    this.model.position.set(0.5, 0, 0.33);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.visible = true;
      }
    });
  }

  update() {
    // this.animation.mixer.update(this.time.delta * 0.001)
    if (this.portal)
      this.portal.material.uniforms.u_time.value = this.time.elapsed * 0.001;
  }
}
