import { UserInputSchema } from "@/components/UserInput";
import type { UserModifyParams } from "@/types";

export const MODIFY_INPUT_SCHEMA: UserInputSchema<UserModifyParams> = [
  {
    title: "email",
    inputBindings: {
      placeholder: "📮 邮箱",
    },
  },
  {
    title: "nickname",
    inputBindings: {
      placeholder: "🌍 用户名",
    },
  },
];
