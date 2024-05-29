# action-log
Frontend Manual Data Tracking Tool SDK

## Purpose
You can use this project as a template for the SDK library manually uploaded by the company internally, which implements basic naming and upload specifications.

## Technologies
- Node v18+
- Typescript 4.x
- Vite 5.x
- Vitest 1.6.x
- Lodash 4.17.x


## Design Concept
- "single" mode: events trigger immediately
- "flush" mode: set the cache queue length in memory.When accumulated to the limit number of events, report them all at once.


## Usage

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

## Testing

Refer to index.test.ts for specific usage methods.
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
