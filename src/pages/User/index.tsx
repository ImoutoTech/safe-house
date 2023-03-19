import { useState } from "react";
import { Tabs } from "@geist-ui/core";
import { Outlet, useNavigate } from "react-router-dom";

const User = () => {
  const navi = useNavigate();
  const [tabValue, setTabValue] = useState<"/user" | "/user/app">("/user");

  const handleTabChange = (val: string) => {
    if (val !== "/user" && val !== "/user/app") {
      return;
    }

    navi(val);
    setTabValue(val);
  };

  return (
    <div>
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
