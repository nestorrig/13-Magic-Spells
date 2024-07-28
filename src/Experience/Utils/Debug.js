import GUI from "lil-gui";

export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.ui = new GUI();
    }
  }

  genaralHelper(mesh, name) {
    if (this.active) {
      const folder = this.ui.addFolder(`${name} general debug`);
      folder.add(mesh.position, "x").min(-10).max(10).step(0.01);
      folder.add(mesh.position, "y").min(-10).max(10).step(0.01);
      folder.add(mesh.position, "z").min(-10).max(10).step(0.01);
      folder.add(mesh.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01);
      folder.add(mesh.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01);
      folder.add(mesh.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01);
      folder.add(mesh.scale, "x").min(0).max(10).step(0.01);
      folder.add(mesh.scale, "y").min(0).max(10).step(0.01);
      folder.add(mesh.scale, "z").min(0).max(10).step(0.01);
    }
  }
}
