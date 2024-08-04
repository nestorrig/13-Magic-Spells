import {
  GiFloatingPlatforms,
  GiMagicPortal,
  GiRegeneration,
  GiResonance,
} from "react-icons/gi";
import { LuShrink } from "react-icons/lu";
import { EVENTS, observerEmitter } from "@/Events/Events";
import { useEffect, useState } from "react";
import gsap from "gsap";

const buttonsConfig = [
  {
    id: 1,
    text: "Shrink",
    icon: (
      <LuShrink
        color="white"
        className="ml-auto w-12 h-12 text-3xl bg-bg-300 p-2 rounded-full"
      />
    ),
    events: [EVENTS.CAMERA_MOVES.MOVE_TO_TREES, EVENTS.OTHER_EVENT_1],
  },
  {
    id: 2,
    text: "Portal",
    icon: (
      <GiMagicPortal
        color="white"
        className="ml-auto w-12 h-12 text-3xl bg-bg-300 p-2 rounded-full"
      />
    ),
    events: [EVENTS.CAMERA_MOVES.MOVE_TO_TABLE, EVENTS.OTHER_EVENT_2],
  },
  {
    id: 3,
    text: "Levitate",
    icon: (
      <GiFloatingPlatforms
        color="white"
        className="ml-auto w-12 h-12 text-3xl bg-bg-300 p-2 rounded-full"
      />
    ),
    events: [EVENTS.CAMERA_MOVES.MOVE_TO_ROCKS, EVENTS.OTHER_EVENT_3],
  },
];

export const MagicActions = () => {
  const [disabledButtons, setDisabledButtons] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);

  const handleButtonClick = (id, events) => {
    events.forEach((event) => observerEmitter.trigger(event));

    setDisabledButtons((prev) => ({ ...prev, [id]: true }));
    // setTimeout(() => {
    //   setDisabledButtons((prev) => ({ ...prev, [id]: false }));
    // }, 3000);
  };

  const enableAllButtons = () => {
    setDisabledButtons({});
  };

  const handleReset = () => {
    setIsDisabled(true);
    const duration = 3;

    const tl = gsap.timeline({ defaults: { duration: duration } });

    tl.to(".Reset-button-mask", {
      transformOrigin: "left",
      duration: duration / 2,
      scaleX: 1,
    }).to(".Reset-button-mask", {
      transformOrigin: "right",
      duration: duration / 2,
      scaleX: 0,
    });

    gsap.to(".icon-reset", {
      rotate: "+=360",
      duration: duration,
    });

    setTimeout(() => {
      setIsDisabled(false);
      enableAllButtons();
    }, duration * 1000);
  };

  useEffect(() => {
    const handleInitMagicMode = (state = true) => {
      const tl = gsap.timeline();
      console.log(state);

      // tl.to(".Magic-buttons-container", {
      //   x: state ? 500 : 0,
      // })
      tl.to(".Magic-buttons", {
        opacity: state ? 0 : 1,
        x: state ? 500 : 0,
        stagger: 0.1,
      }).to(
        ".Reset-button",
        {
          opacity: state ? 0 : 1,
          x: state ? -144 : 0,
        },
        "<"
      );
    };
    observerEmitter.on(EVENTS.SWITCH_MODE, handleInitMagicMode);
    return () => {
      observerEmitter.off(EVENTS.SWITCH_MODE, handleInitMagicMode);
    };
  }, []);

  return (
    <>
      <div className="Magic-buttons fixed right-4 md:right-[10%] bottom-4 md:bottom-[20%] flex flex-col gap-4 translate-x-[500px]">
        {buttonsConfig.map(({ id, text, icon, events }) => (
          <div
            key={id}
            className={`w-[158px] h-16 transition-opacity opacity-0 Magic-buttons translate-x-[500px]`}
          >
            <div
              className={`ml-auto w-full md:w-16 md:hover:w-full h-full border-[2px] border-text-100 rounded-full overflow-hidden flex justify-end items-center px-1.5 gap-0 md:gap-4 hover:gap-0 transition-all origin-left ${
                disabledButtons[id] ? "!opacity-50" : ""
              }`}
            >
              <span className="text-text-100 font-bona-nova text-lg">
                {text}
              </span>
              <button
                className="size-16"
                onClick={() => handleButtonClick(id, events)}
                disabled={disabledButtons[id]}
              >
                {icon}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* <button onClick={enableAllButtons}>Enable All Buttons</button> */}
      <button
        className="Reset-button z-10 fixed bottom-4 left-4 md:bottom-8 md:left-8 opacity-0 -translate-x-36 flex border-[2px] border-text-100 px-4 py-1.5 justify-center items-center gap-2 rounded-3xl hover:border-text-200 transition-all duration-300 overflow-hidden"
        onClick={handleReset}
        disabled={isDisabled}
      >
        <div className="Reset-button-mask bg-text-200 opacity-50 absolute w-full h-full scale-x-0 origin-left"></div>
        <div className="font-rokkitt text-text-100 text-lg h-7 overflow-hidden">
          <div className="mask flex flex-col justify-start items-center transition-all">
            <span>Reset</span>
            <span>Reset</span>
          </div>
        </div>
        <GiResonance
          color="white"
          className="icon icon-reset text-2xl transition-transform mr-1 flex items-center justify-center"
        />
      </button>
    </>
  );
};
