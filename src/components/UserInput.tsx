import { useState } from "react";
import { Input, Spacer } from "@geist-ui/core";

import { cloneDeep } from "lodash-es";

export type UserInputSchema<T> = {
  title: keyof T;
  inputBindings: Record<string, string | boolean>;
}[];

interface UserInputProps<T extends Record<string, string>> {
  initData: T;
  schema: UserInputSchema<T>;
  onChange?: (data: T) => void;
}

function UserInput<T extends Record<string, string>>(props: UserInputProps<T>) {
  const { onChange, initData, schema } = props;
  const [formData, setFormData] = useState<T>(initData);

  const initInputType: Record<string, string> = {};
  Object.keys(initData).forEach((key) => (initInputType[key] = "default"));

  const [inputType, setInputType] = useState(
    initInputType as Record<keyof T, "default" | "error">
  );

  const handleInput = (field: keyof T, val: string) => {
    const oriForm = cloneDeep(formData);
    const oriType = cloneDeep(inputType);
    oriForm[field] = val as T[keyof T];
    oriType[field] = "default";

    setFormData(oriForm);
    setInputType(oriType);

    onChange && onChange(oriForm);
  };

  return (
    <>
      {schema.map((item, index) => (
        <div key={item.title as string}>
          <Input
            {...item.inputBindings}
            width={"100%"}
            value={formData[item.title]}
            onChange={(e) => handleInput(item.title, e.target.value)}
          ></Input>
          {index !== schema.length - 1 && <Spacer h={0.5}></Spacer>}
        </div>
      ))}
    </>
  );
}

export default UserInput;
