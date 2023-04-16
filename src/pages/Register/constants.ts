import { UserInputSchema } from "@/components/UserInput";
import type { UserModifyParams } from "@/types";

export const REG_INPUT_SCHEMA: UserInputSchema<UserModifyParams> = [
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
  {
    title: "password",
    allowNull: false,
    password: true,
    inputBindings: {
      placeholder: "🔐 钥匙",
    },
  },
];
