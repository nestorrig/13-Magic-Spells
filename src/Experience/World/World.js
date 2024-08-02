import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import MagicWand from "./MagicWand.js";
import Rocks from "./Rocks.js";
import Table from "./Table.js";
import Tree from "./Tree.js";

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
      this.tree = new Tree();
      this.rocks = new Rocks();
      this.table = new Table();
    });
  }

  update() {
    // if(this.fox)
    // this.fox.update()
    if (this.rocks) this.rocks.update();
  }
}