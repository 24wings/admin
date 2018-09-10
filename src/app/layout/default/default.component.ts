import { Component, ViewChild } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
  NavigationStart,

} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ScrollService, MenuService, SettingsService, Menu } from '@delon/theme';
import { CommonService, StorageService } from '../../modules/lib';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html',
})
export class LayoutDefaultComponent {
  isFetching = false;

  constructor(
    public router: Router,
    scroll: ScrollService,
    private _message: NzMessageService,
    public menuSrv: MenuService,
    public settings: SettingsService,
    public menu: MenuService,
    public common: CommonService,
    public storage: StorageService,


  ) {

    // scroll to top in change page
    router.events.subscribe((evt, ) => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        // debugger
        this.isFetching = true;
      }
      if (evt instanceof NavigationStart) {
        // console.log(evt)
        if (evt.url != '/lock' && this.storage.lockPassword) {
          // console.log(this.router.url, this.storage.lockPassword)

          this.router.navigate(['/lock']);


          return false;
        }

      }
      if (evt instanceof NavigationError) {
        // debugger;
        this.isFetching = false;
        _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
        return;


      }

      setTimeout(() => {
        scroll.scrollToTop();
        this.isFetching = false;
      }, 100);
    });
    let menus = this.storage.menuList;
  this.common.resetMenu(menus);
  }
  logFile(file) {
    // console.log(file);
  }

}
