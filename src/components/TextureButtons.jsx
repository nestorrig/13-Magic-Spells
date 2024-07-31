import { EVENTS, observerEmitter } from "@/Events/Events";

const images = [
  { src: "/imgs/texture1.webp", alt: "Texture 1" },
  { src: "/imgs/texture2.webp", alt: "Texture 2" },
  { src: "/imgs/texture3.webp", alt: "Texture 3" },
  { src: "/imgs/texture4.webp", alt: "Texture 4" },
  { src: "/imgs/texture5.webp", alt: "Texture 5" },
];

export const TextureButtons = () => {
  return (
    <div className="fixed ring-4 bottom-4">
      {images.map((image, index) => (
        <button
          key={index}
          className="size-16 rounded-full"
          onClick={() => {
            observerEmitter.trigger(EVENTS.CHANGE_TEXTURE, [image.alt]);
          }}
        >
          <img src={image.src} alt={image.alt} className="size-full" />
        </button>
      ))}
    </div>
  );
};
