// 基础 & 类型
import { useState, useEffect } from "react";
import type { UserAppRegParams } from "@/types";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

// 组件
import { Button, Text, Card, Spacer, useToasts, Loading } from "@geist-ui/core";
import UserInput from "@/components/UserInput";

// 接口 & 状态
import { regUserApp, callbackUserApp, updateUserApp } from "@/api/SubApp";
import { useRequest } from "ahooks";
import { useQuery } from "@tanstack/react-query";

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
  const [searchParams] = useSearchParams();
  const originAppId = searchParams.get("app") || "";
  const [formData, setFormData] = useState<UserAppRegParams>({
    name: "",
    callback: "",
  });

  const {
    data: regResult,
    run: submitReg,
    loading: regLoading,
  } = useRequest(regUserApp, {
    manual: true,
  });

  const {
    data: modResult,
    run: submitMod,
    loading: modLoading,
  } = useRequest(updateUserApp, {
    manual: true,
  });

  const { data: originData, isFetching: loadingOrigin } = useQuery({
    queryKey: ["subapp", "modify", originAppId],
    queryFn: () => callbackUserApp(originAppId).then((res) => res.data),
    refetchOnWindowFocus: false,
    enabled: !!originAppId,
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

    type === PAGE_TYPE.MOD && submitMod(originAppId, formData);
    type === PAGE_TYPE.NEW && submitReg(formData);
  };

  useEffect(() => {
    if (!regResult && !modResult) return;
    const res = !regResult ? modResult : regResult;

    if (res?.data.code !== 0) {
      setToast({ text: res?.data.msg, type: "error" });
      return;
    }

    setToast({ text: "操作成功", type: "success" });
    navi("/user/app");
  }, [regResult, modResult]);

  useEffect(() => {
    if (originData) {
      setFormData({
        name: originData.data.name,
        callback: originData.data.callback,
      });
    }
  }, [originData]);

  return (
    <div className="tw-h-[calc(100%-59px)] tw-flex tw-items-center tw-justify-center">
      <Card width="500px">
        <Text h4>{type === PAGE_TYPE.NEW ? "创建" : "编辑"}子应用</Text>
        {!loadingOrigin && (
          <>
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
                loading={regLoading || modLoading}
                onClick={onSubmit}
              >
                提交
              </Button>
            </div>
          </>
        )}
        {loadingOrigin && (
          <div className="tw-h-[136px] tw-w-full tw-flex tw-justify-center tw-items-center">
            <Loading />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Manage;
