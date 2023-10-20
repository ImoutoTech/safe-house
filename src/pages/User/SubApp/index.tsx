// 基础 & 类型
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 组件
import {
  Loading,
  Button,
  Spacer,
  useInput,
  Input,
  useKeyboard,
  KeyCode,
} from "@geist-ui/core";
import AppItem from "./AppItem";

// 接口 & 状态
import { getUserApp } from "@/api/SubApp";
import { useQuery } from "@tanstack/react-query";

// 工具函数 & 常量

// 样式
import styles from "./style.module.scss";

const SubApp = () => {
  const navi = useNavigate();

  const { state: inputText, bindings: inputBind } = useInput("");

  const [searchValue, setSearchValue] = useState("");

  const { bindings: enterBind } = useKeyboard(
    () => {
      setSearchValue(inputText);
    },
    [KeyCode.Enter],
    { disableGlobalEvent: true }
  );

  const {
    data,
    isFetching: loading,
    refetch,
  } = useQuery({
    queryKey: ["subapp", "list", searchValue],
    queryFn: ({ queryKey }) =>
      getUserApp(1, 500, queryKey[2]).then((res) => res.data),
  });

  return (
    <div className={styles.subapp}>
      <div className={styles.topbar}>
        <p>
          {!loading && data?.data ? `共${data.data.count}个子应用` : "加载中"}
        </p>
        <div className="tw-flex">
          <Input
            {...enterBind}
            {...inputBind}
            scale={4 / 3}
            placeholder="输入子应用名，回车筛选"
          />
          <Spacer w={1} />
          <Button type="success" auto onClick={() => navi("/user/app/new")}>
            注册子应用
          </Button>
        </div>
      </div>

      {loading && <Loading />}
      {!loading &&
        data?.data?.items.map((app) => (
          <div key={app.id} className="tw-mb-3">
            <AppItem app={app} onDel={refetch}></AppItem>
          </div>
        ))}
    </div>
  );
};

export default SubApp;
