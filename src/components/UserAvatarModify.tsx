// 基础 & 类型
import type { FC, PropsWithChildren } from "react";
import type { UserAvatarModifyParams } from "@/types";

// 组件
import {
  Modal,
  useModal,
  Radio,
  Spacer,
  Input,
  useInput,
  Text,
  useToasts,
} from "@geist-ui/core";
import { Edit3 } from "@geist-ui/icons";

// 接口 & 状态
import useUserData from "@/hooks/useUserData";
import { updateUserData } from "@/api";

// 工具函数 & 常量
import { useState, useMemo } from "react";
import { QQ_AVATAR_BASE, GRAVATAR_BASE } from "@/utils/config";
import { Md5 } from "ts-md5";
import { useMutation } from "@tanstack/react-query";

// 样式

interface Props {
  className?: string;
}

type AvatarType = "gravatar" | "qq";

const getUserAvatarUrl = (type: AvatarType, val: string) => {
  if (type === "gravatar") {
    return `${GRAVATAR_BASE}${Md5.hashStr(val)}?s=640`;
  } else {
    return `${QQ_AVATAR_BASE}${val}`;
  }
};

const UserAvatarModify: FC<PropsWithChildren<Props>> = ({
  children,
  className,
}) => {
  const { setVisible, bindings: modalBindings } = useModal();
  const { state: inputVal, bindings: inputBindings } = useInput("");
  const [avatarType, setAvatarType] = useState<AvatarType>("gravatar");
  const { userData, set } = useUserData();
  const { setToast } = useToasts();

  const mutate = useMutation({
    mutationKey: ["userdata", "action", "modify-avatar", userData?.id],
    mutationFn: ({ id, data }: { id: number; data: UserAvatarModifyParams }) =>
      updateUserData(id, data),
    onSuccess: (result) => {
      if (!result) return;

      if (result.data.code !== 0) {
        setToast({ text: result.data.msg, type: "error" });
        setVisible(false);
        return;
      }

      setToast({ text: "修改成功", type: "success" });
      setVisible(false);
      set(result.data.data);
    },
  });

  const handleTypeChange = (type: string | number) =>
    setAvatarType(type as AvatarType);

  const placeholder = useMemo(
    () => `请输入自定义${avatarType === "gravatar" ? "邮箱" : "QQ号"}`,
    [avatarType]
  );

  const handleConfirm = () => {
    const val =
      avatarType === "gravatar"
        ? inputVal || userData?.email || ""
        : inputVal || "10000";
    mutate.mutate({
      id: userData?.id || 0,
      data: {
        avatar: getUserAvatarUrl(avatarType, val),
      },
    });
  };

  return (
    <>
      <div className={[className, "tw-group tw-relative"].join(" ")}>
        <div className="group-hover:tw-opacity-70 tw-transition-opacity">
          {children}
        </div>
        <div
          className={[
            "tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2",
            "tw-opacity-0 group-hover:tw-opacity-100 tw-cursor-pointer tw-transition-opacity",
            "tw-p-2 tw-border tw-bg-gray-100 tw-shadow-sm tw-rounded-full tw-border-gray-300",
          ].join(" ")}
          onClick={() => setVisible(true)}
        >
          <Edit3 />
        </div>
      </div>
      <Modal {...modalBindings}>
        <Modal.Content>
          <Radio.Group value={avatarType} onChange={handleTypeChange} useRow>
            <Radio value="gravatar">
              Gravatar头像
              <Radio.Desc>默认根据当前用户邮箱获取</Radio.Desc>
            </Radio>
            <Radio value="qq">
              QQ头像
              <Radio.Desc>在下方输入QQ号获取</Radio.Desc>
            </Radio>
          </Radio.Group>

          <Spacer h={2}></Spacer>
          <Input
            {...inputBindings}
            placeholder={placeholder}
            width="100%"
          ></Input>
          <div className="tw-text-right">
            {avatarType === "qq" && (
              <Text i small type="secondary">
                *QQ号不会保存至服务器*
              </Text>
            )}
          </div>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          取消
        </Modal.Action>
        <Modal.Action onClick={handleConfirm}>提交</Modal.Action>
      </Modal>
    </>
  );
};

export default UserAvatarModify;
