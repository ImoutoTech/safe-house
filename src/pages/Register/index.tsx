// 基础 & 类型
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { UserRegisterParams } from "@/types";

// 组件
import { Spacer, Button, Grid, useToasts } from "@geist-ui/core";
import UserInput from "@/components/UserInput";

// 接口 & 状态
import { UserRegister } from "@/api";

// 工具函数 & 常量
import { useMutation } from "@tanstack/react-query";
import { REG_INPUT_SCHEMA } from "./constants";
import { Md5 } from "ts-md5";

// 样式
import styles from "./style.module.scss";

const Register = () => {
  const { setToast } = useToasts();
  const navi = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectApp = searchParams.get("app");
  const [formData, setFormData] = useState<UserRegisterParams>({
    email: "",
    password: "",
    nickname: "",
  });

  const mutate = useMutation({
    mutationKey: ["user", "action", "register"],
    mutationFn: ({ data }: { data: UserRegisterParams }) => UserRegister(data),
    onSuccess: (result) => {
      if (!result) {
        return;
      }

      if (result?.data.code === 0) {
        setToast({ text: "注册成功", type: "success" });

        if (redirectApp) {
          navi(`/login?app=${redirectApp}`);
        } else {
          navi("/login");
        }
      } else {
        setToast({ text: result?.data.msg, type: "error" });
      }
    },
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

    mutate.mutate({ data: postData });
  };

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
              <Link to={redirectApp ? `/login?app=${redirectApp}` : "/login"}>
                我有钥匙
              </Link>
            </div>
          </Grid>
          <Grid xs className={styles.submit}>
            <Button
              shadow
              auto
              type="secondary"
              onClick={submit}
              loading={mutate.isLoading}
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
