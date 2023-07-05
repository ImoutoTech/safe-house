// 基础 & 类型
import { type FC, useMemo, useState } from "react";

// 组件
import { Text, Table, ButtonGroup, Button } from "@geist-ui/core";

// 接口 & 状态
import { getAllUser, getAllApp } from "@/api";

// 工具函数 & 常量
import { useQuery } from "@tanstack/react-query";
import { AppInfo, UserInfo } from "@/types";
import { getDayjs } from "@/utils";
import { Role } from "@/utils/config";

// 样式

export interface AdminItemListProps {
  type: "user" | "app";
}

const ItemList: FC<AdminItemListProps> = ({ type }: AdminItemListProps) => {
  const title = useMemo(
    () => (type === "user" ? "用户列表" : "子应用列表"),
    [type]
  );
  const dayjs = getDayjs();

  const api = type === "user" ? getAllUser : getAllApp;
  const [page, setPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);

  const isUser = (item: AppInfo | UserInfo): item is UserInfo =>
    !!(item as UserInfo).role;

  const dataFormatter = (item: AppInfo | UserInfo) => {
    item.created_at = dayjs(item.created_at).format("YYYY-MM-DD");
    if (isUser(item)) {
      item.role = item.role === Role.ADMIN ? "管理员" : "用户";
    }
    return item;
  };

  const { data, isFetching: loading } = useQuery({
    queryKey: ["user", "admin", type, "list", page],
    queryFn: ({ queryKey }) =>
      api(Number(queryKey[4])).then((res) => {
        const resData = res.data.data;
        if (resData.length < 10) {
          setIsEnd(true);
        }
        return resData.map((item) => dataFormatter(item));
      }),
    keepPreviousData: true,
    initialData: [],
  });

  return (
    <>
      <Text h4>{title}</Text>
      {type === "user" && (
        <Table data={data as UserInfo[]}>
          <Table.Column prop="id" label="ID" />
          <Table.Column prop="nickname" label="昵称" />
          <Table.Column prop="email" label="邮箱" />
          <Table.Column prop="created_at" label="创建于" />
          <Table.Column prop="role" label="角色" />
        </Table>
      )}
      {type === "app" && (
        <Table data={data as AppInfo[]}>
          <Table.Column prop="name" label="昵称" />
          <Table.Column prop="owner" label="所有者" />
          <Table.Column prop="created_at" label="创建于" />
          <Table.Column prop="visitNum" label="访问次数" />
        </Table>
      )}
      <div className="tw-flex tw-justify-center tw-my-4">
        <ButtonGroup scale={0.5}>
          <Button
            scale={0.5}
            disabled={page === 1 || loading}
            onClick={() => setPage(page - 1)}
          >
            上一页
          </Button>
          <Button
            scale={0.5}
            disabled={isEnd || loading}
            onClick={() => setPage(page + 1)}
          >
            下一页
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};

export default ItemList;
