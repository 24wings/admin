import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DevService } from '../../modules/lib';

enum View {
  List = 1,
  Update
}
@Component({
  selector: 'app-query-modal',
  templateUrl: './query-modal.component.html',
  styles: []
})
export class QueryModalComponent implements OnInit {
  selectedData: any;
  state: View = View.List;
  View = View;
  queryFields: IMetadataField[] = [];
  queryOptions: FieldQueryOption[] = [];

  @Input() metaFields: IMetadataField[] = [];
  @Input() list: any[] = [];
  @Input() visible: boolean = false;
  @Input() isDel: boolean = false;
  @Input() isUpdate: boolean = false;
  @Output() onClose = new EventEmitter();
  @Output() onSubmit = new EventEmitter<any[]>();
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() metaObject: IMetaObject;
  page: number = 1;
  pageSize = 10;

  updateFields: IMetadataField[] = []
  queryMetaOptions: any[] = []
  allChecked = false;
  indeterminate = false;
  displayData = [];

  async  search(queryOptions = []) {
    console.log(queryOptions);
    this.queryOptions = queryOptions;
    this.metaObjectDataPage();

  }
  async metaObjectDataPage() {
    let result = await this.dev.metaObjectDataPage(this.metaObject.objectCode,
      { pageParameter: { pageIndex: 0, pageSize: 10 }, queryAttributes: [], queryConditions: [] });
    console.log(result);
    this.list = result;
  }
  /**
   * 模态框提交
   * 1.   上传数据到上层组件,一般上single-view,relation-view
   */
  submit() {
    this.onSubmit.emit(this.list.filter(list => list.checked));
    this.visible = false;
    this.visibleChange.emit(false);

  }
  /**
   * 模态框取消
   */
  cancel() {
    this.visible = false;
    this.visibleChange.emit(false);

  }
  constructor(public dev: DevService) { }

  ngOnInit() {
    this.updateFields = this.metaFields.filter(field => field.isUpdate);
    this.queryFields = this.metaFields.filter(field => field.isQuery);
    this.queryMetaOptions = this.metaFields.filter(field => field.isQuery).map(field => {
      return { fieldName: field.fieldName, alias: field.alias || field.fieldName, value: '', queryCondition: 'like' }
    });

  }
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
    this.list.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  edit(data) {
    this.selectedData = data;
    this.updateFields = this.metaFields.filter(field => field.isUpdate).map((field, i) => {
      return {
        fieldType: field.fieldType,
        fieldName: field.fieldName,
        value: this.selectedData[field.fieldName],
        placeholder: field.placeholder,
        alias: field.alias
      } as any;
    });
    this.state = View.Update;


  }
  async update() {
    let timestampFields = this.metaFields.filter(field => field.fieldType.toLowerCase() == 'timestamp').map(field => field.fieldName);
    let data = JSON.parse(JSON.stringify(this.selectedData));
    for (let timestampField of timestampFields) {
      if (this.selectedData[timestampField]) {
        console.log(this.selectedData[timestampField]);
        data[timestampField] = new Date(this.selectedData[timestampField]).getTime();
      }
    }
    await this.dev.metaObjectDataUpdate(this.metaObject, data);
  }
  deleteData(data) {
    this.visible = false;
    this.visibleChange.emit(false);

  }
}
