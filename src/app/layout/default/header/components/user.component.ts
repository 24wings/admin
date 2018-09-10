import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { StorageService, } from '../../../../modules/lib';
import { MenuType } from '../../../../constant';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{settings.user.name}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item  *ngIf="userType==Type.Market" (click)="modifyPassword()"><i class="anticon anticon-setting mr-sm" ></i>员工修改密码</div>
      <div nz-menu-item  *ngIf="userType==Type.Develop"><i class="anticon anticon-setting mr-sm"></i>开发人员修改密码</div>
    
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderUserComponent {
  Type = MenuType;
  userType;
  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    public storage: StorageService,
  ) {
    let userName = this.storage.shop_user_name;
    this.userType = this.storage.userType;
    this.settings.user.name = userName;
  }



  async logout() {
    // await this.config.fruit.adminLogout();
    localStorage.removeItem("shop_id");
    switch (this.storage.userType) {
      case MenuType.Market:
        this.router.navigateByUrl("/admin/login");
        break;
      // case MenuType.GroupCompany:
      //   this.router.navigateByUrl("/group/login");
      //   break;
      case MenuType.Develop:
        this.router.navigateByUrl("/dev/login");
        break;
    }
  }
  modifyPassword() {

    this.router.navigateByUrl("/admin/employee/modify-password")
  }
}
