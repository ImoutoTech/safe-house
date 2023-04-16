import { useContext, useState } from "react";
import { Button, Modal, useModal } from "@geist-ui/core";

import GlobalContext from "@/context";

import { Edit } from "@geist-ui/icons";
import { UserModifyParams } from "@/types";
import UserInput from "@/components/UserInput";

const Modify = () => {
  const { globalData, updateGlobalData } = useContext(GlobalContext);
  const { setVisible, bindings } = useModal(false);
  const [formData, setFormData] = useState<UserModifyParams>({
    email: globalData.userData?.email || "",
    password: "",
    nickname: globalData.userData?.nickname || "",
  });

  const onChangeData = (data: UserModifyParams) => {
    console.log(data);
  };

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
            showNickname={true}
            initData={formData}
            onChange={onChangeData}
          ></UserInput>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          取消
        </Modal.Action>
        <Modal.Action>提交</Modal.Action>
      </Modal>
    </>
  );
};

export default Modify;
