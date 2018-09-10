import { Component } from '@angular/core';
import { StorageService } from '../../../../modules/lib';
import { MenuType } from '../../../../constant';

@Component({
  selector: 'header-icon',
  template: `
  <nz-dropdown nzTrigger="click" nzPlacement="bottomRight" (nzVisibleChange)="change()">
    <div class="item" nz-dropdown>
      <i class="anticon anticon-appstore-o"></i>
    </div>
    <div nz-menu class="wd-xl animated jello" >
      <nz-spin [nzSpinning]="loading" [nzTip]="'正在读取数据...'" *ngIf="userType==MenuType.Develop">
        <div nz-row [nzType]="'flex'" [nzJustify]="'center'" [nzAlign]="'middle'" class="app-icons">
          <div nz-col [nzSpan]="6" (click)="openDocument()">
            <i class="anticon anticon-calendar bg-error text-white"></i>
            <small>开发文档</small>
          </div>
          <a nz-col [nzSpan]="6" href="http://47.106.131.159" target="_blank">
            <i class="anticon anticon-file-text bg-success text-white"></i>
            
            <small>原型图</small>
          </a>
          <a nz-col [nzSpan]="6" href="https://tslang.cn/" target="_blank">
            <i class="anticon anticon-file-text bg-purple text-white"></i>
            <small>Typescript</small>
          </a>
          
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-cloud bg-success text-white"></i>
            <small>Cloud</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-star-o bg-magenta text-white"></i>
            <small>Star</small>
          </div>
          
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-scan bg-warning text-white"></i>
            <small>QR</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-pay-circle-o bg-cyan text-white"></i>
            <small>Pay</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-printer bg-grey text-white"></i>
            <small>Print</small>
          </div>
        </div>
      </nz-spin>
   <!--工作人员菜单-->
      <nz-spin [nzSpinning]="loading" [nzTip]="'正在读取数据...'" *ngIf="userType==MenuType.Market">
        <div nz-row [nzType]="'flex'" [nzJustify]="'center'" [nzAlign]="'middle'" class="app-icons">
          <div nz-col [nzSpan]="6" (click)="openDocument()">
            <i class="anticon anticon-calendar bg-error text-white"></i>
            <small>使用手册</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-file bg-teal text-white"></i>
            <small>Files</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-cloud bg-success text-white"></i>
            <small>Cloud</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-star-o bg-magenta text-white"></i>
            <small>Star</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-team bg-purple text-white"></i>
            <small>Team</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-scan bg-warning text-white"></i>
            <small>QR</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-pay-circle-o bg-cyan text-white"></i>
            <small>Pay</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-printer bg-grey text-white"></i>
            <small>Print</small>
          </div>
        </div>
      </nz-spin>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderIconComponent {
  MenuType = MenuType;
  loading = true;
  userType: MenuType
  constructor(public storage: StorageService) { }
  ngOnInit(): void {
    this.userType = this.storage.userType;
  }
  change() {
    setTimeout(() => (this.loading = false), 500);
  }

  openDocument() {
    window.open('http://doc.airuanjian.vip')
  }
}
