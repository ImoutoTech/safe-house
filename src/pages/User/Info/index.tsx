// 基础 & 类型
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 组件
import {
  Image,
  Tag,
  Text,
  Tooltip,
  Button,
  Loading,
  Modal,
} from "@geist-ui/core";
import { LogOut } from "@geist-ui/icons";
import Modify from "./modify";

// 接口 & 状态
import storage from "@/utils/storage";
import { useBoolean } from "ahooks";
import useUserData from "@/hooks/useUserData";

// 工具函数 & 常量
import { ENV, Role } from "@/utils/config";
import { getDayjs } from "@/utils";

// 样式
import styles from "./style.module.scss";

const Info = () => {
  const dayjs = getDayjs();
  const [logoutVisible, { toggle: toggleLogout }] = useBoolean(false);
  const { userData, loading, refresh } = useUserData();

  const logout = () => {
    storage.clearSelf();
    toggleLogout();
    window.location.reload();
  };

  return (
    <div className={styles.info}>
      {(loading || !userData) && <Loading />}
      {!loading && userData && (
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
                {userData.nickname}{" "}
                <span className={styles.id}># {userData.id}</span>
              </h2>

              <div className={styles.footer}>
                <div className={styles.item}>
                  {userData.role === Role.ADMIN && (
                    <Tag type="success" invert>
                      管理员
                    </Tag>
                  )}
                  {userData.role === Role.USER && <Tag type="lite">用户</Tag>}
                </div>
                <div className={styles.item}>
                  <span>{userData.email}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.addition}>
            <Text span type="secondary">
              {userData.nickname} 的ID卡，签发于
            </Text>
            <Tooltip
              text={dayjs(userData.created_at).format("YYYY-MM-DD")}
              placement="right"
            >
              <Text b type="success" className="tw-ml-1 tw-opacity-50">
                {dayjs(userData.created_at).fromNow()}
              </Text>
            </Tooltip>
          </div>

          <div className={[styles.addition, "tw-my-12"].join(" ")}>
            <Button icon={<LogOut />} type="abort" auto onClick={toggleLogout}>
              离开 {ENV.TITLE}
            </Button>

            <Modify onConfirm={refresh} userData={userData}></Modify>
          </div>

          <Modal visible={logoutVisible} onClose={toggleLogout}>
            <Modal.Title>看向门</Modal.Title>
            <Modal.Subtitle>门缝中透出一丝光</Modal.Subtitle>
            <Modal.Content>确认要离开 {ENV.TITLE} 吗</Modal.Content>
            <Modal.Action passive onClick={({ close }) => close()}>
              关上门
            </Modal.Action>
            <Modal.Action onClick={logout}>打开门</Modal.Action>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Info;
