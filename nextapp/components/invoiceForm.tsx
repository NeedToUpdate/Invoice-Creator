import React, { useState } from "react";
import InputField from "../components/inputField";
import PersonIcon from "../components/icons/person";
import HouseIcon from "../components/icons/house";
import SmallHouseIcon from "../components/icons/smallHouse";
import QuestionIcon from "../components/icons/question";
import CalendarIcon from "./icons/calendar";
import ImageDropper from "./imageDropper";
import ItemRowField from "./itemRowField";
import PlusIcon from "./icons/plus";
import Button from "./button";

interface ItemRow {
  id: number; //allows removal and component reload
  name: string | undefined;
  price: number | undefined;
}

export default function InvoiceForm() {
  const [itemRows, setItemRows] = useState([] as ItemRow[]);
  return (
    <div className="flex flex-col w-fit bg-primary-100 dark:bg-primary-900 rounded-lg p-5 justify-center items-center gap-3">
      <h1 className="text-2xl font-bold text-primary-500 dark:text-primary-200 mb-5">Create Your Invoice</h1>
      <div className="flex gap-2 items-center justify-center">
        <div className="max-w-[150px] h-fit">
          <ImageDropper
            onFileInput={(ev: any) => {
              console.log(ev);
            }}
          ></ImageDropper>
        </div>
        <InputField className="w-full max-w-[400px]" label="Name" placeholder="John Doe">
          <PersonIcon className="w-6 h-6 dark:text-gray-400"></PersonIcon>
        </InputField>
      </div>
      <div className="flex w-full h-full gap-2 flex-wrap">
        <div className="flex flex-col gap-2 flex-1">
          <InputField className="w-full max-w-[400px]" label="Your Address" placeholder="1234 Name Street">
            <SmallHouseIcon className="w-6 h-6 dark:text-gray-400"></SmallHouseIcon>
          </InputField>
          <InputField className="w-full max-w-[400px]" label="Destination Address" placeholder="5678 Other Street">
            <HouseIcon className="w-6 h-6 dark:text-gray-400"></HouseIcon>
          </InputField>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <InputField className="w-full max-w-[400px]" label="Reason" placeholder="Contract Work">
            <QuestionIcon className="w-6 h-6 dark:text-gray-400"></QuestionIcon>
          </InputField>
          <div className="flex gap-2">
            <InputField className="flex-1" withUnit="#" label="Invoice Number" placeholder="100 (leave blank to ignore)"></InputField>
            <InputField className="flex-1" type="date" label="Date" placeholder="2022/12/31">
              <CalendarIcon className="w-6 h-6 dark:text-gray-400"></CalendarIcon>
            </InputField>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-2 flex-col">
        {itemRows.map((row, i) => {
          return (
            <ItemRowField
              name={row.name}
              price={row.price}
              onChange={(newVals: ItemRow) => {
                setItemRows((old) => {
                  old[i].name = newVals.name;
                  old[i].price = newVals.price;
                  console.log(old);
                  return old;
                });
              }}
              key={row.id.toString() + i.toString()}
              onDelete={() => {
                console.log(row.id);
                setItemRows((old) => {
                  let newArr = old.slice();
                  console.log(row.id);
                  console.log(JSON.stringify(newArr));
                  newArr.splice(i, 1);
                  console.log(newArr);
                  return newArr;
                });
              }}
            ></ItemRowField>
          );
        })}
        <div className="flex justify-center items-center my-2">
          <div
            onClick={() => {
              setItemRows((old) => old.concat([{ id: (Math.random() * 1000) | 0, name: undefined, price: undefined }]));
            }}
            className="flex justify-center items-center gap-3 hover:text-white hover:dark:text-gray-300 dark:text-gray-400 cursor-pointer duration-200"
          >
            <PlusIcon className="w-8 h-8 "></PlusIcon>
            <p className="">Add New Item</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button icon="check" onClick={() => {}}>
          Create Invoice
        </Button>
        <Button icon="save" onClick={() => {}}>
          Save Info
        </Button>
      </div>
    </div>
  );
}
