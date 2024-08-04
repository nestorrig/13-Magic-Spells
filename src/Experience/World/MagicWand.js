import * as THREE from "three";
import Experience from "../Experience.js";
import { EVENTS, observerEmitter } from "@/Events/Events";
import gsap from "gsap";

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
    this.changeTextureEvent();
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

    this.magicWand.position.set(0, 4, -7);
    this.scene.add(this.magicWand);

    // Debug
    if (this.debug.active) {
      this.debug.genaralHelper(this.magicWand, "magicWand");

      this.debugFolder.animateSpell = () => {
        this.animateSpell();
      };
      this.debugFolder.add(this.debugFolder, "animateSpell");
    }
  }

  setAnimation() {
    this.animation = {};
  }

  setTextures() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.resources.items.woodTableColorTexture,
      normalMap: this.resources.items.woodTableNormalTexture,
      aoMap: this.resources.items.woodTableARMTexture,
      roughnessMap: this.resources.items.woodTableARMTexture,
      metalnessMap: this.resources.items.woodTableARMTexture,
    });
  }

  changeTextureEvent() {
    //INIT_HOME
    observerEmitter.on(EVENTS.INIT_HOME, () => {      
      this.animateInitHome();
    });

    // CHANGE_TEXTURE
    observerEmitter.on(EVENTS.CHANGE_TEXTURE, (texture) => {
      this.animationScale();
      switch (texture) {
        case "Texture 1":
          this.magicWand.material.map =
            this.resources.items.woodTableColorTexture;
          this.magicWand.material.normalMap =
            this.resources.items.woodTableNormalTexture;
          this.magicWand.material.aoMap =
            this.resources.items.woodTableARMTexture;
          this.magicWand.material.roughnessMap =
            this.resources.items.woodTableARMTexture;
          this.magicWand.material.metalnessMap =
            this.resources.items.woodTableARMTexture;
          break;
        case "Texture 2":
          this.magicWand.material.map =
            this.resources.items.fineGrainedWoodColorTexture;
          this.magicWand.material.normalMap =
            this.resources.items.fineGrainedWoodNormalTexture;
          this.magicWand.material.aoMap =
            this.resources.items.fineGrainedWoodARMTexture;
          this.magicWand.material.roughnessMap =
            this.resources.items.fineGrainedWoodARMTexture;
          this.magicWand.material.metalnessMap =
            this.resources.items.fineGrainedWoodARMTexture;
          break;
        case "Texture 3":
          this.magicWand.material.map =
            this.resources.items.rosewoodVeneerColorTexture;
          this.magicWand.material.normalMap =
            this.resources.items.rosewoodVeneerNormalTexture;
          this.magicWand.material.aoMap =
            this.resources.items.rosewoodVeneerARMTexture;
          this.magicWand.material.roughnessMap =
            this.resources.items.rosewoodVeneerARMTexture;
          this.magicWand.material.metalnessMap =
            this.resources.items.rosewoodVeneerARMTexture;
          break;
        case "Texture 4":
          this.magicWand.material.map =
            this.resources.items.beigeWallColorTexture;
          this.magicWand.material.normalMap =
            this.resources.items.beigeWallNormalTexture;
          this.magicWand.material.aoMap =
            this.resources.items.beigeWallARMTexture;
          this.magicWand.material.roughnessMap =
            this.resources.items.beigeWallARMTexture;
          this.magicWand.material.metalnessMap =
            this.resources.items.beigeWallARMTexture;
          break;
        case "Texture 5":
          this.magicWand.material.map =
            this.resources.items.leatherRedColorTexture;
          this.magicWand.material.normalMap =
            this.resources.items.leatherRedNormalTexture;
          this.magicWand.material.aoMap =
            this.resources.items.leatherRedARMTexture;
          this.magicWand.material.roughnessMap =
            this.resources.items.leatherRedARMTexture;
          this.magicWand.material.metalnessMap =
            this.resources.items.leatherRedARMTexture;
          break;

        default:
          break;
      }
    });
  }

  animationScale() {
    gsap.fromTo(
      this.magicWand.scale,
      {
        x: 0.1,
        y: 0.1,
        z: 0.1,
      },
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      }
    );
  }
  animateSpell() {
    gsap.fromTo(
      this.magicWand.rotation,
      {
        x: 0,
      },
      {
        x: 1.6,

        duration: 1,
        ease: "elastic.out(1, 0.5)",
      }
    );
    gsap.to(this.magicWand.rotation, {
      x: 0,
      duration: 1,
      delay: 0.7,
      ease: "elastic.out(1, 0.5)",
    });
  }

  animateInitHome() {
    gsap.to(this.magicWand.position, {
      delay: 0.5,
      y: 2.6,
      duration: 1.5,
    });
  }

  update() {
    if (this.animation.mixer) {
      this.animation.mixer.update(this.time.delta * 0.001);
    }
  }
}
