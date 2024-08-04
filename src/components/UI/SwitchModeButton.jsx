import { EVENTS, observerEmitter } from "@/Events/Events";
import gsap from "gsap";
import { useEffect, useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { GiReturnArrow } from "react-icons/gi";

export const SwitchModeButton = () => {
  const [isMagicMode, setIsMagicMode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const handleInitTextures = () => {
      gsap.to(".Mode-button", {
        x: 0,
        opacity: 1,
      });
    };
    const handleEnableButton = () => {
      setIsDisabled(false);
    };
    const handleDisableButton = () => {
      setIsDisabled(true);
    };
    observerEmitter.on(EVENTS.DISABLE_ALL_BUTTONS, handleEnableButton);
    observerEmitter.on(EVENTS.ENABLE_MODE_BUTTON, handleDisableButton);
    observerEmitter.on(EVENTS.INIT_TEXTURE_UI, handleInitTextures);
    return () => {
      observerEmitter.on(EVENTS.DISABLE_ALL_BUTTONS, handleEnableButton);
      observerEmitter.on(EVENTS.ENABLE_MODE_BUTTON, handleDisableButton);
      observerEmitter.off(EVENTS.INIT_TEXTURE_UI, handleInitTextures);
    };
  }, []);

  const handleButtonClick = () => {
    observerEmitter.trigger(EVENTS.SWITCH_MODE, [isMagicMode]);
    observerEmitter.trigger(
      isMagicMode
        ? EVENTS.CAMERA_MOVES.MOVE_TO_HOME
        : EVENTS.CAMERA_MOVES.MOVE_TO_GENERAL
    );
    setIsDisabled(true);
    setIsMagicMode(!isMagicMode);

    const duration = 3;

    const tl = gsap.timeline({ defaults: { duration: duration } });

    tl.to(".Mode-button-mask", {
      transformOrigin: "left",
      duration: duration / 2,
      scaleX: 1,
    }).to(".Mode-button-mask", {
      transformOrigin: "right",
      duration: duration / 2,
      scaleX: 0,
    });

    setTimeout(() => {
      setIsDisabled(false);
    }, duration * 1000);

  };

  return (
    <button
      className="Mode-button z-10 fixed top-4 left-4 md:top-8 md:left-8 -translate-x-60 flex border-[2px] border-text-100 px-4 py-1.5 justify-center items-center gap-2 rounded-3xl hover:border-text-200 transition-all duration-300 overflow-hidden"
      onClick={handleButtonClick}
      disabled={isDisabled}
    >
      <div className="Mode-button-mask bg-text-200 opacity-50 absolute w-full h-full scale-x-0 origin-left"></div>
      <div className="font-rokkitt text-text-100 text-lg h-7 overflow-hidden">
        <div className="mask flex flex-col justify-start items-center transition-all">
          <span>{isMagicMode ? "Return to wand" : "Test its power"}</span>
          <span>{isMagicMode ? "Return to wand" : "Test its power"}</span>
        </div>
      </div>
      {isMagicMode ? (
        <GiReturnArrow
          color="white"
          className="icon icon-return transition-transform mr-1"
        />
      ) : (
        <FaWandMagicSparkles
          color="white"
          className="icon transition-transform mr-1"
        />
      )}
    </button>
  );
};
