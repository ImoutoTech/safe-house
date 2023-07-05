// 基础 & 类型

// 组件
import ItemList from "./ItemList";
import { Spacer } from "@geist-ui/core";

// 接口 & 状态

// 工具函数 & 常量

// 样式

const Admin = () => {
  return (
    <>
      <ItemList type="user"></ItemList>
      <ItemList type="app"></ItemList>
    </>
  );
};

export default Admin;
