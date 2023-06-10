import { getUserData } from "@/api";
import store, { updateGlobalUser } from "@/store";
import { UserInfo } from "@/types";
import { hasLocalData } from "@/utils";
import storage from "@/utils/storage";
import { useRequest, useBoolean } from "ahooks";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

const useUserData = () => {
  const globalStore = useSnapshot(store);
  const [userData, setUserData] = useState<UserInfo>();
  const [isLoggedIn] = useBoolean(!!storage.get("id"));

  const {
    data: resData,
    loading,
    run,
  } = useRequest(getUserData, {
    manual: true,
  });

  const refresh = () => {
    run(storage.get("id"));
  };

  const set = (data: UserInfo) => {
    updateGlobalUser(data);
  };

  useEffect(() => {
    if (!hasLocalData()) {
      return;
    }

    if (!globalStore.userData) {
      // 请求数据
      refresh();
    } else {
      setUserData(globalStore.userData);
    }
  }, []);

  useEffect(() => {
    setUserData(globalStore.userData);
  }, [globalStore.userData]);

  useEffect(() => {
    if (resData?.data?.data) {
      updateGlobalUser(resData.data.data);
    }
  }, [resData]);

  return {
    refresh,
    set,
    userData,
    loading,
    isLoggedIn,
  };
};

export default useUserData;
