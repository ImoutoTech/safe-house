---
name: Safe House
description: 轻巧而俏皮的自托管身份数字门厅
colors:
  primary-key-green: "#18a058"
  primary-key-green-hover: "#36ad6a"
  primary-key-green-pressed: "#0c7a43"
  info-link-blue: "#2080f0"
  warning-amber: "#f0a020"
  danger-red: "#d03050"
  canvas-white: "#ffffff"
  text-strong: "rgb(31, 34, 37)"
  text-body: "rgb(51, 54, 57)"
  text-muted: "rgb(118, 124, 130)"
  border-soft: "rgb(224, 224, 230)"
  divider-faint: "rgb(239, 239, 245)"
  surface-subtle: "rgb(250, 250, 252)"
typography:
  display:
    fontFamily: "Lato, v-sans, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.6
  headline:
    fontFamily: "Lato, v-sans, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.6
  title:
    fontFamily: "Lato, v-sans, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.6
  body:
    fontFamily: "Lato, v-sans, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Lato, v-sans, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.6
rounded:
  compact: "2px"
  control: "3px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary-key-green}"
    textColor: "{colors.canvas-white}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "34px"
  button-primary-hover:
    backgroundColor: "{colors.primary-key-green-hover}"
    textColor: "{colors.canvas-white}"
    rounded: "{rounded.control}"
  button-secondary:
    backgroundColor: "rgba(46, 51, 56, .05)"
    textColor: "{colors.text-body}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "34px"
  input-default:
    backgroundColor: "transparent"
    textColor: "{colors.text-body}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "34px"
  card-default:
    backgroundColor: "{colors.canvas-white}"
    textColor: "{colors.text-body}"
    rounded: "{rounded.control}"
    padding: "19px 24px 20px"
---

# Design System: Safe House

## Overview

**Creative North Star: "数字门厅"**

Safe House 的界面像一处明亮、安静的数字门厅：用户可以迅速辨认入口、钥匙、身份与即将进入的应用。大量白色空间和低对比度边界让界面退居幕后，绿色主操作像清晰可见的开门信号，中文微文案和少量 emoji 则保留个人项目特有的轻松感。

这套系统轻巧而俏皮，但不靠堆叠装饰制造个性。俏皮来自“钥匙”“开门”“加入”等贴合产品的语言、适度的 emoji 和简短反馈；操作结构仍遵循清楚、克制、可预测的工具界面逻辑。

**Key Characteristics:**

- 明亮白底、低饱和中性色和稀疏的状态色。
- 居中窄栏、轻量卡片、明确的纵向任务流。
- 紧凑的 Lato 正文字体与少量斜体、emoji 个性点。
- 轻圆角、细边界和只在必要处出现的柔和阴影。
- 中文优先，技术信息清楚但不过度企业化。

## Colors

色彩以白色和清淡灰阶构成门厅空间，钥匙绿只负责主要行动，蓝、黄、红分别承担信息、警告和危险语义。

### Primary

- **钥匙绿**：用于主要按钮、活动标签、输入焦点和加载状态，是最明确的“可以继续”信号。
- **亮钥匙绿**：仅用于悬停和聚焦反馈，让控件显得灵敏而不跳脱。
- **深钥匙绿**：用于按下状态，提供短促、可信的触感反馈。

### Secondary

- **链接蓝**：用于信息型文本、身份编号和次要导航提示；不能取代钥匙绿成为全局主色。

### Tertiary

- **门铃琥珀**：用于需要注意但不阻断的状态和构建信息。
- **警戒红**：用于删除、解绑、错误和拒绝等高风险语义。

### Neutral

- **门厅白**：页面、卡片、模态框和输入区域的主要底色。
- **墨黑标题**：标题与最高优先级信息。
- **石墨正文**：表单、说明和普通操作文字。
- **雾灰辅助字**：时间、访问次数、占位信息和次要说明。
- **软边界灰**：输入、卡片和默认按钮的可见边界。
- **微分隔灰**：页头、页脚、列表与标签页的轻量分隔。
- **浅层表面灰**：卡片 action 区、禁用输入和嵌套内容区。

### Named Rules

**The One Key Rule.** 同一操作组只让一个主要动作使用钥匙绿；其他动作保持中性，危险动作使用警戒红。

**The Semantic Blue Rule.** 蓝色只表达信息和链接，不把整个产品染成企业蓝。

## Typography

**Display Font:** Lato（回退至 v-sans、系统无衬线字体）  
**Body Font:** Lato（回退至 v-sans、系统无衬线字体）  
**Label/Mono Font:** v-mono（回退至 SFMono-Regular、Menlo、Consolas、Courier）

**Character:** Lato 提供清楚、略带人情味的几何结构，适合中英文混排的紧凑工具界面。层级主要依赖字号、字重和透明度，不依赖全大写或夸张字距。

### Hierarchy

- **Display**（400，1.875rem，1.6）：首页欢迎语；使用斜体和较低不透明度，移动端收至 1.6rem。
- **Headline**（600，28px，1.6）：全局页头中的产品标题。
- **Title**（500，16px，1.6）：卡片标题、结果标题和关键任务标题。
- **Body**（400，14px，1.6）：默认正文、表单和按钮文字。
- **Label**（500，12px，1.6）：标签、状态、构建信息和紧凑辅助信息。

### Named Rules

**The Quiet Hierarchy Rule.** 优先用 400/500/600 三档字重、字号和灰度建立层级，不用大面积粗体或全大写制造压迫感。

## Layout

界面采用居中、纵向的任务流。登录与注册表单固定为 300px 窄栏；授权与回调卡片控制在约 460–480px；用户工作区以 768px 为主宽度；管理配置页最大约 900px，并在 768px 以上切换为双列。页面页头与页脚各占 64px，中间内容区独立滚动或居中。

空间节奏以 8、12、16、24px 为核心，48–60px 只用于页面级留白。移动端以 768px 为主要断点，容器退让至 92–95vw；极窄对话框在 400px 以下使用 90% 宽度。不要用无约束的满宽表单或密集仪表盘取代这些清晰的任务尺度。

## Elevation & Depth

系统在静止状态下以平面和细边界为主，卡片自身不依靠强阴影区分层级。阴影用于模态、弹出层、工具提示或确实脱离页面平面的容器；嵌套层级优先通过门厅白、浅层表面灰和分隔线表达。

### Shadow Vocabulary

- **轻浮层**：用于小型弹出内容和轻量悬浮容器，保持扩散、低不透明度。
- **中浮层**：用于下拉菜单、选择器和需要覆盖页面内容的浮层。
- **高浮层**：用于模态等最上层交互，不用于普通卡片。

### Named Rules

**The Flat Hall Rule.** 页面与普通卡片默认保持平面；只有真正浮在内容之上的交互层才获得阴影。

## Shapes

控件和容器使用轻微圆角：普通按钮、输入和卡片为 3px，紧凑标签与小型元素为 2px，身份编号等特殊标签可以使用完整胶囊形。形状应显得精确而轻巧，不能扩大为柔软、厚重的大圆角卡片体系。边框通常为 1px，并保持低对比度。

## Components

组件整体“轻巧而俏皮”：结构克制，反馈迅速，个性主要由文案、emoji 和恰当的状态色承担。

### Buttons

- **Shape:** 轻微圆角（3px），默认高度 34px，普通横向内边距 14px。
- **Primary:** 钥匙绿底配门厅白文字；每个操作组只保留一个主要按钮。
- **Hover / Focus:** 悬停提亮为亮钥匙绿；聚焦使用同色边界或低透明度外环；按下切换为深钥匙绿。
- **Secondary / Ghost / Tertiary:** 使用透明或极浅中性底色；文字操作适合“加入”“编辑”“复制 ID”等低优先级动作。
- **Danger:** 删除和解绑使用警戒红，但保持与其他按钮一致的轻量体积。

### Chips

- **Style:** 2px 轻圆角或胶囊形；使用状态色的浅色底、同色文字，通常不需要明显边框。
- **State:** 只承载身份、角色、运行状态和构建信息，不作为主要导航。

### Cards / Containers

- **Corner Style:** 轻圆角（3px）。
- **Background:** 以门厅白为主；嵌套内容和 action 区可使用浅层表面灰。
- **Shadow Strategy:** 普通卡片无强阴影，依赖软边界和空间分组。
- **Border:** 1px 低对比边界。
- **Internal Padding:** 默认约 19px 24px 20px；紧凑卡片使用更小的组件库规格。

### Inputs / Fields

- **Style:** 透明白底、1px 软边界、3px 圆角，默认高度 34px，横向内边距 12px。
- **Focus:** 边界切换为亮钥匙绿，并出现低透明度的 2px 绿色聚焦环。
- **Error / Disabled:** 错误使用警戒红边界与聚焦环；禁用态使用浅层表面灰并降低内容对比度。

### Navigation

全局导航保持极简：64px 页头只承载居中的产品标题，工作区内部使用线型标签页。活动项与悬停项使用钥匙绿；移动端保留相同结构，通过容器缩放和换行适配，不引入厚重侧栏。

### Identity Actions

登录和注册流程将普通认证动作写成“钥匙”“开门”“加入”，并允许与字段语义匹配的小型 emoji。授权页面回到更直接的“批准”“拒绝”表达，确保安全决策不会被隐喻遮蔽。

## Do's and Don'ts

### Do:

- **Do** 使用居中窄栏和明确的单任务卡片，让一般用户一眼理解当前动作。
- **Do** 在中文微文案中保留 Safe House 的钥匙与门厅隐喻，并让 emoji 服务于识别。
- **Do** 使用钥匙绿表示唯一主要动作，链接蓝、门铃琥珀和警戒红保持语义专用。
- **Do** 以 8、12、16、24px 的紧凑节奏组织组件，并在移动端让容器退让至视口。
- **Do** 对授权范围、客户端、密钥和危险操作使用直接、清楚的语言。

### Don't:

- **Don't** 把界面做成大面积企业蓝、通用 SaaS 仪表盘或匿名后台模板。
- **Don't** 使用厚重阴影、深色安全产品外壳或庞大的控制台侧栏制造“安全感”。
- **Don't** 依靠渐变、玻璃拟态、巨型圆角、装饰插画或无关动效堆叠个性。
- **Don't** 在同一操作组放置多个同等醒目的钥匙绿按钮。
- **Don't** 让俏皮隐喻取代授权、错误与危险操作所需的准确说明。
