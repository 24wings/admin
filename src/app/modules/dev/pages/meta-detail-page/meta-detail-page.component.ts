import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DevService } from '../../../lib';


enum View {
  List = 1,
  Update

}
@Component({
  selector: 'app-meta-detail-page',
  templateUrl: './meta-detail-page.component.html',
  styles: []
})
export class MetaDetailPageComponent implements OnInit {
  selectedData: any;
  View = View;
  state = View.List;
  metaObject: IMetaObject;
  metaFields: IMetadataField[];
  objectCode: string;
  dataSet: any[] = [];
  queryOptions: FieldQueryOption[] = [];
  page: number = 1;
  pageSize: number = 10;
  total: number = 10;
  /**总字段 */
  fields: IMetadataField[] = []
  updateFields: IMetadataField[] = []

  queryConditions: { label: string, value: string }[] = [{ label: '相似', value: 'like' }, { label: '等于', value: '=' }, { label: '不等于', value: '!=' }];
  queryMetaOptions: any[] = []
  constructor(public route: ActivatedRoute, public dev: DevService) {
    this.objectCode = this.route.snapshot.params.objectCode;

  }

  ngOnInit() {
    // alert(this.objectCode)
    this.metaObjectDetail();
    // this.metaObjectDataPage();

  }
  // async metaObjectDataPage() {

    // let result = await this.dev.metaObjectDataPage(this.objectCode, { query: this.queryOptions } as any, this.page - 1, this.pageSize, this.c);
    // this.dataSet = result;

  // }


  async metaObjectDetail() {
    let { metaObject, fields } = await this.dev.metaObjectDetail(this.objectCode);
    this.fields = fields;
    this.metaFields = (fields as IMetadataField[]).filter(field => field.isShow);
    this.metaObject = metaObject;
    this.queryMetaOptions = fields.filter(field => field.isQuery).map(field => {
      return { fieldName: field.fieldName, alias: field.fieldName, value: '', queryCondition: 'like' }
    })

  }


  async  search() {
    this.queryOptions = [];
    let queryMetaOptions = this.queryMetaOptions.filter(option => option.value);
    console.log(this.queryMetaOptions, queryMetaOptions);
    for (let queryOption of queryMetaOptions) {
      this.queryOptions.push({ field: queryOption.fieldName, value: queryOption.value, compare: queryOption.queryCondition })
    }

    // this.metaObjectDataPage();

  }
  async edit(data: any) {
    this.selectedData = data;
    this.updateFields = this.fields.filter(field => field.isUpdate).map((field, i) => {
      return {
        fieldName: field.fieldName,
        value: this.selectedData[field.fieldName],
        placeholder: field.placeholder,
        alias: field.alias
      } as any;
    });
    this.state = View.Update;

  }
  async update() {
    let updateObject = {};


    console.log(this.selectedData);
    await this.dev.metaObjectDataUpdate(this.metaObject, this.selectedData);
    await this.metaObjectDetail();
    // await this.metaObjectDataPage();

  }



}
