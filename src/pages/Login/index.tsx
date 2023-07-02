// 基础 & 类型
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { UserLoginParams } from "@/types";

// 组件
import { Spacer, Button, Grid } from "@geist-ui/core";
import UserInput from "@/components/UserInput";

// 接口 & 状态
import { UserLogin } from "@/api";
import useUserData from "@/hooks/useUserData";

// 工具函数 & 常量
import { useMutation } from "@tanstack/react-query";
import { useToasts } from "@geist-ui/core";
import { Md5 } from "ts-md5";
import { LOGIN_INPUT_SCHEMA } from "./constants";
import storage from "@/utils/storage";

// 样式
import styles from "./style.module.scss";

const Login = () => {
  const { setToast } = useToasts();
  const navi = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectApp = searchParams.get("app");
  const { set: updateGlobalUser } = useUserData();
  const [formData, setFormData] = useState<UserLoginParams>({
    email: "",
    password: "",
  });

  const mutate = useMutation({
    mutationKey: ["user", "action", "login"],
    mutationFn: ({ data }: { data: UserLoginParams }) => UserLogin(data),
    onSuccess: (result) => {
      if (!result) {
        return;
      }

      if (result?.data.code === 0) {
        storage.set("access_token", result.data.data.token);
        storage.set("refresh_token", result.data.data.refresh);
        storage.set("id", result.data.data.user.id);

        updateGlobalUser(result.data.data.user);
        window.dispatchEvent(new Event("setLocalData"));

        setToast({ text: "登录成功", type: "success" });
        if (redirectApp) {
          navi(`/callback/${redirectApp}`);
        } else {
          navi("/user");
        }
      } else {
        setToast({ text: result?.data.msg, type: "error" });
      }
    },
  });

  const handleChange = (data: UserLoginParams) => {
    setFormData(data);
  };

  const submit = () => {
    const hasEmptyField = ["email", "password"].some(
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
    <div className={styles.login}>
      <div className={styles.container}>
        <UserInput
          initData={formData}
          schema={LOGIN_INPUT_SCHEMA}
          onChange={handleChange}
        ></UserInput>
        <Spacer h={0.5}></Spacer>
        <Grid.Container gap={2} justify="space-between">
          <Grid xs>
            <div className={styles.register}>
              <Link
                to={redirectApp ? `/register?app=${redirectApp}` : "/register"}
              >
                加入
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
              开门
            </Button>
          </Grid>
        </Grid.Container>
      </div>
    </div>
  );
};

export default Login;
