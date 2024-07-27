import { EVENTS, observerEmitter } from "@/Events/Events";
import { useEffect, useState } from "react";


export const Loader = () => {
  const [text, setText] = useState("Cargando...");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    observerEmitter.on(EVENTS.LOADED, () => {
      setText("Cargado");
      setLoaded(true);
      console.log("Cargado");
    });

    return () => {
      observerEmitter.off(EVENTS.LOADED);
    };
  }, []);

  return (
    <div
      className={`absolute w-screen h-dvh text-2xl font-bold bg-slate-600 top-0 transition-all ${
        loaded && "translate-y-full"
      }`}
    >
      <div className="h-full flex justify-center items-center">
        <p className="text-center text-white">{text}</p>
      </div>
    </div>
  );
};
