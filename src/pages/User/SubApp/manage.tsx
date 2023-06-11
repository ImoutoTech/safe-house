// 基础 & 类型
import { useState, useEffect } from "react";
import type { UserAppRegParams } from "@/types";
import { useParams, useNavigate } from "react-router-dom";

// 组件
import { Button, Text, Card, Spacer, useToasts } from "@geist-ui/core";
import UserInput from "@/components/UserInput";

// 接口 & 状态
import { regUserApp } from "@/api/SubApp";
import { useRequest } from "ahooks";

// 工具函数 & 常量
import { SUBAPP_INPUT_SCHEMA } from "./constants";

// 样式

enum PAGE_TYPE {
  NEW = "new",
  MOD = "modify",
}

const Manage = () => {
  const { type } = useParams();
  const navi = useNavigate();
  const { setToast } = useToasts();
  const [formData, setFormData] = useState<UserAppRegParams>({
    name: "",
    callback: "",
  });

  const {
    data: result,
    run,
    loading,
  } = useRequest(regUserApp, {
    manual: true,
  });

  const onChangeData = (data: UserAppRegParams) => {
    setFormData(data);
  };

  const onSubmit = () => {
    const hasEmptyField = ["name", "callback"].some(
      (key) => !formData[key].length
    );

    if (hasEmptyField) {
      setToast({ text: "有什么忘了？", type: "error" });
      return;
    }

    run(formData);
  };

  useEffect(() => {
    if (!result) return;

    if (result.data.code !== 0) {
      setToast({ text: result.data.msg, type: "error" });
      return;
    }

    setToast({ text: "操作成功", type: "success" });
    navi("/user/app");
  }, [result]);

  return (
    <div className="tw-h-[calc(100%-59px)] tw-flex tw-items-center tw-justify-center">
      <Card width="500px">
        <Text h4>{type === PAGE_TYPE.NEW ? "创建" : "编辑"}子应用</Text>
        <UserInput
          schema={SUBAPP_INPUT_SCHEMA}
          initData={formData}
          onChange={onChangeData}
        ></UserInput>
        <Spacer />
        <div className="tw-flex tw-justify-end">
          <Button
            auto
            type="success-light"
            loading={loading}
            onClick={onSubmit}
          >
            提交
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Manage;
