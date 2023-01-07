import React, { useEffect, useState } from "react";
import ArrowRightIcon from "./icons/arrowRight";
import MinusIcon from "./icons/minus";
import InputField from "./inputField";

interface props {
  onDelete?: Function;
  name: string | undefined;
  price: number | undefined;
  onChange: Function;
}

export default function ItemRowField(props: props) {
  const [value, setValue] = useState({} as { name: string; price: number });
  useEffect(() => {
    console.log(props);
    setValue((old) => {
      return { price: props.price || old.price, name: props.name || old.name };
    });
  }, []);
  return (
    <div className="flex gap-2 items-end">
      <InputField
        value={value.name}
        onChange={(val: string) => {
          setValue((old) => {
            if (props.onChange) {
              props.onChange({ price: old.price, name: val });
            }
            return { price: old.price, name: val };
          });
        }}
        className="flex-1"
        label="Item Name"
        placeholder="Itemized Work"
      >
        <ArrowRightIcon className="w-6 h-6 dark:text-gray-400"></ArrowRightIcon>
      </InputField>
      <InputField
        value={value.price?.toString()}
        onChange={(val: string) => {
          const numVal = parseFloat(val);
          setValue((old) => {
            if (props.onChange) {
              props.onChange({ name: old.name, price: numVal });
            }
            return { name: old.name, price: numVal };
          });
        }}
        className=""
        withUnit="$"
        label="Price"
        placeholder="59.99"
      ></InputField>
      <div
        onClick={() => {
          if (props.onDelete) {
            props.onDelete();
          }
        }}
        className="flex justify-center items-center hover:text-white hover:dark:text-gray-300 dark:text-gray-400 cursor-pointer duration-200"
      >
        <MinusIcon className="w-8 h-8  mb-[6px]"></MinusIcon>
      </div>
    </div>
  );
}
