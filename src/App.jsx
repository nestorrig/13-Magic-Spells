import { Canvas, Loader } from "@/components";
import { ContextProvider } from "./context";

function App() {
  return (
    <ContextProvider>
      <p className="text-red-500">Hello Threejs</p>
      <Canvas />
      <Loader />
    </ContextProvider>
  );
}

export default App;
