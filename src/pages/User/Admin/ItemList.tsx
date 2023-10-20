// 基础 & 类型
import { type FC, useMemo, useState } from "react";

// 组件
import {
  Text,
  Table,
  Pagination,
  Input,
  useInput,
  useKeyboard,
  KeyCode,
} from "@geist-ui/core";

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
  const [total, setTotal] = useState(0);
  const { state: inputText, bindings: inputBind } = useInput("");
  const [searchValue, setSearchValue] = useState("");

  const { bindings: enterBind } = useKeyboard(
    () => {
      setSearchValue(inputText);
      setPage(1);
    },
    [KeyCode.Enter],
    { disableGlobalEvent: true }
  );

  const isUser = (item: AppInfo | UserInfo): item is UserInfo =>
    !!(item as UserInfo).role;

  const dataFormatter = (item: AppInfo | UserInfo) => {
    item.created_at = dayjs(item.created_at).format("YYYY-MM-DD");
    if (isUser(item)) {
      item.role = item.role === Role.ADMIN ? "管理员" : "用户";
    }
    return item;
  };

  const { data } = useQuery({
    queryKey: ["user", "admin", type, "list", page, searchValue],
    queryFn: ({ queryKey }) =>
      api(Number(queryKey[4]), 10, `${queryKey[5]}`).then((res) => {
        const resData = res.data.data;
        setTotal(resData.count);
        return resData.items.map((item) => dataFormatter(item));
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
      <div className="tw-flex tw-justify-between tw-my-4">
        <Input
          {...enterBind}
          {...inputBind}
          scale={3 / 4}
          placeholder="回车筛选"
        />
        <Pagination
          count={Math.ceil(total / 10)}
          page={page}
          onChange={setPage}
        />
      </div>
    </>
  );
};

export default ItemList;
