import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

import GlobalContext from "./context";
import storage from "./utils/storage";

import styles from "./assets/app.module.scss";
import type { IGlobalData } from "./context/types";
import { ENV } from "./utils/config";

function App() {
  const navi = useNavigate();

  const [globalData, updateGlobalData] = useState<IGlobalData>({
    title: ENV.TITLE,
  });

  useEffect(() => {
    if (!storage.has("refresh_token") || !storage.has("access_token")) {
      navi("/login");
    } else {
      navi("/user");
    }
  }, []);

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
