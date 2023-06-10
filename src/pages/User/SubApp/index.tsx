// 基础 & 类型
import { useEffect } from "react";

// 组件
import { Loading, Fieldset, Button, Spacer, Text, Dot } from "@geist-ui/core";

// 接口 & 状态
import { getUserApp } from "@/api/SubApp";
import { useRequest } from "ahooks";
import useUserData from "@/hooks/useUserData";

// 工具函数 & 常量
import { getDayjs } from "@/utils";

// 样式
import styles from "./style.module.scss";

const SubApp = () => {
  const dayjs = getDayjs();
  const { isLoggedIn } = useUserData();

  const { data, loading, run } = useRequest(getUserApp, {
    manual: true,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    run();
  }, []);

  return (
    <div className={styles.subapp}>
      <div className={styles.topbar}>
        <p>
          {!loading && data?.data.data
            ? `共${data.data.data.length}个子应用`
            : "加载中"}
        </p>
        <Button type="success" auto>
          注册子应用
        </Button>
      </div>

      {loading && <Loading />}
      {data?.data.data?.map((app) => (
        <div key={app.id} className="tw-mb-3">
          <Fieldset>
            <Fieldset.Title>
              <Dot type="success" /> {app.name}
            </Fieldset.Title>
            <Fieldset.Subtitle>
              回调地址:{" "}
              <Text span type="success">
                {app.callback}
              </Text>
            </Fieldset.Subtitle>
            <Fieldset.Footer>
              <Text type="secondary">
                创建于 {dayjs(app.created_at).format("YYYY-MM-DD")} | 最后编辑于{" "}
                {dayjs(app.created_at).fromNow()}
              </Text>
              <div>
                <Button auto scale={1 / 3} font="12px" type="error" ghost>
                  删除
                </Button>
                <Spacer w={1} inline />
                <Button auto scale={1 / 3} font="12px">
                  编辑
                </Button>
              </div>
            </Fieldset.Footer>
          </Fieldset>
        </div>
      ))}
    </div>
  );
};

export default SubApp;
