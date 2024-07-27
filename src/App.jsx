import Canvas from "./components/Canvas";
import { ContextProvider } from "./context";

function App() {
  return (
    <ContextProvider>
      <p className="text-red-500">Hello Threejs</p>
      <Canvas />
    </ContextProvider>
  );
}

export default App;
