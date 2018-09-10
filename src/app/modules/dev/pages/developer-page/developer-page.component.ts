import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DevService } from '../../../lib';
import { NzMessageService } from 'ng-zorro-antd';
// import{} from ""ViewEncapsulation
enum View {
  DevList,
  DevCreate,
  DevEdit
}
@Component({
  selector: 'app-developer-page',
  templateUrl: './developer-page.component.html',
  styleUrls: ['./developer-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DeveloperPageComponent implements OnInit {
  state: View = View.DevList;
  View = View;
  devs: IDevelop[] = [];
  newDev: IDevelop = {
    devUserName: '',
    password: ''
  }
  selectedDev: IDevelop;
  page = 1;
  pageSize = 10;
  total: number = 10;
  constructor(
    public dev: DevService,
    public message: NzMessageService


  ) { }

  async ngOnInit() {
    await this.devPage()
  }
  async devPage() {
    let result = await this.dev.devPage(this.page - 1, this.pageSize);
    this.devs = result.rows;
    this.total = result.count;

  }
  async developerDelete(dev: IDevelop) {
    let result = await this.dev.devDelete(dev.devId);
    if (result) {
      await this.devPage();
      this.state = View.DevList;
      this.message.success("删除成功")
    } else {
      this.message.error("删除")
    }
  }
  async developerCreate() {
    let result = await this.dev.devCreate(this.newDev);
    if (result) {
      await this.devPage();
      this.state = View.DevList;
      this.message.success("创建成功")
    } else {
      this.message.error("创建失败")
    }
  }
  async developerUpdate() {
    let result = await this.dev.devUpdate(this.selectedDev);
    if (result) {
      await this.devPage();
      this.state = View.DevList;
      this.message.success("更新成功")
    } else {
      this.message.error("更新失败")
    }
  }
  allChecked = false;
  indeterminate = false;
  displayData = [];


  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }
}
