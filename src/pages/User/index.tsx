// 基础 & 类型
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

// 组件
import { Tabs } from "@geist-ui/core";

// 接口 & 状态

// 工具函数 & 常量

// 样式

const User = () => {
  const navi = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState<"/user" | "/user/app">("/user");

  const handleTabChange = (val: string) => {
    if (val !== "/user" && val !== "/user/app") {
      return;
    }

    navi(val);
  };

  useEffect(() => {
    if (location.pathname.includes("/user/app")) {
      setTabValue("/user/app");
    } else {
      setTabValue("/user");
    }
  }, [location]);

  return (
    <div className="">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        hideDivider
        hideBorder
        align={"center"}
      >
        <Tabs.Item label="🏷 身份证件" value="/user" />
        <Tabs.Item label="📦 子应用" value="/user/app" />
      </Tabs>
      <Outlet />
    </div>
  );
};

export default User;
