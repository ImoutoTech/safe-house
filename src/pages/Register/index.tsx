// 基础 & 类型
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserRegisterParams } from "@/types";

// 组件
import { Spacer, Button, Grid, useToasts } from "@geist-ui/core";
import UserInput from "@/components/UserInput";

// 接口 & 状态
import { UserRegister } from "@/api";

// 工具函数 & 常量
import { useRequest } from "ahooks";
import { REG_INPUT_SCHEMA } from "./constants";
import { Md5 } from "ts-md5";

// 样式
import styles from "./style.module.scss";

const Register = () => {
  const { setToast } = useToasts();
  const navi = useNavigate();
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
    const hasEmptyField = ["email", "password", "nickname"].some(
      (key) => !formData[key].length
    );

    if (hasEmptyField) {
      setToast({ text: "有什么忘了？", type: "error" });
      return;
    }

    const postData = {
      ...formData,
      password: Md5.hashStr(formData.password),
    };

    run(postData);
  };

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
              <Link to={"/login"}>我有钥匙</Link>
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
