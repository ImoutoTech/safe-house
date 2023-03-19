import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input, Spacer, Button, Grid } from "@geist-ui/core";
import { ENV } from "@/utils/config";

import GlobalContext from "@/context";

import styles from "./style.module.scss";

const Register = () => {
  const { globalData, updateGlobalData } = useContext(GlobalContext);

  useEffect(() => {
    updateGlobalData({
      ...globalData,
      title: `加入 ${ENV.TITLE}`,
    });
  }, []);

  return (
    <div className={styles.register}>
      <div className={styles.container}>
        <Input placeholder="📮 邮箱" width={"100%"}></Input>
        <Spacer h={0.5}></Spacer>
        <Input placeholder="🌍 用户名" width={"100%"}></Input>
        <Spacer h={0.5}></Spacer>
        <Input.Password placeholder="🔐 钥匙" width={"100%"}></Input.Password>
        <Spacer h={0.5}></Spacer>
        <Grid.Container gap={2} justify="space-between">
          <Grid xs>
            <div className={styles.login}>
              <Link to={"/login"}>返回</Link>
            </div>
          </Grid>
          <Grid xs className={styles.submit}>
            <Button shadow auto type="secondary">
              加入
            </Button>
          </Grid>
        </Grid.Container>
      </div>
    </div>
  );
};

export default Register;
