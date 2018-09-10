import { Component, HostBinding, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SimpleTableColumn, XlsxService } from '@delon/abc';
import { SettingsService, TitleService } from '@delon/theme';
// import 'nunjucks'; 


import { filter } from 'rxjs/operators';
import { AppConfig } from './app.config';
import { MyHttpService, CommonService, DevService } from './modules/lib';
// import { DevService as Dev } from './modules/lib/dev.service';
import { EntityEnum } from './entity.enum';
import { Market } from './share_platform/framework/entity';

@Component({
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  @HostBinding('class.layout-fixed')
  child: boolean = false;
  get isFixed() {

    return this.settings.layout.fixed;
  }

  log(rows: any[]) {
    console.log(rows);
  }
  @HostBinding('class.layout-boxed')
  get isBoxed() {
    return this.settings.layout.boxed;
  }
  @HostBinding('class.aside-collapsed')
  get isCollapsed() {
    return this.settings.layout.collapsed;
  }

  showchild() {
    this.child = true;
  }

  constructor(
    private settings: SettingsService,
    private router: Router,
    private titleSrv: TitleService,
    public http: MyHttpService,
    public common: CommonService,
    // public dev: Dev,
    public devService: DevService,

  ) {

  }

  async ngOnInit() {
    // this.common.singleTableQuery(EntityEnum.Market, { mktId: 2 })
    // this.dev.sayHello()
    // let metaObject = await this.common.entityMeta(EntityEnum.Market);
    // this.common.entityInsert(EntityEnum.Market, { metaObject, dataItem: { mktName: "123321" } as Market })
    // this.common.entityUpdate(EntityEnum.Market, { metaObject, dataItem: { mktId: 6, mktName: "123456" } });
    // this.common.entityDelete(EntityEnum.Market, { metaObject, dataItem: { mktId: 7 } });
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => this.titleSrv.setTitle());
  }

}
