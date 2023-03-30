import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Tag, Spacer, Text, Tooltip, Button } from "@geist-ui/core";
import { LogOut } from "@geist-ui/icons";

import GlobalContext from "@/context";

import { ENV } from "@/utils/config";
import styles from "./style.module.scss";
import { hasLocalData } from "@/utils";

const Info = () => {
  const navi = useNavigate();
  const { globalData, updateGlobalData } = useContext(GlobalContext);

  useEffect(() => {
    if (!hasLocalData()) {
      navi("login");
      return;
    }

    if (!globalData.userData) {
      // 请求数据
    }
  }, []);

  return (
    <div className={styles.info}>
      <div className={styles["card-wrapper"]}>
        <div className={styles["info-card"]}>
          <Image
            className={styles.avatar}
            src="https://cdn.exia.xyz/img/blog/kal.webp"
            alt="user"
            width="150px"
            height="150px"
          />
          <div className={styles.meta}>
            <h2>
              User <span className={styles.id}># 26</span>
            </h2>

            <div className={styles.footer}>
              <div className={styles.item}>
                <Tag type="success" invert>
                  管理员
                </Tag>
                <Spacer w={0.5} inline />
                <Tag type="lite">用户</Tag>
              </div>
              <div className={styles.item}>
                <span>youranreus@qq.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.addition}>
          <Text span type="secondary">
            User 的ID卡，签发于
          </Text>
          <Tooltip text="2023年x月x日" placement="right">
            <Text b type="success" className="tw-ml-1 tw-opacity-50">
              20天前
            </Text>
          </Tooltip>
        </div>

        <div className={[styles.addition, "tw-my-12"].join(" ")}>
          <Button icon={<LogOut />} type="abort" auto>
            离开 {ENV.TITLE}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Info;
