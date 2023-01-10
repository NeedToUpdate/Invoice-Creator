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
  const emptyErrors = { name: [] as string[], code: [] as string[] };
  const [values, setValues] = useState({ name: "", code: "" });
  const [errors, setErrors] = useState(emptyErrors);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);
  useEffect(() => {
    if (props.values) {
      if (props.values.code && props.values.name) {
        setValues({ name: props.values.name, code: props.values.code });
        setAlreadySaved(true);
      }
    }
  }, [props.values]);
  const handleLoad = async () => {
    setErrors(emptyErrors);
    setButtonDisabled(true);
    let hasErrors = false;
    if (!values.code || values.code == "") {
      setErrors((old) => ({ ...old, code: ["Please enter your password."] }));
      hasErrors = true;
    }
    if (!values.name || values.name == "") {
      setErrors((old) => ({ ...old, name: ["Please enter a name."] }));
      hasErrors = true;
    }
    if (hasErrors) {
      setButtonDisabled(false);
      return;
    }
    const searchParams = new URLSearchParams();
    searchParams.set("name", values.name);
    searchParams.set("code", values.code);
    const res = await fetch("/api/invoice?" + searchParams.toString(), { method: "GET" });
    if (res.status !== 200) {
      setErrors({ name: ["This name and password combination is invalid"], code: [] });
      setButtonDisabled(false);
      return;
    }
    if (props.onSubmit) {
      const json = await res.json();
      props.onSubmit(json);
    }
    setButtonDisabled(false);
  };
  const handleSubmit = async () => {
    setErrors(emptyErrors);
    setButtonDisabled(true);
    let hasErrors = false;
    if (!values.code || values.code == "") {
      setErrors((old) => ({ ...old, code: ["Please enter a password."] }));
      hasErrors = true;
    }
    if (!values.name || values.name == "") {
      setErrors((old) => ({ ...old, name: ["Please enter a name. Case-insensitive."] }));
      hasErrors = true;
    }
    if (hasErrors) {
      setButtonDisabled(false);
      return;
    }
    const res = await fetch("/api/invoice", { method: "POST", body: JSON.stringify({ ...values, data: props.data }) });
    if (res.status === 204 || res.status === 200) {
      setButtonDisabled(false);
      if (props.onSubmit) {
        props.onSubmit(values);
      }
      return;
    }
    setErrors({ name: ["This name is invalid."], code: [] });
    setButtonDisabled(false);
  };
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
        disabled={buttonDisabled}
        icon="globe"
        onClick={() => {
          if (props.load) {
            handleLoad();
          } else {
            handleSubmit();
          }
        }}
      >
        {props.load ? "Load From Cloud" : alreadySaved ? "Update Saved Data" : "Save To Cloud"}
      </Button>
    </div>
  );
}
