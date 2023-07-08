import type { FC } from "react";
import type { UserInfo } from "@/types";

import { Image, Text } from "@geist-ui/core";

import { DEFAULT_AVATAR } from "@/utils/config";

export interface UserAvatarProps {
  user: UserInfo;
  showName?: boolean;
}

const UserAvatar: FC<UserAvatarProps> = ({
  user,
  showName = true,
}: UserAvatarProps) => {
  return (
    <div className="tw-w-32 tw-text-center">
      <Image
        src={user.avatar || DEFAULT_AVATAR}
        className="!tw-rounded-full"
        width={"128px"}
        height={"128px"}
      ></Image>
      {showName && <Text b>@{user.nickname}</Text>}
    </div>
  );
};

export default UserAvatar;
