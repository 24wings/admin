import { Component, OnInit, Input, ViewChildren, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DevService } from '../../modules/lib';
import { FieldComponent } from '@shared/field/field.component';
import { QueryAttribute } from '../../share_platform/framework/entity/QueryAttribute';
import { QueryAttrToolbarComponent } from '@shared/query-attr-toolbar/query-attr-toolbar.component';
import { QueryToolbarComponent } from '@shared/query-toolbar/query-toolbar.component';
import { QueryCondition } from 'share_platform/framework/util';


enum View {
  List = 1,
  Update

}
@Component({
  selector: 'app-single-view',
  templateUrl: './single-view.component.html',
  styles: []
})
export class SingleViewComponent implements OnInit {
  queryModelVisible: boolean = false;
  @ViewChild("attrToolbar") attrToolbar: QueryAttrToolbarComponent;
  @ViewChild("queryToolbar") queryToolbar: QueryToolbarComponent;


  @Input() singleConfig: SingleConfig;
  metaObject: IMetaObject;
  selectedData: any;
  View = View;
  state = View.List;
  metaFields: IMetadataField[];
  queryFields: IMetadataField[] = [];
  dataSet: any[] = [];
  queryOptions: FieldQueryOption[] = [];
  page: number = 1;
  pageSize: number = 10;
  total: number = 10;
  /**总字段 */
  fields: IMetadataField[] = [];
  updateFields: IMetadataField[] = [];
  config: { queryAttributes: QueryAttribute[] } = { queryAttributes: [] }
  queryMetaOptions: any[] = []


  @Input() list: any[] = [];
  @Input() visible: boolean = false;
  @Input() isDel: boolean = false;
  @Input() isUpdate: boolean = false;

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
    this.list = result.rows;
  }
  /**
   * 模态框提交
   * 1.   上传数据到上层组件,一般上single-view,relation-view
   */
  submit() {
    // this.onSubmit.emit(this.list.filter(list => list.checked));
    this.visible = false;
    // this.visibleChange.emit(false);

  }
  /**
   * 模态框取消
   */
  cancel() {
    this.visible = false;
    // this.visibleChange.emit(false);

  }
  constructor(public dev: DevService) { }

  async ngOnInit() {
    console.log(this.singleConfig);
    await this.metaObjectDetail();
    // await this.metaObjectDataPage();

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
    let obj = {};
    this.updateFields.forEach(field => obj[field.fieldName] = field[field.fieldName]);
    let data = JSON.parse(JSON.stringify(this.selectedData));
    data = Object.assign(obj, data);
    debugger;
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
    // this.visibleChange.emit(false);

  }




  async metaObjectDetail() {
    let { metaObject, fields, config } = await this.dev.metaObjectDetail(this.singleConfig.objectCode);
    // debugger;
    this.fields = fields;
    this.metaFields = (fields as IMetadataField[]).filter(field => field.isShow);
    this.metaFields.sort((field1, field2) => field1.recno - field2.recno);
    if (config) {
      this.config = JSON.parse(config);
      // debugger;

    }
    console.log(this.config);
    // debugger

    this.metaObject = metaObject;
    this.queryFields = fields.filter(field => field.isQuery);
    this.queryMetaOptions = fields.filter(field => field.isQuery).map(field => {
      return { fieldName: field.fieldName, alias: field.alias || field.fieldName, value: '', queryCondition: 'like' }
    });
    /**
     * 日期格式额外
     */

  }



  async  query() {
    let attrs: QueryAttribute[] = [];
    let conditions: QueryCondition[] = []
    if (this.attrToolbar) {
      attrs = this.attrToolbar.search();
      attrs.forEach(attr => {
        if (attr.type.toLowerCase() == "date") {
          // attr.value = new Date(attr.value).format("yyyy-MM-dd")
        }
      })
      console.log(attrs);
    }
    if (this.queryToolbar) {
      conditions = this.queryToolbar.search();
      console.log(conditions);
    }
    let result = await this.dev.metaObjectDataPage(this.metaObject.objectCode, {
      queryAttributes: attrs,
      queryConditions: conditions,
      pageParameter: { pageIndex: 0, pageSize: 10, }
    })
    this.list = result.rows;

    console.log(this.list);

  }



  onQueryModalSubmit($event: any[]) {
    console.log($event)
  }
}
