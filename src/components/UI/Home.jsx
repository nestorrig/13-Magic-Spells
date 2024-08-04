import { EVENTS, observerEmitter } from "@/Events/Events";

import gsap from "gsap";
import { useEffect } from "react";
// import { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";

export const Home = () => {
  const initAnimation = () => {
    const tl = gsap.timeline();

    tl.to(".Try-button", {
      duration: 0.5,
      scale: 0,
      onComplete: () => {
        observerEmitter.trigger(EVENTS.INIT_TEXTURE_UI);
      },
    })
      .to(
        ".Text-1",
        {
          duration: 0.5,
          xPercent: -100,
        },
        "-=75%"
      )
      .to(
        ".Text-2",
        {
          duration: 0.5,
          yPercent: -100,
        },
        "-=75%"
      )
      .to(".Home", {
        visibility: "hidden",
      });
  };

  useEffect(() => {
    const handleInitHome = () => {
      const tl = gsap.timeline();

      tl.to(".Try-button", {
        delay: 1,
        duration: 1,
        opacity: 1,
      })
        .to(
          ".Text-1",
          {
            duration: 1,
            opacity: 1,
          },
          "-=75%"
        )
        .to(
          ".Text-2",
          {
            duration: 1,
            opacity: 1,
          },
          "-=75%"
        );
    };
    observerEmitter.on(EVENTS.INIT_HOME, handleInitHome);

    return () => {
      // observerEmitter.off(EVENTS.LOADED, handleLoaded);
      observerEmitter.off(EVENTS.INIT_HOME, handleInitHome);
    };
  }, []);

  return (
    <>
      <div className="Home fixed top-1/3 left-4 md:left-[10%] -translate-y-1/2 overflow-hidden">
        <h1 className="Text-1 opacity-0 text-5xl md:text-7xl font-bona-nova font-bold text-primary-200 mb-4">
          Magic wand
        </h1>
        <div className="overflow-hidden">
          <p className="Text-2 opacity-0 text-xl md:text-2xl font-rokkitt text-text-100 max-w-80 text-balance">
            Choose your kind of magic wand and try its power
          </p>
        </div>
      </div>

      <button
        className="Try-button z-10 opacity-0 fixed bottom-8 right-8 flex border-[2px] border-text-100 px-4 py-1.5 justify-center items-center gap-2 rounded-3xl hover:border-text-200"
        onClick={initAnimation}
      >
        <div className="font-rokkitt text-text-100 text-lg h-7 overflow-hidden ">
          <div className="mask  flex flex-col justify-start items-center transition-all">
            <span>Try it</span>
            <span>Try it</span>
          </div>
        </div>
        <FaArrowRight
          color="white"
          className="icon transition-transform mr-1"
        />
      </button>
    </>
  );
};
