// 基础 & 类型
import { useNavigate, useParams } from "react-router-dom";

// 组件
import { Button, Text, Card, Note } from "@geist-ui/core";
import UserAvatar from "@/components/UserAvatar";

// 接口 & 状态
import { getUserAppData, callbackUserApp } from "@/api/SubApp";
import useUserData from "@/hooks/useUserData";

// 工具函数 & 常量
import { useMutation, useQuery } from "@tanstack/react-query";
import storage from "@/utils/storage";

// 样式

const Callback = () => {
  const navi = useNavigate();
  const { appId } = useParams();
  const { isLoggedIn, loading: userDataLoading, userData } = useUserData();

  const appQuery = useQuery({
    queryKey: ["app", "query", appId],
    queryFn: ({ queryKey }) =>
      getUserAppData(queryKey[2] || "").then((res) => res.data.data),
    refetchOnWindowFocus: false,
  });

  const cbMutate = useMutation({
    mutationKey: ["app", "callback", appId],
    mutationFn: callbackUserApp,
    onSuccess: (res) => {
      const { data } = appQuery;
      window.location.replace(
        `${data?.callback}?ticket=${res.data.data.ticket}`
      );
    },
  });

  const redirect = (type: "login" | "register") => {
    if (type === "register") {
      navi(`/register?app=${appId}`);
    } else {
      if (isLoggedIn) {
        storage.clearSelf();
        window.location.replace(`${window.location.origin}/login?app=${appId}`);
        return;
      }

      navi(`/login?app=${appId}`);
    }
  };

  return (
    <div className="tw-w-full tw-h-[600px] tw-flex tw-items-center tw-justify-center">
      <div className="tw-w-[400px]">
        <Text h4 className="tw-text-center">
          正在登录到「{appQuery.data?.name}」
        </Text>
        <Card hoverable>
          {/* 本地存在用户数据 */}
          {isLoggedIn && userDataLoading && (
            <Note label="加载中">检测到已登录用户</Note>
          )}
          {userData && !userDataLoading && (
            <div className="tw-text-center tw-flex tw-justify-center tw-my-4">
              <UserAvatar user={userData} />
            </div>
          )}

          {/* 本地无用户数据 */}
          {!isLoggedIn && <Note>本地无已登录用户</Note>}

          <div className="tw-text-center tw-mt-4">
            {userData && (
              <Button
                auto
                className="!tw-mr-2"
                scale={0.75}
                onClick={() => redirect("login")}
              >
                切换账号
              </Button>
            )}
            {userData && (
              <Button
                auto
                type="success"
                scale={0.75}
                loading={cbMutate.isLoading}
                onClick={() => cbMutate.mutate(appId as string)}
              >
                使用该账号登录
              </Button>
            )}
            {!isLoggedIn && (
              <Button
                auto
                className="!tw-mr-2"
                scale={0.75}
                onClick={() => redirect("register")}
              >
                注册
              </Button>
            )}
            {!isLoggedIn && (
              <Button
                auto
                type="success"
                scale={0.75}
                onClick={() => redirect("login")}
              >
                登录
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Callback;
