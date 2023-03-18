import { Outlet } from "react-router-dom";
import { ENV } from "./utils/config";

import styles from "./assets/app.module.scss";

function App() {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <h2>🏠 {ENV.TITLE}</h2>
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
