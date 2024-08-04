import { Canvas, Loader, UIcontent } from "@/components";
import { ContextProvider } from "./context";

function App() {
  return (
    <ContextProvider>
      <p className="text-red-500">Hello Threejs</p>
      <Canvas />
      <Loader />
      <UIcontent />
    </ContextProvider>
  );
}

export default App;
