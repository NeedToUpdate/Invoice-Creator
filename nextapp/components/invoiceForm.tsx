import React from "react";
import InputField from "../components/inputField";
import PersonIcon from "../components/icons/person";
import HouseIcon from "../components/icons/house";
import SmallHouseIcon from "../components/icons/smallHouse";
import QuestionIcon from "../components/icons/question";
import CalendarIcon from "./icons/calendar";

export default function InvoiceForm() {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-primary-500">Create Your Invoice Now</h1>
      <InputField label="Name" placeholder="John Doe">
        <PersonIcon size="6"></PersonIcon>
      </InputField>
      <div className="flex w-full h-full gap-2">
        <div className="flex flex-col gap-2">
          <InputField label="Your Address" placeholder="1234 Name Street">
            <SmallHouseIcon size="6"></SmallHouseIcon>
          </InputField>
          <InputField label="Destination Address" placeholder="5678 Other Street">
            <HouseIcon size="6"></HouseIcon>
          </InputField>
        </div>
        <div className="flex flex-col gap-2">
          <InputField label="Reason" placeholder="Contract Work">
            <QuestionIcon size="6"></QuestionIcon>
          </InputField>
          <InputField withUnit="#" label="Invoice Number" placeholder="100 (leave blank to ignore)"></InputField>
          <InputField type="date" label="Date" placeholder="2022/12/31">
            <CalendarIcon></CalendarIcon>
          </InputField>
        </div>
      </div>
    </div>
  );
}
