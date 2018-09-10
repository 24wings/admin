import { Component, OnInit } from '@angular/core';
// import * as nunjucks from 'nunjucks'
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
  chooseCodeTemplate

}


@Component({
  selector: 'app-tool-page',
  templateUrl: './tool-page.component.html',
  styleUrls: ['./tool-page.component.css']
})
export class ToolPageComponent implements OnInit {
  defaultTable: DbTable = { name: "user", comment: "用户表", cols: [{ type: ColType.Varchar, comment: '用户名', length: 20, key: 'userName', PK: true, NN: true }] }
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
  eggjsRestStr = `
  // *.route.ts
  import { Application } from "egg";
  /**
   * 
   * 
   */
  let api={
   {{name}}List='/api/{{name}}/list',
   {{name}}Create='/api/{{name}}/create',
   {{name}}Update='/api/{{name}}/update',
   {{name}}Delete='/api/{{name}}/delete'
  }
  module.exports = (app: Application) => {
    let {{name}}=app.controller.{{name}};
    app.router
    .get(api.{{name}}List,{{name}}.{{name}}List)
    .post(api.{{name}}Create,{{name}}.{{name}}Create)
    .post(api.{{name}}Update,{{name}}.{{name}}Update)
    .delete(api.{{name}}Delete,{{name}}.{{name}}Delete)

};

  // *.controller.ts

  import { Controller } from "egg";
  import { RoleType, } from '../constant';
  import db = require('../model');
  export default class extends Controller {
      async {{name}}List() {
        let {{name}}s = await db.{{name}}.findAll();
        this.ctx.body={ok:true,data:{{name}}s}
      }
      async {{name}}Create(){
        let new{{name}} = this.ctx.request.body;
        let {{name}}s = await db.{{name}}.create(new{{name}});
        this.ctx.body={ok:true,data:new{{name}} }
      }
      async {{name}}Update(){
        let {{name}}=this.ctx.request.body;
        let {{name}} = await db.{{name}}.update(new{{name}},{where:{% raw %}{ {%endraw%} {{name}}Id},} );
        this.ctx.body={ok:true,data:{{name}} }
      }

    }
  `;

  sequelizeStr: string = `
  import { Sequelize, Instance,
    {%if  cols|some('type','varchar') %}  STRING,{%endif%}  {%if  cols|some('type','Date') %} INTEGER,{%endif%}{%if  cols|some('type','tinyint') %} Boolean,{%endif%}  {%if  cols|some('type','Date') %} Date,{%endif%}
{%if  cols|some('type','int') %} INTEGER,{%endif%}
  } from "sequelize";
  
  interface  {{name | capitalize}}{
  {%for col in cols%}
  /** {{col.comment}} */
  {{col.key}}?:{{col.type|typeTo('ts')}}
  {%endfor%}
  }
  
  type  {{name | capitalize }}Instance = Instance< {{name | capitalize}}> &  {{name | capitalize}};
  
  /** comment */
  export let {{name |upper}} = (database: Sequelize) => {
  const {{name}} = database.define<{{name | capitalize }}Instance, {{name | capitalize}}>(
      "{{name}}",
      {
        {%for col in cols%} 
{{ col.key}}:{type:{{col.type |typeTo('sequelize') }} , {% if col.PK%} primaryKey:true ,{%endif%} {% if col.NN%} allowNull:false ,{%endif%}  
        {% if col.AI%} autoIncrement:true ,{%endif%}  },
        {%endfor%}
     
      }
  
  );
  // {{name}}.sync({ force: true });
  return {{name}};
  };

  };
`;
  templateStr = this.sequelizeStr;
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
  ]
  constructor() {

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

  }
  refershCol() {
    this.dataSet = [];

    for (let col of this.defaultTable.cols) {
      this.dataSet.push(col);
    }
    this.json = JSON.stringify(this.defaultTable);
  }
  addCol() {
    // alert('addcoll')
    this.defaultTable.cols.push({ key: 'default', comment: '', type: ColType.Varchar, length: 11 });

    this.refershCol();
  }


  compile() {
    var env = new nunjucks.Environment();
    env.addFilter('some', (arr: any[], key, value) => {
      return arr.some(item => item[key] == value)
    })
    env.addFilter('typeTo', (type: ColType, to: 'ts' | 'sequelize' | 'java') => {
      switch (to) {
        /** 转换成typescript */
        case 'ts':
          switch (type) {
            case ColType.Varchar:
            case ColType.Char:
              return 'string';
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

    this.code = env.renderString(this.templateStr, this.defaultTable);
  }

}
