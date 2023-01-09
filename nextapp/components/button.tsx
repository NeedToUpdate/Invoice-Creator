import React, { MouseEventHandler } from "react";
import DocumentCheckIcon from "./icons/documentCheck";
import GlobeIcon from "./icons/globe";
import SaveIcon from "./icons/saveIcon";

type validIcon = "check" | "save" | "globe";

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
        return <DocumentCheckIcon className={`w-5 h-5 ${props.disabled ? "text-gray-600 dark:text-gray-300" : "text-primary-600 dark:text-white"}`}></DocumentCheckIcon>;
      case "save":
        return <SaveIcon className={`w-5 h-5 ${props.disabled ? "text-gray-600 dark:text-gray-300" : "text-primary-600 dark:text-white"}`}></SaveIcon>;
      case "globe":
        return <GlobeIcon className={`w-5 h-5 ${props.disabled ? "text-gray-600 dark:text-gray-300" : "text-primary-600 dark:text-white"}`}></GlobeIcon>;
      default:
        return <></>;
    }
  };
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={
        "duration-100 flex bg-primary-100 border-primary-400 dark:bg-primary-800 dark:border-primary-700 cursor-pointer gap-1 justify-center items-center rounded-lg whitespace-nowrap px-3.5 py-2.5 border-[1px] dark:text-white hover:bg-white hover:dark:bg-primary-600 hover:translate-y-[-1px] disabled:border-gray-500 disabled:bg-gray-400 disabled:text-gray-600 disabled:dark:text-gray-300 disabled:pointer-events-none"
      }
    >
      {props.icon ? getIcon(props.icon) : <></>}
      <span className="text-sm ">{props.children}</span>
    </button>
  );
}
