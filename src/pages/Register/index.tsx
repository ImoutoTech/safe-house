import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Spacer, Button, Grid, useToasts } from "@geist-ui/core";
import { ENV } from "@/utils/config";

import GlobalContext from "@/context";

import styles from "./style.module.scss";
import { UserRegisterParams } from "@/types";
import cloneDeep from "lodash-es/cloneDeep";
import { UserRegister } from "@/api";
import { useRequest } from "ahooks";
import storage from "@/utils/storage";

const Register = () => {
  const { setToast } = useToasts();
  const navi = useNavigate();
  const { globalData, updateGlobalData } = useContext(GlobalContext);
  const [formData, setFormData] = useState<UserRegisterParams>({
    email: "",
    password: "",
    nickname: "",
  });

  const [inputType, setInputType] = useState<
    Record<string, "default" | "error">
  >({
    email: "default",
    password: "default",
    nickname: "default",
  });

  const {
    data: result,
    loading,
    run,
  } = useRequest(UserRegister, {
    manual: true,
  });

  const handleInput = (field: keyof UserRegisterParams, val: string) => {
    const oriForm = cloneDeep(formData);
    const oriType = cloneDeep(inputType);
    oriForm[field] = val;
    oriType[field] = "default";

    setFormData(oriForm);
    setInputType(oriType);
  };

  const submit = () => {
    const emptyField = ["email", "password", "nickname"].reduce(
      (p: string[], c: string) => {
        if (!formData[c]) {
          return [...p, c];
        }
        return p;
      },
      [] as string[]
    );

    if (emptyField.length) {
      const obj = cloneDeep(inputType);
      emptyField.forEach((key) => {
        obj[key] = "error";
      });
      setInputType(obj);
      setToast({ text: "有什么忘了？", type: "error" });
      return;
    }

    run(formData);
  };

  useEffect(() => {
    updateGlobalData({
      ...globalData,
      title: `加入 ${ENV.TITLE}`,
    });
  }, []);

  useEffect(() => {
    if (!result) {
      return;
    }

    if (result?.data.code === 0) {
      setToast({ text: "注册成功", type: "success" });
      navi("/login");
    } else {
      setToast({ text: result?.data.msg, type: "error" });
    }
  }, [result]);

  return (
    <div className={styles.register}>
      <div className={styles.container}>
        <Input
          placeholder="📮 邮箱"
          width={"100%"}
          value={formData.email}
          onChange={(e) => handleInput("email", e.target.value)}
        ></Input>
        <Spacer h={0.5}></Spacer>
        <Input
          placeholder="🌍 用户名"
          width={"100%"}
          value={formData.nickname}
          onChange={(e) => handleInput("nickname", e.target.value)}
        ></Input>
        <Spacer h={0.5}></Spacer>
        <Input.Password
          placeholder="🔐 钥匙"
          width={"100%"}
          value={formData.password}
          onChange={(e) => handleInput("password", e.target.value)}
        ></Input.Password>
        <Spacer h={0.5}></Spacer>
        <Grid.Container gap={2} justify="space-between">
          <Grid xs>
            <div className={styles.login}>
              <Link to={"/login"}>返回</Link>
            </div>
          </Grid>
          <Grid xs className={styles.submit}>
            <Button shadow auto type="secondary" onClick={submit}>
              加入
            </Button>
          </Grid>
        </Grid.Container>
      </div>
    </div>
  );
};

export default Register;
