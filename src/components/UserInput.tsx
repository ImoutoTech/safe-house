import { useState } from "react";
import { Input, Spacer } from "@geist-ui/core";

import { UserLoginParams, UserRegisterParams } from "@/types";
import { cloneDeep } from "lodash-es";

interface UserInputProps {
  showNickname?: boolean;
  showPassword?: boolean;
  initData?: UserLoginParams;
  onChange?: (data: UserRegisterParams) => void;
}

function UserInput(props: UserInputProps) {
  const {
    showNickname = true,
    showPassword = true,
    onChange,
    initData,
  } = props;
  const [formData, setFormData] = useState<UserRegisterParams>({
    email: "",
    password: "",
    nickname: "",
    ...initData,
  });

  const [inputType, setInputType] = useState<
    Record<string, "default" | "error">
  >({
    email: "default",
    password: "default",
    nickname: "default",
  });

  const handleInput = (field: keyof UserRegisterParams, val: string) => {
    const oriForm = cloneDeep(formData);
    const oriType = cloneDeep(inputType);
    oriForm[field] = val;
    oriType[field] = "default";

    setFormData(oriForm);
    setInputType(oriType);

    onChange && onChange(oriForm);
  };

  return (
    <>
      <Input
        placeholder="📮 邮箱"
        width={"100%"}
        value={formData.email}
        onChange={(e) => handleInput("email", e.target.value)}
      ></Input>

      {showNickname && (
        <>
          <Spacer h={0.5}></Spacer>
          <Input
            placeholder="🌍 用户名"
            width={"100%"}
            value={formData.nickname}
            onChange={(e) => handleInput("nickname", e.target.value)}
          ></Input>
        </>
      )}
      {showPassword && (
        <>
          <Spacer h={0.5}></Spacer>
          <Input.Password
            placeholder="🔐 钥匙"
            width={"100%"}
            value={formData.password}
            onChange={(e) => handleInput("password", e.target.value)}
          ></Input.Password>
        </>
      )}
    </>
  );
}

export default UserInput;
