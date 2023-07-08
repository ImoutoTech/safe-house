// 基础 & 类型
import { type FC, type PropsWithChildren, type ReactNode } from "react";

// 组件
import { Modal } from "@geist-ui/core";

// 接口 & 状态

// 工具函数 & 常量
import { ENV } from "@/utils/config";
import { useBoolean } from "ahooks";
import storage from "@/utils/storage";

// 样式

interface Props {
  className?: string;
}

const UserLogout: FC<PropsWithChildren<Props>> = ({ children, className }) => {
  const [logoutVisible, { toggle: toggleLogout }] = useBoolean(false);

  const logout = () => {
    storage.clearSelf();
    toggleLogout();
    window.location.reload();
  };

  return (
    <>
      {children && (
        <div className={className} onClick={toggleLogout}>
          {children}
        </div>
      )}
      <Modal visible={logoutVisible} onClose={toggleLogout}>
        <Modal.Title>看向门</Modal.Title>
        <Modal.Subtitle>门缝中透出一丝光</Modal.Subtitle>
        <Modal.Content>确认要离开 {ENV.TITLE} 吗</Modal.Content>
        <Modal.Action passive onClick={({ close }) => close()}>
          关上门
        </Modal.Action>
        <Modal.Action onClick={logout}>打开门</Modal.Action>
      </Modal>
    </>
  );
};

export default UserLogout;
