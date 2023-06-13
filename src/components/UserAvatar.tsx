import type { FC } from "react";
import type { UserInfo } from "@/types";

import { Image, Text } from "@geist-ui/core";

export interface UserAvatarProps {
  user: UserInfo;
  showName?: boolean;
}

const defaultAvatar = "https://cdn.exia.xyz/img/blog/kal.webp";

const UserAvatar: FC<UserAvatarProps> = ({
  user,
  showName = true,
}: UserAvatarProps) => {
  return (
    <div className="tw-w-32 tw-text-center">
      <Image
        src={user.avatar || defaultAvatar}
        className="!tw-rounded-full"
        width={"128px"}
        height={"128px"}
      ></Image>
      {showName && <Text b>@{user.nickname}</Text>}
    </div>
  );
};

export default UserAvatar;
