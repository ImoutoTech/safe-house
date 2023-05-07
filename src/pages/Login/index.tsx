// 基础 & 类型
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserLoginParams } from "@/types";

// 组件
import { Spacer, Button, Grid } from "@geist-ui/core";
import UserInput from "@/components/UserInput";

// 接口 & 状态
import { UserLogin } from "@/api";
import { updateGlobalUser } from "@/store";

// 工具函数 & 常量
import { useRequest } from "ahooks";
import { useToasts } from "@geist-ui/core";
import { Md5 } from "ts-md5";
import { LOGIN_INPUT_SCHEMA } from "./constants";
import storage from "@/utils/storage";

// 样式
import styles from "./style.module.scss";

const Login = () => {
  const { setToast } = useToasts();
  const navi = useNavigate();
  const [formData, setFormData] = useState<UserLoginParams>({
    email: "",
    password: "",
  });

  const {
    data: result,
    loading,
    run,
  } = useRequest(UserLogin, {
    manual: true,
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

    run(postData);
  };

  useEffect(() => {
    if (!result) {
      return;
    }

    if (result?.data.code === 0) {
      storage.set("access_token", result.data.data.token);
      storage.set("refresh_token", result.data.data.refresh);
      storage.set("id", result.data.data.user.id);

      updateGlobalUser(result.data.data.user);

      setToast({ text: "登录成功", type: "success" });
      navi("/user");
    } else {
      setToast({ text: result?.data.msg, type: "error" });
    }
  }, [result]);

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
