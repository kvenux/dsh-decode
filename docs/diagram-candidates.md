# cw-uml 还能加哪些图（参考 Mermaid、PlantUML）

日期：2026-11-04

## 判断标准

一种图值得做，要同时满足三条：

1. 有常见的读者问题，现在的 8 种图答不好。
2. 模型只读代码就能填对。不需要数字、git 历史、运行结果。
3. 段落能点亮图里的某一部分（cw-uml 的核心是“图跟着段落走”）。

每多一种图，模型选错图的机会也多一些。所以每种新图必须对应一类问题。

## 来源（已核对官网，2026-11-04）

- Mermaid（31 种）：Flowchart、Swimlanes β、Sequence、Class、State、ER、User Journey、Gantt、Pie、Quadrant、Requirement、Use Case β、GitGraph、C4、Mindmap、Timeline、ZenUML、Sankey、XY Chart、Block、Packet、Kanban、Architecture β、Radar β、Event Modeling、Treemap、Venn β、Ishikawa、Wardley β、Cynefin β、TreeView β。
- PlantUML：UML 9 种（sequence、usecase、class、object、activity、component、deployment、state、timing），非 UML 有 JSON、YAML、EBNF、Regex、nwdiag、Salt、Archimate、SDL、Ditaa、Gantt、Chronology、MindMap、WBS、Math、IE、ER(Chen)、Chart、Files。

## 结论

### 值得做（按优先级）

| # | 图 | 来自 | 回答什么问题 | 段落点亮什么 |
|---|---|---|---|---|
| 1 | 数据样例图（一条真实记录展开成树） | PlantUML JSON/YAML、object | 配置文件、消息、日志记录长什么样 | 某个键或某一层 |
| 2 | 时序图：分段线、参与者分组框 | PlantUML `== ==`、`box`；Mermaid `box`、`rect` | 长流程分几个阶段，每个参与者属于哪个模块 | 一个阶段的所有消息 |
| 3 | 思维导图（功能和概念的分类） | Mermaid mindmap；PlantUML MindMap/WBS | 有哪些功能，怎么分类 | 一个分支 |
| 4 | 用例图：RepoCompass 直接放开 | cw-uml 已有 | 谁能用它做什么（给不写代码的人） | 一个用例 |

说明：

- **1**：类图只给出字段名，不写值。不写代码的人看一条样例更容易懂。样例可以从测试数据、示例配置、文档里读到。
- **2**：只改样式，不加新图型。分组框可以直接用现在的目录配色。
- **3**：现在“有哪些模块”只能用组件图画。组件图的箭头表示依赖，但很多分类之间没有依赖关系。
- **4**：用例图不用新写画法，只要改校验和提示词。

### 看具体问题再定

| 图 | 来自 | 适合的问题 | 不急着做的原因 |
|---|---|---|---|
| 鱼骨图 | Mermaid Ishikawa | 为什么会失败，可能的原因按类分开 | 需要先确认这类问题常见 |
| 复合状态 | 两家的状态图都有 | 生命周期里有子状态 | 当前问题里少见 |
| 语法图 | PlantUML EBNF/Regex | 命令行参数、配置写法 | 只适合命令行类仓库 |
| 事件建模 | Mermaid Event Modeling | 命令 → 事件 → 读出的视图 | 只适合事件溯源系统 |
| 时序状态图 | cw-uml 已有 timing | 超时、重试、心跳 | 时间值要靠估计 |

### 不做

| 图 | 原因 |
|---|---|
| Pie、XY、Sankey、Quadrant、Radar、Chart、Treemap、Venn | 要数字，读代码得不到可靠的数字，容易编造 |
| Gantt、Timeline、Chronology、GitGraph | 要时间或 git 历史，插件不能运行命令 |
| ER、IE | 类图已经覆盖；最多给类图关系加上数量（1、多个） |
| C4、Architecture、Block、nwdiag | 部署图和组件图已经覆盖 |
| Files、TreeView | 面板里已经有仓库地图 |
| Salt 线框图 | 从界面代码推出布局容易画错 |
| Journey、Kanban、Requirement、Wardley、Cynefin、Archimate、SDL、Ditaa、Math | 不是读代码时会问的问题 |

## 每种新图的成本

- cw-uml 画法：布局、点亮、悬停、导出 Markdown。
- check.js 校验和自动修复。
- 提示词：给出示例，说明什么问题选这种图。
- 验证：先离线渲染已存的回答；再跑少量真实问答，看模型是否选对、填对。真实问答要消耗 token，跑之前先确认。

## 已验证与推测

- 已验证：两家的图型列表（官网）；cw-uml 的时序图没有分段线、分组框、激活条，状态图没有复合状态（查过源码）。
- 推测：各类问题出现的频率，以及模型能不能填对。这些要跑真实问答才能确认。
