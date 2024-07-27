import { useEffect, useRef } from "react";
import Experience from "../Experience/Experience";

function Canvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const experience = new Experience(document.querySelector("canvas.webgl"));
    }
  }, []);

  return <canvas ref={canvasRef} className="webgl"></canvas>;
}

export default Canvas;
