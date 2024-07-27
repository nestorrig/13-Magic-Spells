/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  const values = {
    state,
    setState,
    loading,
    setLoading,
  };

  console.log(loading);

  return <Context.Provider value={{ ...values }}>{children}</Context.Provider>;
};

export { Context, ContextProvider };
