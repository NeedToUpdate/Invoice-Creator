import React, { useEffect, useState } from "react";

interface InputProps {
  label: string;
  placeholder: string;
  className?: string;
  value?: string | number;
  onChange?: Function;
  withUnit?: string;
  children?: React.ReactElement<SVGElement>; //used for an svg icon
  type?: "date" | "email" | "password" | "number" | "tel";
  errors?: string[];
}

export default function InputField(props: InputProps) {
  const [value, setValue] = useState(props.value || "");
  const [errors, setErrors] = useState([] as string[]);

  useEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    setErrors(props.errors || ([] as string[]));
  }, [props.errors]);

  useEffect(() => {
    if (props.value === undefined && value == "" && props.type == "date") {
      //default to today if no other values are set
      setValue(new Date().toLocaleDateString("en-ca"));
      if (props.onChange) {
        props.onChange({
          target: {
            value: new Date().toLocaleDateString("en-ca"),
          },
        });
      }
    }
  }, []);

  return (
    <div className={`flex relative flex-col justify-center ${props.className}`}>
      <label htmlFor={`input-group-${props.label.toLowerCase()}`} className={`block mb-[1px] text-sm font-medium ${errors.length ? "text-red-500 dark:text-red-400" : "text-gray-900 dark:text-gray-300"}`}>
        {props.label}
      </label>
      <div className={`${props.withUnit ? "flex" : "relative"} ${errors.length ? "outline-red-500 dark:outline-red-400 outline outline-[1px] rounded-lg" : ""}`}>
        {props.withUnit ? (
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">{props.withUnit}</span>
        ) : (
          <div className={"absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"}>{props.children ? props.children : <></>}</div>
        )}
        <input
          type={props.type ? props.type : "text"}
          id={`input-group-${props.label.toLowerCase()}`}
          value={value || props.value || ""}
          onChange={(ev) => {
            if (props.type === "tel") {
              let val = ev.target.value;
              let potentialCountryCode = false;
              let countryCode = undefined;
              if (val.startsWith("+")) {
                potentialCountryCode = true;
                let numbers = val.replaceAll(/[a-z]/g, "");
                let firstNonDigit = numbers[numbers.search(/[^\d^\+]/)];
                if (firstNonDigit) {
                  countryCode = numbers.split(firstNonDigit)[0];
                  val = val.slice(countryCode.length);
                  potentialCountryCode = false;
                }
              }

              if (!potentialCountryCode) {
                val = val.replaceAll(/[^\d]/g, "");
                const len = val.length;
                if (len > 3) {
                  val = val.slice(0, 3) + "-" + val.slice(3);
                }
                if (len > 6 && len < 11) {
                  val = val.slice(0, 7) + "-" + val.slice(7);
                }
                if (len === 11) {
                  val = val.slice(0, 8) + "-" + val.slice(8);
                }
              }
              ev.target.value = (countryCode ? countryCode + (countryCode.length > 1 ? "-" : "") : "") + val;
            }
            setValue(ev.target.value);
            if (props.onChange) {
              props.onChange(ev);
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
      {errors.length ? (
        <div className="absolute left-0 top-[100%] bg-red-400/30 z-[1000] p-2 rounded-lg border-solid border-[1px] border-red-500 dark:border-red-400 w-full flex flex-col gap-1 items-center">
          {errors.map((error, i) => {
            return (
              <p key={i} className="text-sm text-red-500 dark:text-red-400">
                {error}
              </p>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
