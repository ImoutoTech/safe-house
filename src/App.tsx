// 基础 & 类型
import { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

// 组件
import { ErrorBoundary } from "react-error-boundary";
import { Note, useToasts } from "@geist-ui/core";

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
  const { userData } = useUserData();
  const { setToast } = useToasts();

  const checkPathAuth = () => {
    const authLevel = pathNeedAuth(location.pathname);

    if ((authLevel === "login" || authLevel === "admin") && !hasLocalData()) {
      navi("/login");
      return;
    }

    if (!userData) {
      return;
    }

    if (authLevel === "admin" && userData?.role !== Role.ADMIN && userData) {
      setToast({ text: "暂无权限", type: "error" });
      navi("/");
      return;
    }
  };

  useEffect(() => {
    checkPathAuth();
  }, [location]);

  useEffect(() => {
    if (userData) {
      checkPathAuth();
    }
  }, [userData]);

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
