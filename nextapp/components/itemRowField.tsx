import React, { ChangeEvent, useEffect, useState } from "react";
import ArrowRightIcon from "./icons/arrowRight";
import MinusIcon from "./icons/minus";
import InputField from "./inputField";

interface props {
  onDelete?: Function;
  name: string | undefined;
  price: string | undefined;
  onChange: Function;
  errors?: {
    name?: string[];
    price?: string[];
  };
}

export default function ItemRowField(props: props) {
  const [value, setValue] = useState({} as { name: string; price: string });
  useEffect(() => {
    setValue((old) => {
      return { price: props.price || old.price, name: props.name || old.name };
    });
  }, []);
  return (
    <div className="flex gap-2 md:items-end justify-center items-center">
      <div className="flex flex-col md:flex-row flex-grow gap-2">
        <InputField
          value={value.name}
          errors={props.errors?.name}
          onChange={(val: ChangeEvent<HTMLInputElement>) => {
            setValue((old) => {
              if (props.onChange) {
                props.onChange({ price: old.price, name: val.target.value });
              }
              return { price: old.price, name: val.target.value };
            });
          }}
          className="flex-1"
          label="Item Name"
          placeholder="Itemized Work"
        >
          <ArrowRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"></ArrowRightIcon>
        </InputField>
        <InputField
          value={value.price?.toString()}
          errors={props.errors?.price}
          onChange={(val: ChangeEvent<HTMLInputElement>) => {
            setValue((old) => {
              if (props.onChange) {
                props.onChange({ name: old.name, price: val.target.value });
              }
              return { name: old.name, price: val.target.value };
            });
          }}
          className=""
          withUnit="$"
          label="Price"
          placeholder="59.99"
        ></InputField>
      </div>
      <div
        onClick={() => {
          if (props.onDelete) {
            props.onDelete();
          }
        }}
        className="flex justify-center items-center h-full mt-[14px] md:m-0 hover:text-gray-300 hover:dark:text-gray-300 text-gray-500 dark:text-gray-400 cursor-pointer duration-200"
      >
        <MinusIcon className="w-8 h-8 md:mb-[6px]"></MinusIcon>
      </div>
    </div>
  );
}
