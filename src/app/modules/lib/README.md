# angular常用的业务

一:引入LibModule
```typescript
// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LibModule } from './lib';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    LibModule.forRoot(),
    RouterModule.forRoot([])

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```


而常用工具

service 业务
* ConfigService
* ApiService
* CommonService
* UserSerivce
* WechatService

pipe  管道
* money-pipe
* arr-true-pipe


com 组件
* app-transition 
* app-title


directive 指令
back.directive
bg-img.directive
