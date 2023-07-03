###### tags: `zh-cn`

# BTAS

> Blue Team Assistance Script

**BTAS** is being developed by Barry & Jack & Xingyu


## 安装 & 使用
你可以使用 Greasy Fork 安装和更新BTAS脚本，点击下列地址:

https://greasyfork.org/en/scripts/463908-btas

如果你想体验最新的功能，或者帮助我们测试程序，你可以安装BTAS Beta版本，点击下列地址:

https://greasyfork.org/zh-CN/scripts/469395-btas-beta

## Difference: 蓝队增强 & BTAS

### 代码架构和风格

-   代码风格：使用 ES6（ECMAScript 6）新语言特性和语法替换老版本用法；使用 jQuery 替换 JavaScript 原生函数来操作 HTML 文档、处理事件，代码整体变得简洁优雅

-   可读性&维护性：变量和函数声明统一采用驼峰命名规则；文本信息统一使用英文描述；对主要函数以及特殊处理添加注释

-   架构：对代码整体进行重构，抽象函数，减少代码复用，细节如下

### 油猴图标按键
- 功能介绍：
    - 鼠标选中文本，右键或点击右上角油猴图标，即可调用Jira, VT, Reputation, AbuseIPDB进行搜索
    - 如果遇到暂时无法处理的ticket，但是又并不希望因为filter队列里有它而持续响铃，可以鼠标选中issue key，然后右键或点击右上角油猴图标，调用Add Exception添加例外，Clear Exception则是清除所有例外

- 添加：增加Reputation搜索功能，通过XSOAR平台查询IP声誉值
  
- 重构：将注册多个油猴菜单的功能，用数组整合搜索引擎，一次性循环注册解决

    -   鼠标选中文本，右键或点击右上角油猴图标，即可调用 Jira, VT, AbuseIPDB 进行搜索
    -   如果遇到暂时无法处理的 ticket，但是又并不希望因为 filter 队列里有它而持续响铃，可以鼠标选中 issue key，然后右键或点击右上角油猴图标，调用 Add Exception 添加例外，Clear Exception 则是清除所有例外

-   重构：将注册多个油猴菜单的功能，用数组整合搜索引擎，一次性循环注册解决

-   移除：微步搜索引擎是中文界面，不利于用户体验，已移除

### 提示音组件

**仅支持 List View（filter 页面的默认模式）。**

-   功能介绍：

    -   **audioNotify** 用于打开通知声音。它定期刷新筛选列表，并仅在出现与上次刷新列表不同的新票证时播放通知声音。
    -   **keepNotify** 用于保持通知声音。它定期刷新筛选列表，并只要存在未完成的票证，就会播放通知声音。
    -   **prompt** 用于打开横幅通知。它定期刷新筛选列表，如果有客户回复的票证超过 30 分钟未被处理，则会显示横幅通知。

-   重构：将音频控件和复选框功能抽象成函数；多个提示音组件整合成一个对象作为返回值，方便后续调用

-   移除：因为在 Detail View 下 Edit 升级 ticket 时，定期刷新 filter 列表，会中断当前操作，导致填入 description 的信息丢失，所以现在提示音组件不支持 Detail View，只支持 List View（即 filter 页面的默认模式）

### 高危关键词检查

-   功能介绍：
    -   当检测到日志中存在类似 mimikatz 的高危关键词，会弹出提醒“Please double-check it, and if it seems suspicious, contact L2 or TL.”
-   优化：将检查高危关键词功能抽象成函数，方便后续开发维护

### 日志摘要和安全平台快捷键

-   功能介绍：

    -   在具体的 MSS-ticket 界面，工具栏处添加 Description，Card，Timeline 按键
        -   Description：日志摘要信息
        -   Card，Timeline：Alter 对应安全平台的快捷跳转或 URL 信息

- 修复：每点一次Description都会追加hash文本的问题已修复；welab等新客户Card无法跳转的问题已修复；HTSC部分ticket的Description为空白已修复；Carbonblack平台Description undefined已修复

-   优化：创建 cortex 平台客户和导航的对象，方便后续添加客户和维护

-   修复：每点一次 Description 都会追加 hash 文本的问题已修复；welab 等新客户 Card 无法跳转的问题已修复；HTSC 部分 ticket 的 Description 为空白已修复；

## 贡献
由Barry在0.93版本之前开发，并由Jack在1.0.1版本进行了重构，并负责后续的开发和维护工作，Xingyu将在1.3.2版本之后参与开发工作。


## 许可证
License: Apache License 2.0
