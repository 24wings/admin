import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DevService, StorageService } from '../../../lib';

interface ITemplate {
  templateId?: number;
  name: string;
  template: string;
  devId?: number;
  comment: string;
  createAt?: Date;
}

enum ColType {
  Varchar = "varchar",
  Int = "int",
  Tinyint = "tinyint",
  Integer = "integer",
  Double = "double",
  Char = "char",
  Timestamp = "timestamp",
  Date = "date",
  Datetime = "datetime"
}


enum ViewState {
  ListCol = 1,
  EditCol,
  ImportJSON,
  /**代码生成 */
  CodeGen,
  /**  选择代码模板 */
  chooseCodeTemplate,
  /**发布代码模板 */
  publishCodeTemplate

}

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.css']
})
export class TablePageComponent implements OnInit {
  /**是否显示模板说明 */
  showSummary: boolean = false;
  newTemplate: ITemplate = {
    name: '',
    template: '',
    createAt: new Date(),
    comment: ''
  }
  selectedTemplate: ITemplate = { name: '', template: '', comment: '' };
  get tableId() {
    return this.route.snapshot.queryParams.tableId
  }
  mode: 'create' | 'update' = 'update'
  constructor(public route: ActivatedRoute, public dev: DevService, public router: Router, public storage: StorageService) {
    let mode = this.route.snapshot.queryParams.mode
    if (mode == 'create') {
      this.mode = 'create';
      this.defaultTable.dbId = this.route.snapshot.params.dbId;
    }


  }

  defaultTable: DbTable = { name: "user", comment: "用户表", dbId: 1, cols: [{ type: ColType.Varchar, comment: '用户名', length: 20, key: 'userName', PK: true, NN: true }] }
  json: string = JSON.stringify(this.defaultTable);
  dataSet: DbCol[] = [];
  state: ViewState = ViewState.ListCol;
  ViewState = ViewState;
  selectedCol: DbCol;
  code: string;
  gridStyle = {
    width: '25%',
    textAlign: 'center'
  };
  selectTemplate(template: ITemplate) {
    this.selectedTemplate = template;
    this.state = ViewState.CodeGen;
  }



  colTypeOptions: { label: string, value: string }[] = [
    { label: "varchar", value: ColType.Varchar, },
    { label: "int", value: ColType.Int },
    { label: "tinyint", value: ColType.Tinyint },
    { label: "integer", value: ColType.Integer },
    { label: "double", value: ColType.Double },
    { label: "char", value: ColType.Char },
    { label: "timestamp", value: ColType.Timestamp },
    { label: "date", value: ColType.Date },
    { label: "datetime", value: ColType.Datetime },
  ];


  async tableDetail() {
    if (this.mode != 'create') {
      // console.log(this.route.snapshot.queryParams)
      let table: DbTable = await this.dev.tableDetail(this.tableId);
      if (typeof table.cols == 'string') {
        table.cols = JSON.parse(table.cols as any);
      }
      this.defaultTable = table;
      this.refershCol();
    }
  }

  async updateTable() {
    this.defaultTable.cols = this.dataSet;
    await this.dev.tableUpdate(this.defaultTable);
    await this.goDbDetailPage();
  }




  trayParseJson() {
    try {

      let json = JSON.parse(this.json)

    } catch (e) {
      if (e) alert(e);
      return this.json;

    }

    this.dataSet = JSON.parse(this.json).cols;
    return this.json;
  }
  removeCol(col) {
    let i = this.defaultTable.cols.findIndex(c => col == c);
    this.defaultTable.cols.splice(i, 1);
    this.refershCol();
  }

  ngOnInit() {

    this.refershCol();
    this.tableDetail();
    this.listCodeTemplate();

  }
  refershCol() {
    this.dataSet = this.defaultTable.cols;


    this.json = JSON.stringify(this.defaultTable);
  }
  addCol() {
    this.defaultTable.cols.push({ key: 'default', comment: '', type: ColType.Varchar, length: 11 });
    this.refershCol();
  }


  compile() {
    var env = new nunjucks.Environment();
    env.addFilter('some', (arr: any[], key, value, value2, value3) => {

      if (arr.some(item => item[key] == value)) {
        return true
      }
      if (value2 && arr.some(item => item[key] == value2)) {
        return true
      }
      if (value3 && arr.some(item => item[key] == value3)) {
        return true;
      }
      return false;
    })
    env.addFilter('typeTo', (type: ColType, to: 'ts' | 'sequelize' | 'java') => {
      switch (to) {
        /** 转换成typescript */
        case 'ts':
          switch (type) {
            case ColType.Varchar:
            case ColType.Char:
              return 'string';
            case 'int':
            case 'integer':
              return 'number';
            case ColType.Date:
            case ColType.Datetime:
              return 'Date';
            case ColType.Tinyint:
              return 'boolean';
          }
          break;
        case 'sequelize':
          switch (type) {
            case ColType.Varchar:
              return 'STRING';
            case ColType.Date:
              return 'DATE';
            case ColType.Datetime:
              return 'DATE';
            case ColType.Integer:
            case ColType.Int:
              return 'INTEGER';
          }
          break;
      }


    })

    env.addFilter('shorten', function (str, count) {
      return str.slice(0, count || 5);
    });

    this.code = env.renderString(this.selectedTemplate.template, this.defaultTable);
  }

  async saveNewTable() {
    await this.dev.tableCreate(this.defaultTable);
    await this.goDbDetailPage();

  }
  async goDbDetailPage() {
    this.router.navigate(['../'], { relativeTo: this.route })

  }
  async publishCodeTemplate() {
    await this.dev.templateCreate({
      template: this.selectedTemplate.template,
      name: this.newTemplate.name,
      comment: this.newTemplate.comment,
      devId: this.storage.dev.devId
    });
    await this.listCodeTemplate();
    this.state = ViewState.CodeGen;
  }
  templates: ITemplate[] = []
  async listCodeTemplate() {
    this.templates = await this.dev.templateList();
  }
  async updateTemplate() {
    if (this.storage.dev.devId == this.selectedTemplate.devId) {
      await this.dev.templateUpdate(this.selectedTemplate);
      await this.listCodeTemplate();
    } else {
      this.dev.http.createMessage('error', '无权修改模板代码');
    }
  }
  async templateDelete() {
    if (this.storage.dev.devId == this.selectedTemplate.devId) {
      await this.dev.templateDelete(this.selectedTemplate.templateId);
      await this.listCodeTemplate();
    } else {
      this.dev.http.createMessage('error', '无权删除模板代码');
    }
  }
}
