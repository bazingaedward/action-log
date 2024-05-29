# action-log
前端手动数据埋点工具SDK

## 用途
你可以将该项目作为公司内部手动上传的sdk 库模板，实现了基本的命名和上传规范

## 使用到的技术
- Node v18+
- Typescript 4.x
- Vite 5.x
- Vitest 1.6.x
- Lodash 4.17.x



## 设计思路
- 「single」模式：事件即时触发
- 「flush」模式：内存中设置缓存队列长度，


## 使用方法

```ts
import {ActionLog} from '@xx/action-log'
// init
const al = new ActionLog()

al.init({
    module: 'businessModule',
    version: 1
}, {
    debug: false,
    mode: 'single'
})

al.send({
    eventType: 'click',
    eventName: 'xxxx'
})
```

## 测试
具体使用方式参考index.test.ts
```
pnpm run test
```


## 字段说明
| 字段路径        | 必填         | 说明        |
|------------|-------------|------------|
| event.eventType      | 是       | 事件信息：类型，eg click 页面加载	      |
| event.eventName      | 否       | 事件信息：名称	      |
| event.timestamp      | 是       | 事件信息：发生时间      |
| userInfo.userId      | 是       | 用户信息：id      |
| userInfo.userName      | 是       | 用户信息: 名称	      |
| terminal.language      | 否       | 终端信息：语言      |
| terminal.screenHeight      | 否       |终端信息：屏幕高度	      |
| terminal.screenWidth      | 否       |终端信息：屏幕宽度      |
| terminal.userAgent      | 否       |终端信息：UA      |
| terminal.osType      | 否       |终端信息：操作系统类型，eg MacIntel	      |
| page.url      | 是       |页面信息：url		      |
| page.title      | 否       |页面信息：title			      |
| meta.module      | 是       |元信息：所属业务模块			      |
| meta.version      | 是       |元信息：配置化版本				      |
