import { EVENTS, observerEmitter } from "@/Events/Events";
import { useEffect, useState } from "react";

export const Loader = () => {
  const [removeLoader, setRemoveLoader] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const handleRemoveLoader = () => {
    setRemoveLoader(true);
    observerEmitter.trigger(EVENTS.INIT_HOME);
    observerEmitter.trigger(EVENTS.AUDIO.AMBIENT);
  };

  useEffect(() => {
    const handleLoaded = () => {
      setTimeout(() => {
        setLoaded(true);
        setShowButton(true);
      }, 1000);
      console.log("Cargado");
    };

    const handlePercentageLoaded = (number) => {
      setPercentage(number);
    };

    observerEmitter.on(EVENTS.LOADED, handleLoaded);
    observerEmitter.on(EVENTS.PERCENTAGE_LOADED, handlePercentageLoaded);

    return () => {
      observerEmitter.off(EVENTS.LOADED, handleLoaded);
      observerEmitter.off(EVENTS.PERCENTAGE_LOADED, handlePercentageLoaded);
    };
  }, []);

  return (
    <div
      className={`absolute w-screen h-svh text-2xl font-bold bg-bg-100 top-0 transition-all z-50 font-bona-nova ${
        removeLoader ? "fadeout" : ""
      }`}
    >
      <div
        className={`absolute top-1/2 left-0 translate-y-1/2 transition-all h-1 bg-primary-200 ${
          loaded ? "duration-500 scale-0 " : ""
        }`}
        style={{ width: `${percentage}%` }}
      ></div>
      <div className={`absolute bottom-5 right-5 overflow-hidden`}>
        <p
          className={`text-primary-200 font-bold text-5xl transition-transform duration-500 font-rokkitt ${
            loaded ? "translate-y-full" : ""
          }`}
        >
          {percentage}%
        </p>
      </div>

      <button
        className={`absolute left-1/2 top-1/2 -translate-x-1/2  opacity-0 transition-all duration-500 delay-300 ease-in ${
          showButton ? "opacity-100 -translate-y-1/2" : "-translate-y-10"
        }`}
        onClick={handleRemoveLoader}
      >
        <span className="uppercase font-normal text-lg text-text-200 tracking-[6px] hover:text-text-100">
          Enter
        </span>
      </button>
    </div>
  );
};
