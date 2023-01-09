import React, { ChangeEvent, useEffect, useState } from "react";
import Button from "./button";
import InputField from "./inputField";

interface props {
  values?: { name?: string; code?: string };
  load?: boolean;
  onSubmit?: Function;
  data?: object;
}

export default function SaveOnlineField(props: props) {
  const [values, setValues] = useState({ name: "", code: "" });
  const [errors, setErrors] = useState({ name: [] as string[], code: [] as string[] });
  useEffect(() => {
    if (props.values) {
      setValues({ name: props.values.name || "", code: props.values.code || "" });
    }
  }, [props.values]);
  return (
    <div className="flex justify-center items-center md:items-end md:flex-row flex-col gap-2">
      <InputField
        label="Name"
        placeholder="johns billing invoice"
        value={values.name}
        errors={errors.name}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
          setValues((old) => ({ ...old, name: ev.target.value }));
        }}
      ></InputField>
      <InputField
        label="Password"
        placeholder="password"
        type="password"
        value={values.code}
        errors={errors.code}
        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
          setValues((old) => ({ ...old, code: ev.target.value }));
        }}
      ></InputField>
      <Button
        icon="globe"
        onClick={() => {
          if (props.onSubmit) {
            props.onSubmit(values);
          }
        }}
      >
        Save Online
      </Button>
    </div>
  );
}
