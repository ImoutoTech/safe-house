// 基础 & 类型
import { useState, useEffect } from "react";
import type { UserModifyParams } from "@/types";

// 组件
import { Button, Modal, useModal, useToasts } from "@geist-ui/core";
import { Edit } from "@geist-ui/icons";
import UserInput from "@/components/UserInput";

// 接口 & 状态
import { updateUserData } from "@/api";
import useUserData from "@/hooks/useUserData";

// 工具函数 & 常量
import { useRequest } from "ahooks";
import storage from "@/utils/storage";
import { MODIFY_INPUT_SCHEMA } from "./constants";

// 样式

const Modify = () => {
  const { setToast } = useToasts();
  const { setVisible, bindings } = useModal(false);
  const { userData, set } = useUserData();
  const [formData, setFormData] = useState<UserModifyParams>({
    email: "",
    nickname: "",
  });

  const {
    data: result,
    run,
    loading,
  } = useRequest(updateUserData, {
    manual: true,
  });

  const onChangeData = (data: UserModifyParams) => {
    setFormData(data);
  };

  const handleSubmit = () => {
    run(userData?.id || storage.get("id"), formData);
  };

  const handleCloseDialog = () => {
    setFormData({
      email: userData?.email || "",
      nickname: userData?.nickname || "",
    });
    setVisible(false);
  };

  useEffect(() => {
    if (!result) return;

    if (result.data.code !== 0) {
      setToast({ text: result.data.msg, type: "error" });
      setVisible(false);
      return;
    }

    setToast({ text: "修改成功", type: "success" });
    setVisible(false);
    set(result.data.data);
  }, [result]);

  useEffect(() => {
    if (userData) {
      setFormData({
        email: userData.email,
        nickname: userData.nickname,
      });
    }
  }, [userData]);

  return (
    <>
      <Button
        icon={<Edit />}
        auto
        type="abort"
        onClick={() => setVisible(true)}
      >
        编辑信息
      </Button>
      <Modal {...bindings}>
        <Modal.Title>Remake</Modal.Title>
        <Modal.Subtitle>这次要用什么身份</Modal.Subtitle>
        <Modal.Content>
          <UserInput
            schema={MODIFY_INPUT_SCHEMA}
            initData={formData}
            onChange={onChangeData}
          ></UserInput>
        </Modal.Content>
        <Modal.Action passive onClick={handleCloseDialog}>
          取消
        </Modal.Action>
        <Modal.Action onClick={handleSubmit} loading={loading}>
          提交
        </Modal.Action>
      </Modal>
    </>
  );
};

export default Modify;
