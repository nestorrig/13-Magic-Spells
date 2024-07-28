import * as THREE from 'three'
import Experience from './Experience.js'
import WebGPURenderer from "three/examples/jsm/renderers/webgpu/WebGPURenderer.js";
import { color, rangeFog, uniform } from "three/examples/jsm/nodes/Nodes.js";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setInstance();
  }

  setInstance() {
    this.instance = new WebGPURenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setClearColor("#211d20");
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    // const colorBackUniform = uniform(color("#19191f"));
    // this.scene.fogNode = rangeFog(colorBackUniform, 5, 30);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.renderAsync(this.scene, this.camera.instance);
  }
}