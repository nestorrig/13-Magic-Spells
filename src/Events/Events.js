import EventEmitter from "@/utils/EventEmitter";

export const EVENTS = {
  PERCENTAGE_LOADED: "percentageLoaded",
  LOADED: "loaded",
  CHANGE_TEXTURE: "changeTexture",
};

export const observerEmitter = new EventEmitter();
