import { UserInputSchema } from "@/components/UserInput";
import type { UserAppRegParams } from "@/types";

export const SUBAPP_INPUT_SCHEMA: UserInputSchema<UserAppRegParams> = [
  {
    title: "name",
    allowNull: false,
    inputBindings: {
      placeholder: "应用名",
    },
  },
  {
    title: "callback",
    allowNull: false,
    inputBindings: {
      placeholder: "回调地址",
    },
  },
  {
    title: "description",
    allowNull: false,
    inputBindings: {
      placeholder: "描述",
    },
  },
];
