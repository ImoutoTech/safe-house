import { UserInputSchema } from "@/components/UserInput";
import type { UserModifyParams } from "@/types";

export const MODIFY_INPUT_SCHEMA: UserInputSchema<UserModifyParams> = [
  {
    title: "email",
    allowNull: false,
    inputBindings: {
      placeholder: "📮 邮箱",
    },
  },
  {
    title: "nickname",
    allowNull: false,
    inputBindings: {
      placeholder: "🌍 用户名",
    },
  },
];
