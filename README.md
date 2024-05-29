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

# action-log
Frontend Manual Data Tracking Tool SDK

## Purpose
You can use this project as a template for the SDK library manually uploaded by the company internally, which implements basic naming and upload specifications.

## Technologies Used
- Typescript
- Vitest

## Design Concept
- "single" mode: events trigger immediately
- "flush" mode: set the cache queue length in memory

## Usage

```ts
import { ActionLog } from '@xx/action-log'
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

## Field Description
| Field Path        | Required         | Description        |
|------------|-------------|------------|
| event.eventType      | Yes       | Event Information: Type, e.g., click, page load      |
| event.eventName      | No       | Event Information: Name      |
| event.timestamp      | Yes       | Event Information: Occurrence Time      |
| userInfo.userId      | Yes       | User Information: ID      |
| userInfo.userName      | Yes       | User Information: Name      |
| terminal.language      | No       | Terminal Information: Language      |
| terminal.screenHeight      | No       | Terminal Information: Screen Height      |
| terminal.screenWidth      | No       | Terminal Information: Screen Width      |
| terminal.userAgent      | No       | Terminal Information: User Agent      |
| terminal.osType      | No       | Terminal Information: Operating System Type, e.g., MacIntel      |
| page.url      | Yes       | Page Information: URL      |
| page.title      | No       | Page Information: Title      |
| meta.module      | Yes       | Meta Information: Business Module      |
| meta.version      | Yes       | Meta Information: Configuration Version      |
