// 基础 & 类型
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 组件
import { Loading, Table } from "@geist-ui/core";

// 接口 & 状态
import { getUserApp } from "@/api/SubApp";
import { useRequest } from "ahooks";

// 工具函数 & 常量
import { hasLocalData, getDayjs } from "@/utils";

// 样式

const SubApp = () => {
  const navi = useNavigate();
  const dayjs = getDayjs();

  const { data, loading, run } = useRequest(getUserApp, {
    manual: true,
  });

  useEffect(() => {
    if (!hasLocalData()) {
      navi("login");
      return;
    }

    run();
  }, []);

  return (
    <div>
      {loading && <Loading />}
      {data?.data.data && (
        <Table data={data.data.data}>
          <Table.Column label="名称" prop="name" />
          <Table.Column label="回调地址" prop="callback" />
          <Table.Column label="创建时间" prop="updated_at" />
          <Table.Column label="更新时间" prop="created_at" />
          <Table.Column label="操作" prop="operation" />
        </Table>
      )}
    </div>
  );
};

export default SubApp;
