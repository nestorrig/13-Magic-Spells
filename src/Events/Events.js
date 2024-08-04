import EventEmitter from "@/utils/EventEmitter";

export const EVENTS = {
  PERCENTAGE_LOADED: "percentageLoaded",
  LOADED: "loaded",
  INIT_HOME: "initHome",
  INIT_TEXTURE_UI: "initTextureUI",
  CHANGE_TEXTURE: "changeTexture",
  SWITCH_MODE: "switchMode",
};

export const observerEmitter = new EventEmitter();
