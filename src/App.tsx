import { useState } from "react";
import { Outlet, Link } from "react-router-dom";

import GlobalContext from "./context";

import styles from "./assets/app.module.scss";
import { IGlobalData } from "./context/types";
import { ENV } from "./utils/config";

function App() {
  const [globalData, updateGlobalData] = useState<IGlobalData>({
    title: ENV.TITLE,
  });

  return (
    <GlobalContext.Provider
      value={{
        globalData,
        updateGlobalData,
      }}
    >
      <div className={styles.layout}>
        <div className={styles.header}>
          <h2>
            <Link to={"/"}>{globalData.title}</Link>
          </h2>
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
        <div className={styles.footer}>
          <p>Made with ❤️ by youranreus</p>
        </div>
      </div>
    </GlobalContext.Provider>
  );
}

export default App;
