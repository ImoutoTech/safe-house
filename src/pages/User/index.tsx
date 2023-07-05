// 基础 & 类型
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

// 组件
import { Tabs } from "@geist-ui/core";

// 接口 & 状态
import useUserData from "@/hooks/useUserData";
import { Role } from "@/utils/config";

// 工具函数 & 常量

// 样式

type TabValue = "/user" | "/user/app" | "/user/admin";

const User = () => {
  const navi = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState<TabValue>("/user");
  const { userData } = useUserData();

  const handleTabChange = (val: string) => {
    if (!["/user/app", "/user", "/user/admin"].includes(val)) {
      return;
    }

    navi(val);
  };

  useEffect(() => {
    const validPath: TabValue[] = ["/user/app", "/user/admin", "/user"];

    for (let i = 0; i < validPath.length; i++) {
      if (location.pathname.includes(validPath[i])) {
        setTabValue(validPath[i]);
        break;
      }
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
        {userData && userData.role === Role.ADMIN && (
          <Tabs.Item label="⚙️ 管理" value="/user/admin" />
        )}
      </Tabs>
      <Outlet />
    </div>
  );
};

export default User;
