import { useState, useEffect } from "react";
import { Button, Modal, useModal, useToasts } from "@geist-ui/core";

import { useSnapshot } from "valtio";
import store, { updateGlobalUser } from "@/store";

import { updateUserData } from "@/api";
import { Edit } from "@geist-ui/icons";
import { UserModifyParams } from "@/types";
import UserInput from "@/components/UserInput";
import { useRequest } from "ahooks";
import storage from "@/utils/storage";
import { MODIFY_INPUT_SCHEMA } from "./constants";

const Modify = () => {
  const globalData = useSnapshot(store);
  const { setToast } = useToasts();
  const { setVisible, bindings } = useModal(false);
  const [formData, setFormData] = useState<UserModifyParams>({
    email: globalData.userData?.email || "",
    nickname: globalData.userData?.nickname || "",
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
    run(globalData.userData?.id || storage.get("id"), formData);
  };

  const handleCloseDialog = () => {
    setFormData({
      email: globalData.userData?.email || "",
      nickname: globalData.userData?.nickname || "",
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

    updateGlobalUser(result.data.data);
    setToast({ text: "修改成功", type: "success" });
    setVisible(false);
  }, [result]);

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
