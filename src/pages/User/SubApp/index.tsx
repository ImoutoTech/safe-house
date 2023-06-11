// 基础 & 类型
import { useNavigate } from "react-router-dom";

// 组件
import { Loading, Button } from "@geist-ui/core";
import AppItem from "./AppItem";

// 接口 & 状态
import { getUserApp } from "@/api/SubApp";
import { useQuery } from "@tanstack/react-query";

// 工具函数 & 常量

// 样式
import styles from "./style.module.scss";

const SubApp = () => {
  const navi = useNavigate();
  const { data, isFetching: loading } = useQuery({
    queryKey: ["subapp", "list"],
    queryFn: () => getUserApp().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  return (
    <div className={styles.subapp}>
      <div className={styles.topbar}>
        <p>
          {!loading && data?.data ? `共${data.data.length}个子应用` : "加载中"}
        </p>
        <Button type="success" auto onClick={() => navi("/user/app/new")}>
          注册子应用
        </Button>
      </div>

      {loading && <Loading />}
      {!loading &&
        data?.data?.map((app) => (
          <div key={app.id} className="tw-mb-3">
            <AppItem app={app}></AppItem>
          </div>
        ))}
    </div>
  );
};

export default SubApp;
