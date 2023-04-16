# BTAS

> Blue Team Assistance Script

**BTAS** is being developed by Barry & Jack


## Difference: 蓝队增强 & BTAS

### 代码架构和风格
- 代码风格：使用ES6（ECMAScript 6）新语言特性和语法替换老版本用法；使用jQuery替换JavaScript原生函数来操作 HTML 文档、处理事件，代码整体变得简洁优雅
- 可读性&维护性：变量和函数声明统一采用驼峰命名规则；文本信息统一使用英文描述；对主要函数以及特殊处理添加注释
- 架构：对代码整体进行重构，抽象函数，减少代码复用，细节如下

### 油猴图标按键
- 功能介绍：
    1. 鼠标选中文本，右键或点击右上角油猴图标，即可调用Jira, VT, AbuseIPDB进行搜索
    2. 如果遇到暂时无法处理的ticket，但是又并不希望因为filter队列里有它而持续响铃，可以鼠标选中issue key，然后右键或点击右上角油猴图标，调用Add Exception添加例外解决，Clear Exception则是清除所有例外
- 重构：将注册多个油猴菜单的功能，用数组整合搜索引擎，一次性循环注册解决
- 移除：微步搜索引擎是中文界面，不利于用户体验，已移除

### 提示音组件
- 功能介绍：
    1. audioNotify为开启提示音，定期刷新filter列表，当出现和上次刷新列表不同的新ticket，才播放提示音
    2. keepNotify 为保持提示音，定期刷新filter列表，只要存在未处理完的ticket，就会播放提示音
- 重构：将音频控件和复选框功能抽象成函数；多个提示音组件整合成一个对象作为返回值，方便后续调用
- 移除：因为在Detail View下Edit升级ticket时，定期刷新filter列表，会中断当前操作，导致填入description的信息丢失，所以现在提示音组件不支持Detail View，只支持List View（即filter页面的默认模式）

### 高危关键词检查
- 功能介绍：
    1. 当检测到日志中存在类似mimikatz的高危关键词，会弹出提醒“请仔细检查上报”
- 优化：将检查高危关键词功能抽象成函数，方便后续开发维护

### 日志摘要和安全平台快捷键
- 功能介绍：在具体的MSS-ticket界面，工具栏处添加Description，Card，Timeline按键
    Description：日志摘要信息；Card，Timeline：Alter对应安全平台的快捷跳转或URL信息
- 重构：将信息摘要，平台跳转功能抽象成函数，增强可读性；抽象添加按钮函数，减少重复代码，更加简洁
- 优化：创建cortex平台客户和导航的对象，方便后续添加客户和维护
- 修复：每点一次Description都会追加hash文本的问题已修复；welab等新客户Card无法跳转的问题已修复；HTSC部分ticket的Description为空白已修复；


## Installation & Usage

### Options

### Configuration

### How to use
You can use Greasy Fork to install and update BTAS scripts, as follows:

https://greasyfork.org/en/scripts/463908-btas


## Contribution
Developed by Barry before version 0.93, and refactored by Jack for version 1.0.1 and responsible for subsequent development and maintenance


## License
License: Apache License 2.0