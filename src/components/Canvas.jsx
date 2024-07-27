import { useEffect, useRef } from "react";
import Experience from "../Experience/Experience";

export const Canvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const experience = new Experience(document.querySelector("canvas.webgl"));
    }
  }, []);

  return <canvas ref={canvasRef} className="webgl"></canvas>;
};

