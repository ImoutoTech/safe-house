// 基础 & 类型
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 组件

// 接口 & 状态

// 工具函数 & 常量
import { hasLocalData } from "@/utils";

// 样式

const Index = () => {
  const navi = useNavigate();

  useEffect(() => {
    if (!hasLocalData()) {
      navi("/login");
    } else {
      navi("/user");
    }
  }, []);

  return <></>;
};

export default Index;
