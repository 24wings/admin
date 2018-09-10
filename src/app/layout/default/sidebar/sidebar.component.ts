import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';

import { StorageService, CommonService, DevService, EmpService } from '../../../modules/lib';
import { MenuType } from '../../../constant';
@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [`
  .isClose .ant-menu-submenu-arrow{
    display: none !important;
}
 
  `]
})
export class SidebarComponent {
  isClose: boolean = true;
  isCollapsed = false;

  groups: IGroup[] = [];

  shop_user_name: string;
  isDev: boolean = this.storage.userType == MenuType.Develop;
  sendProductOrdersNum: number = 0;

  constructor(

    public storage: StorageService,
    public common: CommonService,
    public dev: DevService,
    public emp: EmpService,
    public settings: SettingsService, public msgSrv: NzMessageService
  ) { }

  async ngOnInit() {
    /**Kaifazhe */

    if (this.storage.userType == 1) {
      this.shop_user_name = this.storage.shop_user_name;
    } else {
      this.shop_user_name = this.storage.employee.name;

    }

    // this.shop_user_name = this.storage.dev.devUserName;
    this.groups = this.common.getModuleGroup(this.storage.menuList);
    console.log("第一次调用getModuleGroup")

  }

  async getAdminInfo() { }
  async getSendProductOrdersNum() { }


}
