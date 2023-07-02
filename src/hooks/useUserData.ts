import { getUserData } from "@/api";
import store, { updateGlobalUser } from "@/store";
import { UserInfo } from "@/types";
import storage from "@/utils/storage";
import { useBoolean } from "ahooks";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { useQuery } from "@tanstack/react-query";

const useUserData = () => {
  const globalStore = useSnapshot(store);
  const [userData, setUserData] = useState<UserInfo>();
  const [isLoggedIn, { set: setLogged }] = useBoolean(storage.has("id"));

  const query = useQuery({
    queryKey: ["userdata", "query", isLoggedIn ? storage.get("id") : "0"],
    queryFn: ({ queryKey }) => getUserData(Number(queryKey[2])),
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
    setUserData(globalStore.userData);
  }, [globalStore.userData]);

  useEffect(() => {
    if (query.data?.data?.data) {
      updateGlobalUser(query.data.data.data);
    }
  }, [query.data]);

  const onStorageClear = () => {
    setLogged(false);
  };

  const onStorageSet = () => {
    setLogged(true);
  };

  useEffect(() => {
    window.addEventListener("clearStorage", onStorageClear, {
      capture: true,
      once: true,
    });

    return () => {
      window.removeEventListener("clearStorage", onStorageClear);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("setLocalData", onStorageSet, {
      capture: true,
      once: true,
    });

    return () => {
      window.removeEventListener("setLocalData", onStorageSet);
    };
  }, []);

  return {
    refresh,
    set,
    userData,
    loading: query.isFetching,
    isLoggedIn,
  };
};

export default useUserData;
