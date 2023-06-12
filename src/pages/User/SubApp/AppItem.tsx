// 基础 & 类型
import type { AppInfo } from "@/types";
import { useNavigate } from "react-router-dom";

// 组件
import { Fieldset, Button, Spacer, Text, Dot } from "@geist-ui/core";

// 接口 & 状态

// 工具函数 & 常量
import { getDayjs } from "@/utils";

// 样式

export interface AppItemProps {
  app: AppInfo;
}

const AppItem: React.FC<AppItemProps> = ({ app }: AppItemProps) => {
  const dayjs = getDayjs();
  const navi = useNavigate();

  const goEdit = () => {
    navi(`/user/app/modify?app=${app.id}`);
  };

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
          <Button auto scale={1 / 3} font="12px" type="error" ghost>
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
