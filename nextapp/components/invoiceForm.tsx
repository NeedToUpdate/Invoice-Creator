import React, { ChangeEvent, useEffect, useState } from "react";
import InputField from "../components/inputField";
import PersonIcon from "../components/icons/person";
import HouseIcon from "../components/icons/house";
import SmallHouseIcon from "../components/icons/smallHouse";
import CalendarIcon from "./icons/calendar";
import ImageDropper from "./imageDropper";
import ItemRowField from "./itemRowField";
import PlusIcon from "./icons/plus";
import Button from "./button";
import PhoneIcon from "./icons/phone";
import SaveOnlineField from "./saveOnlineField";

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
  userAddress?: string;
  destAddress?: string;
  destName?: string;
  number?: number;
  date: string;
  phone?: string;
  name: string;
  logo?: string; //base64 of the image. Image is 150px x 150px so shouldn't be too big
}

export default function InvoiceForm() {
  const emptyErrors = {
    userAddress: [] as string[],
    destAddress: [] as string[],
    number: [] as string[],
    date: [] as string[],
    phone: [] as string[],
    name: [] as string[],
    destName: [] as string[],
    logo: [] as string[],
  };
  const [itemRows, setItemRows] = useState([] as ItemRow[]);
  const [fields, setFields] = useState({} as FieldValues);
  const [errors, setErrors] = useState(emptyErrors); //for all the formInputs
  const [mainErrors, setMainErrors] = useState([] as string[]); //for the main form errors, under the buttons
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [itemRowErrors, setItemRowErrors] = useState([] as ItemRowError[]);
  const [savedToLocal, setSavedToLocal] = useState(false);
  const [savedToOnline, setSavedToOnline] = useState(false);
  const [saveOnlineSuccessful, setSaveOnlineSuccessful] = useState(false);
  const [savedCloudVals, setSavedCloudVals] = useState({ name: "", code: "" });

  useEffect(() => {
    if (localStorage.getItem("fields")) {
      setSavedToLocal(true);
      setFields(JSON.parse(localStorage.getItem("fields") as string) as FieldValues);
      setErrors(emptyErrors);
    }
    if (localStorage.getItem("itemRows")) {
      setSavedToLocal(true);
      setItemRows(JSON.parse(localStorage.getItem("itemRows") as string) as ItemRow[]);
      setItemRowErrors([]);
    }
    if (localStorage.getItem("saveVals")) {
      setSavedToOnline(true);
      setSavedCloudVals(JSON.parse(localStorage.getItem("saveVals") || "{}"));
    }
  }, []);

  const handleSubmit = async () => {
    setSubmitButtonDisabled(true);
    let hasErrors = false;
    setErrors(emptyErrors);
    setItemRowErrors([]);
    setMainErrors([]);
    if (!fields.name || fields.name.length < 1) {
      setErrors((old) => ({ ...old, name: ["Please write your name."] }));
      hasErrors = true;
    }

    if (!fields.date || fields.date.length < 1) {
      setErrors((old) => ({ ...old, date: ["Please select a date."] }));
      hasErrors = true;
    }
    itemRows.forEach((row, i) => {
      if (!row.name || row.name.length < 1) {
        hasErrors = true;
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
        hasErrors = true;
        setItemRowErrors((old) => {
          if (old[i] == undefined) {
            old[i] = {
              name: [],
              price: [],
            };
          }
          old[i].price = ["Please add a price."];
          hasErrors = true;
          return old;
        });
      }
    });
    if (itemRows.length === 0) {
      setMainErrors(["Please add at least one item to the invoice."]);
      hasErrors = true;
    }
    if (hasErrors) {
      setSubmitButtonDisabled(false);
      return;
    }
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
    function createName() {
      let str = "";
      if (fields.date) {
        str += fields.date + "-";
      }
      if (fields.destName) {
        str += fields.destName.replaceAll(" ", "-").toLowerCase() + "-";
      }
      return str + "invoice";
    }
    link.setAttribute("download", `${createName()}.${"pdf"}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);

    // clean up Url
    window.URL.revokeObjectURL(blobUrl);
    setSubmitButtonDisabled(false);
  };

  const handleSave = () => {
    localStorage.setItem("fields", JSON.stringify(fields));
    localStorage.setItem("itemRows", JSON.stringify(itemRows));
    setSavedToLocal(true);
    setSavedToOnline(false);
  };

  const createValues = (fieldName: keyof FieldValues) => {
    return {
      value: fields[fieldName],
      onChange: (ev: ChangeEvent<HTMLInputElement>) => {
        setSavedToLocal(false);
        setSavedToOnline(false);
        setErrors((old) => ({ ...old, [fieldName]: [] }));
        setFields((old) => ({ ...old, [fieldName]: ev.target.value }));
      },
      errors: errors[fieldName],
    };
  };

  return (
    <div className="flex flex-col w-fit bg-slate-100 dark:bg-primary-900 rounded-lg p-5 justify-center items-center gap-3 z-10 shadow-md">
      <h1 className="text-2xl font-bold text-primary-500 dark:text-primary-100 mb-5">Create Your Invoice</h1>
      <div className="flex gap-2 items-center justify-center md:flex-row flex-col">
        <div className="max-w-[150px] h-fit">
          <ImageDropper
            value={fields.logo}
            errors={errors.logo}
            onFileInput={(base64: string) => {
              setFields((old) => ({ ...old, logo: base64 }));
            }}
            onDelete={() => {
              setFields((old) => ({ ...old, logo: undefined }));
            }}
          ></ImageDropper>
        </div>
        <InputField {...createValues("name")} className="w-full max-w-[400px]" label="Your Name" placeholder="John Doe">
          <PersonIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"></PersonIcon>
        </InputField>
      </div>
      <div className="flex w-full h-full gap-2 flex-wrap flex-col md:items-start md:flex-row">
        <div className="flex flex-col gap-2 flex-1 flex-wrap justify-center  items-center">
          <InputField {...createValues("userAddress")} className="w-full max-w-[400px]" label="Your Address" placeholder="1234 Name Street">
            <SmallHouseIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"></SmallHouseIcon>
          </InputField>
          <InputField {...createValues("phone")} className="w-full max-w-[400px]" label="Phone Number" type="tel" placeholder="123-555-4321">
            <PhoneIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"></PhoneIcon>
          </InputField>
        </div>
        <div className="flex flex-col gap-2 flex-1 flex-wrap justify-center  items-center">
          <InputField {...createValues("destName")} className="w-full max-w-[400px]" label="Destination Name" placeholder="Jane Jones">
            <PersonIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"></PersonIcon>
          </InputField>
          <InputField {...createValues("destAddress")} className="w-full max-w-[400px]" label="Destination Address" placeholder="5678 Other Street">
            <HouseIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"></HouseIcon>
          </InputField>
          <div className="flex gap-2">
            <InputField {...createValues("number")} className="flex-1" withUnit="#" label="Invoice Number" placeholder="100"></InputField>
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
                setSavedToLocal(false);
                setSavedToOnline(false);
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
      <div className="flex justify-center items-center gap-2 flex-wrap">
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
        {savedToLocal ? (
          <Button
            onClick={() => {
              localStorage.clear();
              setSavedToLocal(false);
              setSavedToOnline(false);
              setFields({ userAddress: undefined, destAddress: undefined, destName: undefined, number: undefined, date: "", phone: undefined, name: "", logo: undefined });
              setItemRows([] as ItemRow[]);
            }}
            icon="trash"
          >
            Remove Local Data
          </Button>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full flex justify-center items-center flex-col">
        <div className="errors w-full flex flex-col gap-2 justify-center items-center">
          {mainErrors.map((error, i) => {
            return (
              <p key={i} className="text-red-500 dark:text-red-400 text-center">
                {error}
              </p>
            );
          })}
        </div>
        {savedToLocal ? (
          <div className="flex flex-col gap-2 justify-center items-center">
            <p className="text-emerald-500 dark:text-emerald-300">This form is saved to this browser.</p>
            {savedToOnline ? (
              <p className="text-emerald-500 dark:text-emerald-300">This form is saved online with the following name and code:</p>
            ) : (
              <p className="text-emerald-500 dark:text-emerald-300">Save this form to the cloud to access it from other devices!</p>
            )}
            <SaveOnlineField
              data={{ fieldValues: fields, itemRows: itemRows }}
              onSubmit={(values: { name: string; code: string }) => {
                localStorage.setItem("saveVals", JSON.stringify(values));
                setSavedCloudVals(values);
                setSavedToOnline(true);
              }}
              values={savedCloudVals}
            ></SaveOnlineField>
            {saveOnlineSuccessful ? <p className="text-emerald-500 dark:text-emerald-300">Saved Online! Use the same name and password to access.</p> : <></>}
          </div>
        ) : (
          <div className="mt-2 flex justify-center items-center flex-col">
            <p className="text-gray-500 dark:text-gray-400 my-2">Load a form from the cloud:</p>
            <SaveOnlineField
              load={true}
              onSubmit={(data: { data: { fieldValues: FieldValues; itemRows: ItemRow[] }; name: string }) => {
                console.log(data);
                setFields(data.data.fieldValues);
                setItemRows(
                  data.data.itemRows.map((x) => {
                    x.id = (Math.random() * 1000) | 0;
                    return x;
                  })
                );
                setSavedCloudVals({
                  name: data.name,
                  code: "",
                });
                setSavedToOnline(true);
              }}
            ></SaveOnlineField>
          </div>
        )}
      </div>
    </div>
  );
}
