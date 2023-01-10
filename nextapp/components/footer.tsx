import Image from "next/image";
import React from "react";

const icon = (type: "mongo" | "react" | "tailwind" | "nextjs") => {
  return (
    <div className="object-fit w-[28px] h-[28px] bg-white dark:bg-primary-700 rounded-lg p-1">
      <Image className="w-fit h-fit text-center" height={24} width={24} src={`/images/${type}-icon.png`} alt={type} title={`Made with ${type}`} />
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="flex justify-center flex-col md:flex-row items-center h-fit p-5 gap-2 md:h-20 z-10 bg-slate-100 dark:bg-slate-800">
      <div className="flex-1 flex justify-center items-center gap-2">
        {icon("nextjs")}
        {icon("react")}
        {icon("tailwind")}
        {icon("mongo")}
      </div>
      <div className="flex-1 flex justify-center items-center gap-2"></div>
      <div className="flex-1 flex justify-center items-center gap-2">
        <p className="dark:text-primary-200">
          Visit{" "}
          <a className="text-blue-500 dark:text-blue-300 underline cursor-pointer hover:text-blue-400 hover:dark:text-blue-200 duration-200" href="https://artemnikitin.dev">
            artemnikitin.dev
          </a>{" "}
          for more.
        </p>
      </div>
    </footer>
  );
}
