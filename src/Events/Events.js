import EventEmitter from "@/utils/EventEmitter";

export const EVENTS = {
  PERCENTAGE_LOADED: "percentageLoaded",
  LOADED: "loaded",
  INIT_HOME: "initHome",
  INIT_TEXTURE_UI: "initTextureUI",
  CHANGE_TEXTURE: "changeTexture",
  SWITCH_MODE: "switchMode",
  ANIMATE_SPELL: "animateSpell",
  RESTART_ANIMATIONS: "restartAnimations",
  DISABLE_ALL_BUTTONS: "disableAllButtons",
  ENABLE_MODE_BUTTON: "enableModeButton",
  CAMERA_MOVES: {
    MOVE_TO_HOME: "moveToHome",
    MOVE_TO_GENERAL: "moveToGeneral",
    MOVE_TO_TABLE: "moveToTable",
    MOVE_TO_TREES: "moveToTrees",
    MOVE_TO_ROCKS: "moveToRocks",
    MOVE_TO_WAND: "moveToWand",
    RESET_ANIMATIONS_CAMERA: "resetAnimationsCamera",
  },
  AUDIO: {
    AMBIENT: "ambient",
    PLAY_EFFECT: "playEffect",
    EFFECTS: "effects",
  },
};

export const observerEmitter = new EventEmitter();
