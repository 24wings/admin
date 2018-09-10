import { Component, OnInit } from '@angular/core';
import { DevService, CommonService } from '../../../lib';
import { FormControl, Validators, FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { QueryAttribute } from '../../../../share_platform/framework/entity/QueryAttribute';

/**
 * 可选项分为两类 通用和高级
 */
interface IMetadataOption {
  [key: string]: any;
}

enum View {
  List,
  EditMetaFieldType,
  SelectMetaFieldType,


}
@Component({
  selector: 'app-meta-create-page',
  templateUrl: './meta-create-page.component.html',
  styles: [`    .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all .3s;
  }

  .dynamic-delete-button:hover {
    color: #777;
  }

  [nz-form] {
    max-width: 600px;
  }
  .ant-input-affix-wrapper .ant-input:not(:first-child){
    padding:6px;
  }
  `]
})

export class MetaCreatePageComponent implements OnInit {
  EditAddtionJSON: boolean = false;
  attrs: QueryAttribute[] = [];
  addtionjson: string = `{"queryAttributes":[{"key":"StartDt","type":"Date"},{"key":"EndDate","type":"Date"}]}`;
  objectCode: string;
  selectedTooltip: string;
  attrOptions: { label: string, value: string }[] = [{ label: "日期", value: "Date" }];
  config: { queryAttributes: QueryAttribute[] } = {
    queryAttributes: []
  }
  fields: IMetadataField[] = [];
  editingOption: { key: string, value: string } = { key: "", value: '' };

  result: string;
  tables: { checked, tableName: string }[] = [];
  addAttr() {
    this.config.queryAttributes.push({ key: "startDate", type: "Date", alias: "起始时间", value: "" });
  }
  newMetaObject: IMetaObject = {
    groupName: '',
    objectName: '',
    tableName: '',
    querySql: `SELECT od.id AS id, od.grossWgt AS grossWgt,od.orderId AS orderId,od.pcsWgt AS pcsWgt,od.price AS price,od.priceUnit AS priceUnit,
    \`od\`.\`prodCatId\` AS prodCatId,
    od.prodCatName AS prodCatName,
    od.productId AS productId,
    od.productName AS productName,
    od.qty AS qty,
    od.tareWgt AS tareWgt,
    od.weight AS weight,
    ta.txnName AS txnName,
    sm.\`name\` AS sellerName,
    o.actorId AS actorId,
    o.actor AS actor,
    o.actTime AS actTime,
    o.buyerMemId AS buyerMemId,
    o.buyerInfo AS buyerInfo,
    o.buyerFee AS buyerFee,
    o.creatorId AS creatorId,
    o.creator AS creator,
    o.createTime AS createTime,
    o.orderNo AS orderNo,
    o.payAmt AS payAmt,
    o.payType AS payType,
    o.sellerMemId AS sellerMemId,
    o.sellerFee AS sellerFee,
    o.\`status\` AS \`status\`,
    o.createWay AS createWay,
    o.mktId AS mktId,
    market.mktName AS mktName
    from
    ((((\`b_order\` \`o\` join \`b_order_detail\` \`od\` on
    ((\`o\`.\`id\` = \`od\`.\`orderId\`))) left join \`b_txn_area\` \`ta\` on
    ((\`ta\`.\`txnId\` = \`o\`.\`transAreaId\`))) left join \`b_member\` \`sm\` on
    ((\`sm\`.\`id\` = \`o\`.\`sellerMemId\`))) left join \`market\` on
    ((\`market\`.\`mktId\` = \`o\`.\`mktId\`)))
    where O.createTime>@StartDate and O.CreateTime<@EndDate`,
    isCelledit: false,
    isSingle: false,
    isFirstLoad: false,
    isShowNum: false,
    config: ``,
    defaultOrder: '',
    parentKey: '',
    pkKey: '',

  }
  saveAddtionJson() {
    try {
      if (JSON.parse(this.addtionjson)) {
        this.newMetaObject.config = this.addtionjson;
        this.EditAddtionJSON = false;
      }
    } catch (e) {
      if (e) return this.message.error("json不合法" + e)
    }

  }


  selectedValue = '全部';
  selectedType: string = '';
  state: View = View.List;
  View = View;
  options: any[] = [];
  selectedField: IMetadataField
  selectedOptions: { key: string, value: string }[] = [];
  attributes: QueryAttribute[] = []

  getTrueSql() {
    this.attributes.forEach(attr => {
      let decore = `@${attr.type}("${attr.key}")`;
      console.log(decore);
      this.newMetaObject.querySql = this.newMetaObject.querySql.replace(decore, `@${attr.key}`);
    });
  }


  defaultOptions: { label: string, value: any, tooltip: string }[] = [
    { label: '默认值', value: 'defaultValue', tooltip: `预设值` },
    { label: '最大长度', value: 'maxSize', tooltip: `自定义文本最大长度：200` },
    {
      label: '控件类型', value: 'controllType', tooltip: `任意一种:text,textarea,select,
    datetime,daterange,date,time,switch,
    lazySelect,checkbox,radio,` },
    {
      label: '下拉选项', value: 'selectOption',
      tooltip: `[{"label":"男","value":1,},{"label":"女":"value":"2"}]`
    },
    { label: '日期格式化', value: 'dateFormat', tooltip: '默认yyyy-MM-dd' }
  ];
  constructor(
    public dev: DevService,
    public common: CommonService,
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public message: NzMessageService
  ) {
    if (this.route.snapshot.params.objectCode) {
      this.dev.http.createMessage('success', '进入编辑模式');
      this.objectCode = this.route.snapshot.params.objectCode;
    }
  }

  ngOnInit() {
    this.validateForm = this.fb.group({});
    if (this.objectCode) {
      this.initMetaObjectByObjectCode();
    }
  }
  async initMetaObjectByObjectCode() {
    let result = await this.dev.metaObjectDetail(this.objectCode);
    this.newMetaObject = result.metaObject;
    this.fields = result.fields;
    this.config = JSON.parse(result.config);
    await this.recnoRecno()
  }

  validateForm: FormGroup;
  controlArray: Array<{ id: number, controlInstance: string, tooltip: string }> = [];

  addField(e?: MouseEvent): void {
    this.selectedTooltip = this.defaultOptions.find(option => this.selectedType == option.value).tooltip;
    const id = (this.controlArray.length > 0) ? this.controlArray[this.controlArray.length - 1].id + 1 : 0;
    const controlKey = { id, controlInstance: this.selectedType, tooltip: this.selectedTooltip };
    const indexKey = this.controlArray.push(controlKey);
    this.validateForm.addControl(controlKey.controlInstance, new FormControl(null));
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  removeField(i: { id: number, controlInstance: string, tooltip: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.controlArray.length > 0) {
      console.log(i)
      const index = this.controlArray.indexOf(i);
      this.controlArray.splice(index, 1);
      // console.log(this.controlArray);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  getFormControl(name: string): AbstractControl {
    return this.validateForm.controls[name];
  }
  editField(field: IMetadataField) {
    this.state = View.EditMetaFieldType;
    this.selectedField = field;
    for (let control of this.controlArray) {
      this.validateForm.removeControl(control.controlInstance);
    }
    this.controlArray = [];
    console.log(field.config);
    let keys = Object.getOwnPropertyNames(field.config);
    keys.forEach((key, i) => {
      this.controlArray.push({ id: i, controlInstance: key, tooltip: this.defaultOptions.find(option => option.value == key).tooltip });
      this.validateForm.addControl(key, new FormControl(field.config[key]));
    });
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }


  async queryField() {
    let result = await this.dev.sqlDetail(this.newMetaObject.querySql);
    // debugger
    this.fields = (result.fields as { field: string, type: string, }[]).map((field, i) => {
      return {
        fieldName: field.field,
        fieldType: field.type,
        recno: i,
        visible: true,
        updateable: true,
        required: true,
        defaultValue: '',
        isQuery: false,
        isShow: true,
        isUpdate: true,
        config: {},
        alias: '',
        placeholder: '',
        displayWidth: 200,
        presetValue: "",
        controllType: 'input'
      }
    });
    this.result = JSON.stringify(result);
  }
  updateField() {
    this.selectedField.config = this.validateForm.value;
    this.state = View.List;
  }
  async createMetaObject() {
    this.newMetaObject.config = this.addtionjson;
    let result = await this.dev.metaObjectCreate(this.newMetaObject, this.fields);
    if (result) {
      await this.dev.http.createMessage('success', '创建元数据成功');

    } else {
      await this.dev.http.createMessage("error", "创建失败")
    }
  }

  async updateMetaObject() {

    // debugger;
    this.newMetaObject.config = this.config;
    let result = await this.dev.metaObjectUpdate(this.newMetaObject, this.fields);
    if (result) {
      this.dev.http.createMessage('success', '更新成功');
    } else {
      this.dev.http.createMessage("error", "更新失败")
    }
  }
  // 排序上升
  async recnoUp(data: IMetadataField) {
    let nextFiled = this.fields.find(filed => filed.recno == data.recno - 1)
    if (nextFiled) {
      if (data.recno - nextFiled.recno > 0) {
        let recnoNew;
        recnoNew = data.recno
        data.recno = nextFiled.recno
        nextFiled.recno = recnoNew
        await this.recnoRecno()
      }
    } else {
      this.dev.http.createMessage("error", "已经是最高")
    }
  }
  // 排序下移
  async recnoDown(data: IMetadataField) {
    let nextFiled = this.fields.find(filed => filed.recno > data.recno)
    if (nextFiled) {
      if (data.recno - nextFiled.recno < 0) {
        let recnoNew;
        recnoNew = data.recno
        data.recno = nextFiled.recno
        nextFiled.recno = recnoNew

        await this.recnoRecno()
        console.log(data.recno)
      } else {

      }
    } else {
      this.dev.http.createMessage("error", "已经是最低")
    }

  }
  // 重新进行排序
  async recnoRecno() {
    this.fields.sort((field1, field2) => field1.recno - field2.recno)

  }
}




