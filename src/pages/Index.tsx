// 基础 & 类型
import { useNavigate } from "react-router-dom";

// 组件
import { Spacer, Button, Tooltip } from "@geist-ui/core";

// 接口 & 状态

// 工具函数 & 常量
import { hasLocalData } from "@/utils";

// 样式

const Index = () => {
  const navi = useNavigate();

  const handleClickLogin = () => {
    if (hasLocalData()) {
      navi("/user");
    } else {
      navi("/login");
    }
  };

  return (
    <div className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
      <div>
        <span className="tw-text-3xl tw-italic tw-opacity-60">
          你在森林中看到了一间小木屋
        </span>
        <Spacer h={2}></Spacer>
        <div className="tw-text-center">
          {!hasLocalData() && (
            <>
              <Tooltip text="“看，门外来了个新来的”" placement="bottom">
                <Button auto type="secondary" onClick={() => navi("/register")}>
                  敲敲门
                </Button>
              </Tooltip>
              <Spacer w={2} inline></Spacer>
            </>
          )}
          <Tooltip text={"你知道这里是哪里"} placement="bottom">
            <Button auto onClick={handleClickLogin}>
              推开门
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Index;
