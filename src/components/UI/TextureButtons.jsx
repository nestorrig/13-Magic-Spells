import { EVENTS, observerEmitter } from "@/Events/Events";
import gsap from "gsap";
import { useEffect, useState } from "react";

const images = [
  { src: "/imgs/texture1.webp", alt: "Texture 1" },
  { src: "/imgs/texture2.webp", alt: "Texture 2" },
  { src: "/imgs/texture3.webp", alt: "Texture 3" },
  { src: "/imgs/texture4.webp", alt: "Texture 4" },
  { src: "/imgs/texture5.webp", alt: "Texture 5" },
];

export const TextureButtons = () => {
  const [selectedButton, setSelectedButton] = useState(0); // Estado para el botón seleccionado

  useEffect(() => {
    const handleInitTextures = (state = true) => {
      const tl = gsap.timeline();
      console.log(state);

      tl.to(".Texture-button", {
        opacity: state ? 1 : 0,
        y: state ? 0 : 80,
        stagger: 0.1,
      });
    };
    observerEmitter.on(EVENTS.INIT_TEXTURE_UI, handleInitTextures);
    observerEmitter.on(EVENTS.SWITCH_MODE, handleInitTextures);

    return () => {
      observerEmitter.on(EVENTS.SWITCH_MODE, handleInitTextures);
      observerEmitter.off(EVENTS.INIT_TEXTURE_UI, handleInitTextures);
    };
  }, []);

  const handleButtonClick = (index, alt) => {
    setSelectedButton(index); // Actualiza el botón seleccionado
    observerEmitter.trigger(EVENTS.CHANGE_TEXTURE, [alt]);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center gap-4">
      {images.map((image, index) => (
        <label
          key={index}
          className="Texture-button opacity-0 size-10 rounded-full translate-y-20 transition-all duration-300"
        >
          <input
            type="radio"
            name="texture"
            value={index}
            checked={selectedButton === index}
            onChange={() => handleButtonClick(index, image.alt)}
            className="hidden"
          />
          <img
            src={image.src}
            alt={image.alt}
            className={`size-full cursor-pointer transition-all ${
              selectedButton === index ? "scale-125" : "scale-100"
            }`}
          />
        </label>
      ))}
    </div>
  );
};
