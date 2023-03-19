import { useContext, useEffect } from "react";
import { Input, Spacer, Button, Grid, Tooltip } from "@geist-ui/core";
import { Frown, Smile } from "@geist-ui/icons";
import { ENV } from "@/utils/config";

import GlobalContext from "@/context";

import styles from "./style.module.scss";

const Login = () => {
  const { globalData, updateGlobalData } = useContext(GlobalContext);

  useEffect(() => {
    updateGlobalData({
      ...globalData,
      title: `回到 ${ENV.TITLE}`,
    });
  }, []);

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <Input placeholder="🌍 用户名" width={"100%"}></Input>
        <Spacer h={0.5}></Spacer>
        <Input.Password placeholder="🔐 钥匙" width={"100%"}></Input.Password>
        <Spacer h={0.5}></Spacer>
        <Grid.Container gap={2} justify="space-between">
          <Grid xs>
            <Tooltip
              text={
                <span className="tw-h-full tw-flex tw-justify-center">
                  <Smile className="tw-mr-2 tw-inline-block" />
                  还没做
                </span>
              }
              placement="bottom"
              type="success"
            >
              <span className={styles.forget}>
                <Frown className="tw-mr-2" /> 找不到钥匙
              </span>
            </Tooltip>
          </Grid>
          <Grid xs className={styles.submit}>
            <Button shadow auto type="secondary">
              开门
            </Button>
          </Grid>
        </Grid.Container>
      </div>
    </div>
  );
};

export default Login;
