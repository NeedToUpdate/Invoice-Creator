import React, { useEffect, useState } from "react";

interface InputProps {
  label: string;
  placeholder: string;
  className?: string;
  initialValue?: string;
  onChange?: Function;
  withUnit?: string;
  children?: React.ReactElement<SVGElement>; //used for an svg icon
  type?: "date" | "email" | "password";
}

export default function InputField(props: InputProps) {
  const [value, setValue] = useState(props.initialValue || "");
  const [errors, setErrors] = useState([] as string[]);

  useEffect(() => {
    if (props.initialValue === undefined && value == "" && props.type == "date") {
      //default to today if no other values are set
      setValue(new Date().toISOString().split("T")[0]);
    }
  }, []);

  return (
    <div className={`flex flex-col justify-center ${props.className}`}>
      <label htmlFor={`input-group-${props.label.toLowerCase()}`} className="block mb-[1px] text-sm font-medium text-gray-900 dark:text-gray-300">
        {props.label}
      </label>
      <div className={props.withUnit ? "flex" : "relative mb-6"}>
        {props.withUnit ? (
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">{props.withUnit}</span>
        ) : (
          <div className={"absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"}>{props.children ? props.children : <></>}</div>
        )}
        <input
          type={props.type ? props.type : "text"}
          id={`input-group-${props.label.toLowerCase()}`}
          value={value || ""}
          onChange={(ev) => {
            setValue(ev.target.value);
            if (props.onChange) {
              props.onChange(ev.target.value);
            }
          }}
          className={
            (props.withUnit ? "rounded-none rounded-r-lg flex-1 min-w-0" : "rounded-lg") +
            ` ${
              props.children ? "pl-10" : ""
            } bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`
          }
          placeholder={props.placeholder}
        />
      </div>
    </div>
  );
}
