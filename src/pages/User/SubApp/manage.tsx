// 基础 & 类型
import { useState, useEffect } from "react";
import type { AppInfo, UserAppRegParams, Restful } from "@/types";
import type { AxiosResponse } from "axios";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

// 组件
import { Button, Text, Card, Spacer, useToasts, Loading } from "@geist-ui/core";
import UserInput from "@/components/UserInput";

// 接口 & 状态
import { regUserApp, getUserAppData, updateUserApp } from "@/api/SubApp";
import { useQuery, useMutation } from "@tanstack/react-query";

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

  const handleSubmitResult = (res: AxiosResponse<Restful<AppInfo>>) => {
    if (!res) return;

    if (res?.data.code !== 0) {
      setToast({ text: res?.data.msg, type: "error" });
      return;
    }

    setToast({ text: "操作成功", type: "success" });
    navi("/user/app");
  };

  const modMutate = useMutation({
    mutationKey: ["user", "subapp", "modify"],
    mutationFn: ({ id, data }: { id: string; data: UserAppRegParams }) =>
      updateUserApp(id, data),
    onSuccess: handleSubmitResult,
  });

  const regMutate = useMutation({
    mutationKey: ["user", "subapp", "reg"],
    mutationFn: regUserApp,
    onSuccess: handleSubmitResult,
  });

  const { data: originData, isFetching: loadingOrigin } = useQuery({
    queryKey: ["subapp", "modify", originAppId],
    queryFn: () => getUserAppData(originAppId).then((res) => res.data),
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

    type === PAGE_TYPE.MOD &&
      modMutate.mutate({ id: originAppId, data: formData });
    type === PAGE_TYPE.NEW && regMutate.mutate(formData);
  };

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
                loading={regMutate.isLoading || modMutate.isLoading}
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
