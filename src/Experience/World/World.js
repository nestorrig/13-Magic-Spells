import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import MagicWand from "./MagicWand.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.environment = new Environment();
      this.MagicWand = new MagicWand();
    });
  }

  update() {
    // if(this.fox)
    // this.fox.update()
  }
}