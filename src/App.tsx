// 基础 & 类型
import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

// 组件
import { ErrorBoundary } from "react-error-boundary";
import { Note } from "@geist-ui/core";

// 接口 & 状态
import useUserData from "./hooks/useUserData";

// 工具函数 & 常量
import { hasLocalData, pathNeedAuth } from "./utils";
import { ENV, Role } from "./utils/config";

// 样式
import styles from "./assets/app.module.scss";

function App() {
  const navi = useNavigate();
  const location = useLocation();
  const [lastPath, updateLast] = useState("/");
  const { userData } = useUserData();

  useEffect(() => {
    const authLevel = pathNeedAuth(location.pathname);
    console.log(authLevel, location);

    if (!hasLocalData() && (authLevel === "login" || authLevel === "admin")) {
      navi("/login");
      return;
    }

    if (userData?.role !== Role.ADMIN && userData && authLevel === "admin") {
      navi(lastPath);
      return;
    }

    updateLast(`${location.pathname}${location.search}`);
  }, [location]);

  const handleError = ({ error }: { error: Error }) => {
    return <Note type="error">{error.message}</Note>;
  };

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <h2>
          <Link to={"/"}>{ENV.TITLE}</Link>
        </h2>
      </div>
      <div className={styles.content}>
        <ErrorBoundary FallbackComponent={handleError}>
          <Outlet />
        </ErrorBoundary>
      </div>
      <div className={styles.footer}>
        <p>Made with ❤️ by youranreus</p>
      </div>
    </div>
  );
}

export default App;
