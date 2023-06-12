// 基础 & 类型
import type { AppInfo } from "@/types";
import { useNavigate } from "react-router-dom";

// 组件
import { Fieldset, Button, Spacer, Text, Dot, useToasts } from "@geist-ui/core";

// 接口 & 状态
import { delUserApp } from "@/api/SubApp";

// 工具函数 & 常量
import { getDayjs } from "@/utils";
import { useMutation } from "@tanstack/react-query";

// 样式

export interface AppItemProps {
  app: AppInfo;
  onDel: () => void;
}

const AppItem: React.FC<AppItemProps> = ({ app, onDel }: AppItemProps) => {
  const dayjs = getDayjs();
  const navi = useNavigate();
  const { setToast } = useToasts();

  const goEdit = () => {
    navi(`/user/app/modify?app=${app.id}`);
  };

  const mutate = useMutation({
    mutationKey: ["user", "subapp", "delete"],
    mutationFn: ({ id }: { id: string }) => delUserApp(id),
    onSuccess: (result) => {
      if (result?.data.code === 0) {
        setToast({ text: "删除成功", type: "success" });
        onDel();
      } else {
        setToast({ text: result?.data.msg, type: "error" });
      }
    },
  });

  return (
    <Fieldset>
      <Fieldset.Title>
        <Dot type="success" /> {app.name}
      </Fieldset.Title>
      <Fieldset.Subtitle>
        回调地址:{" "}
        <Text span type="success">
          {app.callback}
        </Text>
      </Fieldset.Subtitle>
      <Fieldset.Footer>
        <Text type="secondary">
          创建于 {dayjs(app.created_at).format("YYYY-MM-DD")} | 最后编辑于{" "}
          {dayjs(app.created_at).fromNow()}
        </Text>
        <div>
          <Button
            auto
            scale={1 / 3}
            font="12px"
            type="error"
            ghost
            onClick={() => mutate.mutate({ id: app.id })}
            loading={mutate.isLoading}
          >
            删除
          </Button>
          <Spacer w={1} inline />
          <Button auto scale={1 / 3} font="12px" onClick={goEdit}>
            编辑
          </Button>
        </div>
      </Fieldset.Footer>
    </Fieldset>
  );
};

export default AppItem;
