// 基础 & 类型
import { useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

// 组件

// 接口 & 状态

// 工具函数 & 常量
import { hasLocalData } from "./utils";
import { ENV } from "./utils/config";

// 样式
import styles from "./assets/app.module.scss";

function App() {
  const navi = useNavigate();

  useEffect(() => {
    if (!hasLocalData()) {
      navi("/login");
    } else {
      navi("/user");
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
