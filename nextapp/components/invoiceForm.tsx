import React, { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
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
  price: string | undefined;
}

interface ItemRowError {
  name: string[];
  price: string[];
}

interface FieldValues {
  userAddress: string;
  destAddress: string;
  number: number;
  date: string;
  reason: string;
  name: string;
  logo: string; //base64 of the image. Image is 150px x 150px so shouldn't be too big
}

interface ErrorFields {
  userAddress: string[];
  destAddress: string[];
  number: string[];
  date: string[];
  reason: string[];
  name: string[];
  logo: string[];
}

export default function InvoiceForm() {
  const emptyErrors = {
    userAddress: [] as string[],
    destAddress: [] as string[],
    number: [] as string[],
    date: [] as string[],
    reason: [] as string[],
    name: [] as string[],
    logo: [] as string[],
  };
  const [itemRows, setItemRows] = useState([] as ItemRow[]);
  const [fields, setFields] = useState({} as FieldValues);
  const [errors, setErrors] = useState(emptyErrors);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [itemRowErrors, setItemRowErrors] = useState([] as ItemRowError[]);

  useEffect(() => {
    if (localStorage.getItem("fields")) {
      setFields(JSON.parse(localStorage.getItem("fields") as string) as FieldValues);
      setErrors(emptyErrors);
    }
    if (localStorage.getItem("itemRows")) {
      setItemRows(JSON.parse(localStorage.getItem("itemRows") as string) as ItemRow[]);
      setItemRowErrors([]);
    }
  }, []);

  const handleSubmit = () => {
    setSubmitButtonDisabled(true);
    let hasErrors = false;
    setErrors(emptyErrors);
    setItemRowErrors([]);
    if (!fields.name || fields.name.length < 1) {
      setErrors((old) => ({ ...old, name: ["Please write your name."] }));
      hasErrors = true;
    }
    if (!fields.reason || fields.reason.length < 1) {
      setErrors((old) => ({ ...old, reason: ["Please write a reason for this invoice."] }));
      hasErrors = true;
    }
    if (!fields.date || fields.date.length < 1) {
      setErrors((old) => ({ ...old, date: ["Please select a date."] }));
      hasErrors = true;
    }
    itemRows.forEach((row, i) => {
      if (!row.name || row.name.length < 1) {
        setItemRowErrors((old) => {
          if (old[i] == undefined) {
            old[i] = {
              name: [],
              price: [],
            };
          }
          old[i].name = ["Please write a name for this item."];
          return old;
        });
      }
      if (row.price === undefined || row.price === "") {
        setItemRowErrors((old) => {
          if (old[i] == undefined) {
            old[i] = {
              name: [],
              price: [],
            };
          }
          old[i].price = ["Please add a price."];
          return old;
        });
      }
    });
    if (hasErrors) {
      setSubmitButtonDisabled(false);
      return;
    }
  };

  const handleSave = () => {
    localStorage.setItem("fields", JSON.stringify(fields));
    localStorage.setItem("itemRows", JSON.stringify(itemRows));
  };

  const createValues = (fieldName: keyof FieldValues) => {
    return {
      value: fields[fieldName],
      onChange: (ev: ChangeEvent<HTMLInputElement>) => {
        setErrors((old) => ({ ...old, [fieldName]: [] }));
        setFields((old) => ({ ...old, [fieldName]: ev.target.value }));
      },
      errors: errors[fieldName],
    };
  };

  return (
    <div className="flex flex-col w-fit bg-slate-100 dark:bg-primary-900 rounded-lg p-5 justify-center items-center gap-3">
      <h1 className="text-2xl font-bold text-primary-500 dark:text-primary-200 mb-5">Create Your Invoice</h1>
      <div className="flex gap-2 items-center justify-center md:flex-row flex-col">
        <div className="max-w-[150px] h-fit">
          <ImageDropper
            value={fields.logo}
            errors={errors.logo}
            onFileInput={(base64: string) => {
              setFields((old) => ({ ...old, logo: base64 }));
            }}
          ></ImageDropper>
        </div>
        <InputField {...createValues("name")} className="w-full max-w-[400px]" label="Name" placeholder="John Doe">
          <PersonIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"></PersonIcon>
        </InputField>
      </div>
      <div className="flex w-full h-full gap-2 flex-wrap flex-col md:flex-row">
        <div className="flex flex-col gap-2 flex-1 flex-wrap justify-center items-center">
          <InputField {...createValues("userAddress")} className="w-full max-w-[400px]" label="Your Address & Phone Number" placeholder="1234 Name Street">
            <SmallHouseIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"></SmallHouseIcon>
          </InputField>
          <InputField {...createValues("destAddress")} className="w-full max-w-[400px]" label="Destination Address" placeholder="5678 Other Street">
            <HouseIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"></HouseIcon>
          </InputField>
        </div>
        <div className="flex flex-col gap-2 flex-1 flex-wrap justify-center items-center">
          <InputField {...createValues("reason")} className="w-full max-w-[400px]" label="Reason" placeholder="Contract Work">
            <QuestionIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"></QuestionIcon>
          </InputField>
          <div className="flex gap-2">
            <InputField {...createValues("number")} className="flex-1" withUnit="#" label="Invoice Number" placeholder="100 (leave blank to ignore)"></InputField>
            <InputField {...createValues("date")} className="flex-1" type="date" label="Date" placeholder="2022/12/31">
              <CalendarIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"></CalendarIcon>
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
              errors={itemRowErrors[i]}
              onChange={(newVals: ItemRow) => {
                setItemRows((old) => {
                  old[i].name = newVals.name;
                  old[i].price = newVals.price;
                  return old;
                });
              }}
              key={row.id.toString() + i.toString()}
              onDelete={() => {
                setItemRows((old) => {
                  let newArr = old.slice();
                  newArr.splice(i, 1);
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
            className="flex justify-center items-center gap-3 hover:text-gray-300 hover:dark:text-gray-300 text-gray-600 dark:text-gray-400 cursor-pointer duration-200"
          >
            <PlusIcon className="w-8 h-8 "></PlusIcon>
            <p className="">Add New Item</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button
          disabled={submitButtonDisabled}
          icon="check"
          onClick={() => {
            handleSubmit();
          }}
        >
          Create Invoice
        </Button>
        <Button
          icon="save"
          onClick={() => {
            handleSave();
          }}
        >
          Save Info
        </Button>
        <Button
          onClick={async () => {
            const res = await fetch("/api/get_pdf", {
              method: "POST",
              body: JSON.stringify({
                fields: fields,
                itemRows: itemRows,
              }),
            });
            const blob = await res.blob();
            const newBlob = new Blob([blob]);
            const blobUrl = window.URL.createObjectURL(newBlob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.setAttribute("download", `${"filename"}.${"pdf"}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);

            // clean up Url
            window.URL.revokeObjectURL(blobUrl);
          }}
        >
          test
        </Button>
      </div>
    </div>
  );
}
