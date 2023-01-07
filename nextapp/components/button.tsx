import React, { MouseEventHandler } from "react";
import DocumentCheckIcon from "./icons/documentCheck";
import SaveIcon from "./icons/saveIcon";

type validIcon = "check" | "save";

interface props {
  onClick: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: string;
  icon?: validIcon;
}

export default function Button(props: props) {
  const getIcon = (type: validIcon) => {
    switch (type) {
      case "check":
        return <DocumentCheckIcon className="w-5 h-5 text-black dark:text-white"></DocumentCheckIcon>;
      case "save":
        return <SaveIcon className="w-5 h-5 text-black dark:text-white"></SaveIcon>;
      default:
        return <></>;
    }
  };
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={
        "duration-100 flex dark:bg-primary-800 dark:border-primary-700 cursor-pointer gap-1 justify-center items-center rounded-lg whitespace-nowrap px-3.5 py-2.5 border-[1px] hover:dark:bg-primary-600 hover:translate-y-[-1px] disabled:border-gray-500 disabled:pointer-events-none"
      }
    >
      {props.icon ? getIcon(props.icon) : <></>}
      <span className="text-sm dark:text-white">{props.children}</span>
    </button>
  );
}
