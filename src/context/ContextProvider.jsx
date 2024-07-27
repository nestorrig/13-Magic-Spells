/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [state, setState] = useState(null);

  return (
    <Context.Provider value={{ state, setState }}>{children}</Context.Provider>
  );
};

export { Context, ContextProvider };
