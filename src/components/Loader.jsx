import { EVENTS, observerEmitter } from "@/Events/Events";
import { useEffect, useState } from "react";

export const Loader = () => {
  const [text, setText] = useState("Cargando...");

  useEffect(() => {
    observerEmitter.on(EVENTS.LOADED, () => {
      setText("Cargado");
      console.log("Cargado");
    });

    return () => {
      observerEmitter.off(EVENTS.LOADED);
    };
  }, []);

  return <div className="absolute text-2xl font-bold">{text}</div>;
};
