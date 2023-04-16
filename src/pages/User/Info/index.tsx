import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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

import GlobalContext from "@/context";

import { ENV, Role } from "@/utils/config";
import styles from "./style.module.scss";
import { hasLocalData, getDayjs } from "@/utils";
import { getUserData } from "@/api";
import storage from "@/utils/storage";
import { useRequest, useBoolean } from "ahooks";

const Info = () => {
  const navi = useNavigate();
  const dayjs = getDayjs();
  const { globalData, updateGlobalData } = useContext(GlobalContext);
  const [logoutVisible, { toggle: toggleLogout }] = useBoolean(false);

  const {
    data: userData,
    loading,
    run,
  } = useRequest(getUserData, {
    manual: true,
  });

  const logout = () => {
    storage.clearSelf();
    toggleLogout();
    window.location.reload();
  };

  useEffect(() => {
    if (!hasLocalData()) {
      navi("login");
      return;
    }

    if (!globalData.userData) {
      // 请求数据
      run(storage.get("id"));
    }
  }, []);

  useEffect(() => {
    if (userData?.data?.data) {
      updateGlobalData({
        ...globalData,
        userData: userData.data.data,
      });
    }
  }, [userData]);

  return (
    <div className={styles.info}>
      {(loading || !globalData.userData) && <Loading />}
      {!loading && globalData.userData && (
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
                {globalData.userData.nickname}{" "}
                <span className={styles.id}># {globalData.userData.id}</span>
              </h2>

              <div className={styles.footer}>
                <div className={styles.item}>
                  {globalData.userData.role === Role.ADMIN && (
                    <Tag type="success" invert>
                      管理员
                    </Tag>
                  )}
                  {globalData.userData.role === Role.USER && (
                    <Tag type="lite">用户</Tag>
                  )}
                </div>
                <div className={styles.item}>
                  <span>{globalData.userData.email}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.addition}>
            <Text span type="secondary">
              {globalData.userData.nickname} 的ID卡，签发于
            </Text>
            <Tooltip
              text={dayjs(globalData.userData.created_at).format("YYYY-MM-DD")}
              placement="right"
            >
              <Text b type="success" className="tw-ml-1 tw-opacity-50">
                {dayjs(globalData.userData.created_at).fromNow()}
              </Text>
            </Tooltip>
          </div>

          <div className={[styles.addition, "tw-my-12"].join(" ")}>
            <Button icon={<LogOut />} type="abort" auto onClick={toggleLogout}>
              离开 {ENV.TITLE}
            </Button>

            <Modify></Modify>
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
