import EventEmitter from "@/utils/EventEmitter";

export const EVENTS = {
  LOADED: "loaded",
  CHANGE_TEXTURE: "changeTexture",
};

export const observerEmitter = new EventEmitter();
