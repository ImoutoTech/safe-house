// 基础 & 类型
import { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

// 组件
import { Card } from "@geist-ui/core";

// 接口 & 状态

// 工具函数 & 常量
import { hasLocalData } from "./utils";
import { ENV } from "./utils/config";

// 样式
import styles from "./assets/app.module.scss";

function App() {
  const navi = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("🤔 location 是 ", location);
    // if (!hasLocalData()) {
    //   navi("/");
    // } else {
    //   navi("/user");
    // }
  }, [location]);

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <h2>
          <Link to={"/"}>{ENV.TITLE}</Link>
        </h2>
      </div>
      <div className={styles.content}>
        <Card className="!tw-h-full">
          <Card.Body className="!tw-h-full">
            <Outlet />
          </Card.Body>
        </Card>
      </div>
      <div className={styles.footer}>
        <p>Made with ❤️ by youranreus</p>
      </div>
    </div>
  );
}

export default App;
