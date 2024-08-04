// import { EVENTS, observerEmitter } from "@/Events/Events";

import { IoIosMenu } from "react-icons/io";

export const Menu = () => {
  return (
    <>
      <button className="fixed top-4 right-4 border-[2px] border-text-100 rounded-full size-10">
        <IoIosMenu color="white" className="text-3xl mx-auto" />
      </button>
    </>
  );
};
