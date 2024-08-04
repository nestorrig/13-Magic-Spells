// import { EVENTS, observerEmitter } from "@/Events/Events";

import { useState } from "react";
import { FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";
import { IoIosClose, IoIosMenu } from "react-icons/io";
import { EVENTS, observerEmitter } from "@/Events/Events.js";
import { GiSoundOff, GiSoundOn } from "react-icons/gi";

export const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [muteAmbient, setMuteAmbient] = useState(false);
  const [muteEffects, setMuteEffects] = useState(false);

  const handleMuteAmbient = () => {
    setMuteAmbient(!muteAmbient);
    observerEmitter.trigger(EVENTS.AUDIO.AMBIENT, [muteAmbient]);
  };

  const handleMuteEffects = () => {
    setMuteEffects(!muteEffects);
    observerEmitter.trigger(EVENTS.AUDIO.EFFECTS);
  };

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <button
        className="fixed top-4 right-4 border-[2px] border-text-100 rounded-full size-10 z-30"
        onClick={handleMenu}
      >
        {menuOpen ? (
          <IoIosClose color="white" className="text-3xl mx-auto" />
        ) : (
          <IoIosMenu color="white" className="text-3xl mx-auto" />
        )}
      </button>
      <div
        className={`fixed z-20 top-0 left-0 w-screen h-svh bg-bg-300 bg-opacity-50 backdrop-blur-sm transition-all flex justify-center items-center ${
          menuOpen ? "scale-10" : "scale-0"
        }`}
      >
        <div className="w-80 rounded-lg backdrop-blur-md p-5 text-text-200">
          <div className="flex flex-col justify-start items-center gap-4 font-bona-nova mb-8">
            <button
              className="flex justify-start items-center gap-8 text-2xl"
              onClick={handleMuteAmbient}
            >
              <span>{muteAmbient ? "Unmute" : "Mute"} Ambient</span>
              {muteAmbient ? (
                <GiSoundOff className="text-3xl mx-auto" />
              ) : (
                <GiSoundOn className="text-3xl mx-auto" />
              )}
            </button>
            <button
              className="flex justify-start items-center gap-8 text-2xl"
              onClick={handleMuteEffects}
            >
              <span>{muteEffects ? "Unmute" : "Mute"} Effects</span>
              {muteEffects ? (
                <GiSoundOff className="text-3xl mx-auto" />
              ) : (
                <GiSoundOn className="text-3xl mx-auto" />
              )}
            </button>
          </div>

          <div className="font-rokkitt flex justify-between items-center">
            <h2>
              Made by{" "}
              <a
                href="https://nestorriosgarcia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-200"
              >
                nestorrig
              </a>
            </h2>
            <div className="flex gap-2">
              <a
                href="https://twitter.com/nestorrig"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaSquareXTwitter className="text-3xl mx-auto" />
              </a>
              <a
                href="http://linkedin.com/in/nestorrig/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="text-3xl mx-auto" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
