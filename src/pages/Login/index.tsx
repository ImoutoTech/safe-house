import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Spacer, Button, Grid } from "@geist-ui/core";
import { ENV } from "@/utils/config";

import GlobalContext from "@/context";
import cloneDeep from "lodash-es/cloneDeep";
import { UserLogin } from "@/api";
import { useRequest } from "ahooks";
import { useToasts } from "@geist-ui/core";

import styles from "./style.module.scss";
import { UserLoginParams } from "@/types";
import storage from "@/utils/storage";

const Login = () => {
  const { setToast } = useToasts();
  const navi = useNavigate();
  const { globalData, updateGlobalData } = useContext(GlobalContext);
  const [formData, setFormData] = useState<UserLoginParams>({
    email: "",
    password: "",
  });

  const [inputType, setInputType] = useState<
    Record<string, "default" | "error">
  >({
    email: "default",
    password: "default",
  });

  const handleInput = (field: "email" | "password", val: string) => {
    const oriForm = cloneDeep(formData);
    const oriType = cloneDeep(inputType);
    oriForm[field] = val;
    oriType[field] = "default";

    setFormData(oriForm);
    setInputType(oriType);
  };

  const {
    data: result,
    loading,
    run,
  } = useRequest(UserLogin, {
    manual: true,
  });

  const submit = () => {
    const emptyField = ["email", "password"].reduce(
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
      title: `进入 ${ENV.TITLE}`,
    });
  }, []);

  useEffect(() => {
    if (!result) {
      return;
    }

    if (result?.data.code === 0) {
      storage.set("access_token", result.data.data.token);
      storage.set("refresh_token", result.data.data.refresh);
      storage.set("id", result.data.data.user.id);

      const newGlobal = {
        ...globalData,
        userData: result.data.data.user,
      };

      updateGlobalData(newGlobal);

      setToast({ text: "登录成功", type: "success" });
      navi("/user");
    } else {
      setToast({ text: result?.data.msg, type: "error" });
    }
  }, [result]);

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <Input
          placeholder="📮 邮箱"
          value={formData.email}
          onChange={(e) => handleInput("email", e.target.value)}
          width={"100%"}
          type={inputType.email}
        ></Input>
        <Spacer h={0.5}></Spacer>
        <Input.Password
          placeholder="🔐 钥匙"
          value={formData.password}
          onChange={(e) => handleInput("password", e.target.value)}
          width={"100%"}
          type={inputType.password}
        ></Input.Password>
        <Spacer h={0.5}></Spacer>
        <Grid.Container gap={2} justify="space-between">
          <Grid xs>
            <div className={styles.register}>
              <Link to={"/register"}>加入</Link>
            </div>
          </Grid>
          <Grid xs className={styles.submit}>
            <Button
              shadow
              auto
              type="secondary"
              onClick={submit}
              loading={loading}
            >
              开门
            </Button>
          </Grid>
        </Grid.Container>
      </div>
    </div>
  );
};

export default Login;
