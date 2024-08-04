// import { EVENTS, observerEmitter } from "@/Events/Events";

import {
  Home,
  MagicActions,
  Menu,
  SwitchModeButton,
  TextureButtons,
} from "./UI/";

export const UIcontent = () => {
  return (
    <>
      <Menu />
      <Home />
      <TextureButtons />
      <SwitchModeButton />
      <MagicActions />
    </>
  );
};
