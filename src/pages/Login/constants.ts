import { UserInputSchema } from "@/components/UserInput";
import type { UserLoginParams } from "@/types";

export const LOGIN_INPUT_SCHEMA: UserInputSchema<UserLoginParams> = [
  {
    title: "email",
    allowNull: false,
    inputBindings: {
      placeholder: "📮 邮箱",
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
