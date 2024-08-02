import * as THREE from "three";
import Experience from "../Experience.js";
import gsap from "gsap";

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
    const portalGeometry = new THREE.PlaneGeometry(2.5, 1.5);
    const portalMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
    });
    this.portal = new THREE.Mesh(portalGeometry, portalMaterial);
    this.portal.scale.set(0, 0, 0);
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
  }
}
