import EventEmitter from "@/utils/EventEmitter";

export const EVENTS = {
  LOADED: "loaded",
};

export const observerEmitter = new EventEmitter();
