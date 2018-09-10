import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { QueryObject } from '../../share_platform/framework/util';
import { CommonService } from '../../modules/lib';
import { MetaObject } from '../../share_platform/framework/entity';
import { NzMessageService } from 'ng-zorro-antd';
import { MetaField } from 'share_platform/framework/entity';
import { EntityEnum } from '../../entity.enum';

@Component({
  selector: 'app-query-select-modal',
  templateUrl: './query-select-modal.component.html',
  styles: []
})
export class QuerySelectModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = true;
  @Input() isMulti: boolean = false;
  @Input() title: string = "选择";
  @Input() objectCode;
  @Input() presetQueryObject: QueryObject | QueryObject[] = {};
  @Input() displayFields: string[] = [];
  @Output() select = new EventEmitter<any[]>()
  meta: MetaObject = { metaFields: [] };
  filterShow(metaFields: MetaField[]): MetaField[] {
    return metaFields.filter(field => field).filter(field => field.isShow);
  }
  ngOnChanges(prop) {
    console.log(prop);
  }

  constructor(public common: CommonService, public msg: NzMessageService) { }

  async ngOnInit() {
    this.meta = await this.common.entityMeta(this.objectCode);
    let result = await this.common.singleTableQuery(this.objectCode, this.presetQueryObject);
    this.data = result.paging.rows;
    if (this.data.length == 1) {
      this.select.emit(this.data);
      // this.visible = false;
    }
  }
  allChecked = false;
  indeterminate = false;
  displayData = [];
  data: any[] = [];
  count: number = 0;

  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
    // this.refreshStatus();
  }
  onOk() {
    this.select.emit(this.data.filter(item => item.checked));
    this.visible = false;
  }
  refreshStatus(): void {
    if (this.isMulti) {
      const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
      const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
      this.allChecked = allChecked;
      this.indeterminate = (!allChecked) && (!allUnChecked);
    } else {
      this.select.emit(this.data.filter(item => item.checked));
      // this.visible = false;
    }
  }

  checkAll(value: boolean): void {
    if (this.isMulti)
      this.displayData.forEach(data => {
        if (!data.disabled) {
          data.checked = value;
        }
      });
    // this.refreshStatus();
  }
  check(item: any) {
    if (this.isMulti) {

    } else {
      this.select.emit(item);
      this.visible = false;
    }
  }
}
