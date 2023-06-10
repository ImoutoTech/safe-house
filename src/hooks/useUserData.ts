import { getUserData } from "@/api";
import store, { updateGlobalUser } from "@/store";
import { UserInfo } from "@/types";
import { hasLocalData } from "@/utils";
import storage from "@/utils/storage";
import { useRequest } from "ahooks";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

const useUserData = () => {
  const globalStore = useSnapshot(store);
  const [userData, setUserData] = useState<UserInfo>();

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
    setUserData(data);
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
    if (resData?.data?.data) {
      updateGlobalUser(resData.data.data);
      setUserData(resData.data.data);
    }
  }, [resData]);

  return {
    refresh,
    set,
    userData,
    loading,
  };
};

export default useUserData;
