// 基础 & 类型
import { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

// 组件
import { Card } from "@geist-ui/core";

// 接口 & 状态

// 工具函数 & 常量
import { hasLocalData, pathNeedAuth } from "./utils";
import { ENV } from "./utils/config";

// 样式
import styles from "./assets/app.module.scss";

function App() {
  const navi = useNavigate();
  const location = useLocation();

  // 这里只负责页面首次加载的鉴权
  useEffect(() => {
    if (!hasLocalData() && pathNeedAuth(location.pathname)) {
      navi("/");
    }
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <h2>
          <Link to={"/"}>{ENV.TITLE}</Link>
        </h2>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
      <div className={styles.footer}>
        <p>Made with ❤️ by youranreus</p>
      </div>
    </div>
  );
}

export default App;
