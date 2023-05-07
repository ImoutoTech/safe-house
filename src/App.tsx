import { useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

import { hasLocalData } from "./utils";

import styles from "./assets/app.module.scss";
import { ENV } from "./utils/config";

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
