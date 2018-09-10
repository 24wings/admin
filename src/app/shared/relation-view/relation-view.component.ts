import { Component, OnInit, Input } from '@angular/core';
import { DevService } from '../../modules/lib';

enum View {
  ListParent = 1,
  UpdateParent,
  UpdateChild


}
@Component({
  selector: 'app-relation-view',
  templateUrl: './relation-view.component.html',
  styles: []
})
export class RelationViewComponent implements OnInit {
  View = View;
  state = View.ListParent
  @Input() relationConfig: RelationConfig;
  parentDataSet: any[] = [];
  selectedParentData: any;
  parentMetaObject: IMetaObject;
  parentFields: IMetadataField[] = [];
  parentShowFields: IMetadataField[] = [];
  parentQueryMetaOptions: any[] = [];
  parentUpdateFields: IMetadataField[] = [];
  page: number = 1;
  pageSize: number = 10;

  queryConditions: { label: string, value: string }[] = [
    { label: '相似', value: 'like' },
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' }];
  /** children  */
  selectedActionButton: ActionButton;
  childrenDataSet: any[] = [];
  selectedChildData: any;
  childMetaObject: IMetaObject;
  childFields: IMetadataField[] = [];
  childShowFields: IMetadataField[] = [];
  childQueryMetaOptions: any[] = [];
  childUpdateFields: IMetadataField[] = [];
  childPage: number = 1;
  childPageSize: number = 10;
  updateChild() {

  }
  constructor(public dev: DevService) { }
  parentEvent() {

  }
  ngOnInit() {
    console.log(this.relationConfig);
    this.getParent();
  }
  async  getParent() {
    let result = await this.dev.metaObjectDetail(this.relationConfig.objectCode);
    this.parentMetaObject = result.metaObject;
    this.parentFields = result.fields;

    this.parentShowFields = (this.parentFields as IMetadataField[]).filter(field => field.isShow);
    this.parentFields.sort((field1, field2) => field1.recno - field2.recno);
    this.parentQueryMetaOptions = this.parentFields.filter(field => field.isQuery).map(field => {
      return { fieldName: field.fieldName, alias: field.fieldName, value: '', queryCondition: 'like' }
    })
  }
  parentEdit(data) {
    this.selectedParentData = data;
    this.parentUpdateFields = this.parentFields.filter(field => field.isUpdate).map((field, i) => {
      return {
        fieldName: field.fieldName,
        value: this.selectedParentData[field.fieldName],
        placeholder: field.placeholder,
        alias: field.alias
      } as any;
    });
    this.state = View.UpdateParent;
  }
  parentSearch() {
    let queryOptions: FieldQueryOption[] = [];
    let queryMetaOptions = this.parentQueryMetaOptions.filter(option => option.value);
    console.log(this.parentQueryMetaOptions, queryMetaOptions);
    for (let queryOption of queryMetaOptions) {
      queryOptions.push({ field: queryOption.fieldName, value: queryOption.value, compare: queryOption.queryCondition })
    }

    this.parentMetaObjectDataPage(queryOptions);
  }
  async  parentMetaObjectDataPage(queryOptions: FieldQueryOption[] = []) {
    // let result = await this.dev.metaObjectDataPage(this.relationConfig.objectCode,
    // { query: queryOptions }, this.page - 1, this.pageSize);
    // this.parentDataSet = result;
  }
  updateParent() {

  }
  childEdit(data) {
    this.selectedChildData = data;
    this.childUpdateFields = this.childFields.filter(field => field.isUpdate).map((field, i) => {
      return {
        fieldName: field.fieldName,
        value: this.selectedChildData[field.fieldName],
        placeholder: field.placeholder,
        alias: field.alias
      } as any;
    });
    this.childUpdateFields.sort((field1, field2) => field1.recno - field2.recno);
    this.state = View.UpdateChild;
  }
  doParentAction(button: ActionButton, data) {
    // eval(action);
    this.selectedActionButton = button;
    eval(button.action);
  }
  async initChildren(querys: FieldQueryOption[]) {
    console.log(querys);
    let result = await this.dev.metaObjectDetail(this.selectedActionButton.objectCode);
    this.childMetaObject = result.metaObject;
    this.childFields = result.fields;

    this.childShowFields = (this.childFields as IMetadataField[]).filter(field => field.isShow);

    this.childQueryMetaOptions = this.childFields.filter(field => field.isQuery).map(field => {
      return { fieldName: field.fieldName, alias: field.fieldName, value: '', queryCondition: 'like' }
    })
    if (this.selectedActionButton.firstLoad) {
      this.childSearch(querys);
    }
  }
  childSearch(queryOptions: FieldQueryOption[] = []) {
    if (queryOptions.length == 0) {
      let queryMetaOptions = this.childQueryMetaOptions.filter(option => option.value);
      console.log(this.parentQueryMetaOptions, queryMetaOptions);
      for (let queryOption of queryMetaOptions) {
        queryOptions.push({
          field: queryOption.fieldName,
          value: queryOption.value, compare: queryOption.queryCondition
        })
      }
    }
    this.childMetaObjectDataPage(queryOptions);
  }
  async  childMetaObjectDataPage(queryOptions: FieldQueryOption[] = []) {
    // let result = await this.dev.metaObjectDataPage(this.selectedActionButton.objectCode,
    // { query: queryOptions }, this.page - 1, this.pageSize);
    // this.childrenDataSet = result;
  }
}
