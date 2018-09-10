import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DevService } from '../../../lib';
import { ParamType } from '../../../../constant';
import { NzMessageService } from 'ng-zorro-antd';


enum View {
  ListParams = 1,
  CreateParam,
  EditParam
}
@Component({
  selector: 'app-market-local-setting-page',
  templateUrl: './market-local-setting-page.component.html',
  styleUrls: ['./market-local-setting-page.component.css']
})
export class MarketLocalSettingPageComponent implements OnInit {
  newParam: IParam = {
    paramKey: '',
    paramName: '',
    defaultValue: '',
    paramValue: '',
    type: ParamType.Text,
    addition: '',
  }
  dataSet: IParam[] = [];
  ParamType = ParamType
  View = View;
  state = View.ListParams;
  selectedParam: IParam;
  params: IParam[] = [];
  marketId: number;
  page: number = 1;
  pageSize: number = 10;
  total: number = 10;
  constructor(
    public dev: DevService,
    public route: ActivatedRoute,
    public message: NzMessageService

  ) {
    this.marketId = this.route.snapshot.params.marketId;
  }

  async ngOnInit() {
    await this.listLocalParams();
  }
  async listLocalParams() {
    let result = await this.dev.listLocalParams(this.marketId, this.page - 1, this.pageSize);
    this.dataSet = result.rows;
    this.total = result.count;
  }
  async golbalParamCreate() {
    this.newParam.mktId = this.marketId;
    let result = await this.dev.localParamCreate(this.newParam);
    if (result) {

      await this.listLocalParams();
      this.message.success("创建成功")
    } else {
      this.message.error("创建失败")
    }
  }
  async deleteParam(param: IParam) {
    let result = await this.dev.paramDelete(param.id);
    if (result) {
      await this.listLocalParams();
      this.message.success("删除成功")
    } else {
      this.message.error("删除失败")
    }
  }
  async paramUpdate() {
    let result = await this.dev.paramUpdate(this.selectedParam);
    if (result) {
      await this.listLocalParams();
      this.message.success("更新成功")
    } else {
      this.message.error("更新失败")
    }
  }
}
