import { getUserData } from "@/api";
import store, { updateGlobalUser } from "@/store";
import { UserInfo } from "@/types";
import { hasLocalData } from "@/utils";
import storage from "@/utils/storage";
import { useBoolean } from "ahooks";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { useQuery } from "@tanstack/react-query";

const useUserData = () => {
  const globalStore = useSnapshot(store);
  const [userData, setUserData] = useState<UserInfo>();
  const [isLoggedIn] = useBoolean(storage.has("id"));

  const query = useQuery({
    queryKey: ["userdata", "query", isLoggedIn ? storage.get("id") : "0"],
    queryFn: ({ queryKey }) => getUserData(Number(queryKey[2])),
    refetchOnWindowFocus: false,
    enabled: isLoggedIn,
    staleTime: Infinity,
  });

  const refresh = () => {
    !query.isFetching && query.refetch();
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
    if (query.data?.data?.data) {
      updateGlobalUser(query.data.data.data);
    }
  }, [query.data]);

  return {
    refresh,
    set,
    userData,
    loading: query.isFetching,
    isLoggedIn,
  };
};

export default useUserData;
