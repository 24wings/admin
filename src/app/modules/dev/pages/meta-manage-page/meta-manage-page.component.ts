import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DevService ,CommonService,ExcelService} from '../../../lib';

import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-meta-manage-page',
  templateUrl: './meta-manage-page.component.html',
  styleUrls: ['./meta-manage-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MetaManagePageComponent implements OnInit {
  metaObjects: IMetaObject[] = [];
  menuGroups: IMetaGroups[] = [];
  selectedValue = '全部';
  constructor(
    public dev: DevService,
    public message: NzMessageService,
    public common:CommonService,
    public excel:ExcelService
  ) { }
  async  metaObjectList() {
    this.metaObjects = await this.dev.metaObjectList();
    this.menuGroups = [];

    this.metaObjects.forEach(metaObject => {
      if (!this.menuGroups.some(group => group.groupName == metaObject.groupName)) {
        this.menuGroups.push({ groupName: metaObject.groupName, metaObjects: [metaObject] })

      } else {
        let group = this.menuGroups.find(group => group.groupName == metaObject.groupName)
        group.metaObjects.push(metaObject)

      }
    })



  }
  ngOnInit() {
    this.metaObjectList();
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
  async metaObjectDelete(metaObject: IMetaObject) {

    let result = await this.dev.metaObjectDelete(metaObject.objectCode);
    if (result) {
      await this.metaObjectList();
      this.message.success("删除成功")
    } else {
      this.message.error("删除失败")
    }



  }
  exportExcel() {
    this.excel.exportMetaDataObjects(this.menuGroups);
  }


}
