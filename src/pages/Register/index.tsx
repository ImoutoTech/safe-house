import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spacer, Button, Grid, useToasts } from "@geist-ui/core";
import UserInput from "@/components/UserInput";
import { ENV } from "@/utils/config";

import GlobalContext from "@/context";

import styles from "./style.module.scss";
import { UserRegisterParams } from "@/types";
import { UserRegister } from "@/api";
import { useRequest } from "ahooks";
import { REG_INPUT_SCHEMA } from "./constants";

const Register = () => {
  const { setToast } = useToasts();
  const navi = useNavigate();
  const { globalData, updateGlobalData } = useContext(GlobalContext);
  const [formData, setFormData] = useState<UserRegisterParams>({
    email: "",
    password: "",
    nickname: "",
  });

  const {
    data: result,
    loading,
    run,
  } = useRequest(UserRegister, {
    manual: true,
  });

  const handleChange = (data: UserRegisterParams) => {
    setFormData(data);
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
        <UserInput
          initData={formData}
          schema={REG_INPUT_SCHEMA}
          onChange={handleChange}
        ></UserInput>
        <Spacer h={0.5}></Spacer>
        <Grid.Container gap={2} justify="space-between">
          <Grid xs>
            <div className={styles.login}>
              <Link to={"/login"}>返回</Link>
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
              加入
            </Button>
          </Grid>
        </Grid.Container>
      </div>
    </div>
  );
};

export default Register;
