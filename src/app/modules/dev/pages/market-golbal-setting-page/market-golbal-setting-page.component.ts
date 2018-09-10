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
  selector: 'app-market-golbal-setting-page',
  templateUrl: './market-golbal-setting-page.component.html',
  styleUrls: ['./market-golbal-setting-page.component.css']
})
export class MarketGolbalSettingPageComponent implements OnInit {
  dataSet: IParam[] = [];
  total: number = 10;
  selectedParam: IParam
  newParam: IParam = {
    paramKey: '',
    paramName: '',
    defaultValue: '',
    paramValue: '',
    type: ParamType.Text,
    addition: '',
  }
  ParamType = ParamType
  View = View;
  state = View.ListParams;
  params: IParam[] = [];
  marketId: number;
  page: number = 1;
  pageSize: number = 10;
  constructor(
    public dev: DevService,
    public route: ActivatedRoute,
    private nzMessageService: NzMessageService) {
    this.marketId = this.route.snapshot.params.marketId;
  }



  async ngOnInit() {
    await this.listGolbalParams();
  }
  async listGolbalParams() {
    let result = await this.dev.listGolbalParams(this.marketId, this.page - 1, this.pageSize);
    this.dataSet = result.rows;
    this.total = result.count;
  }
  async golbalParamCreate() {
    this.newParam.mktId = this.marketId;
    let result = await this.dev.golbalParamsCreate(this.newParam);
    if (result) {
      await this.listGolbalParams();
      this.nzMessageService.success("创建成功")
    } else {
      this.nzMessageService.error("创建失败")
    }
  }
  async deleteParam(param: IParam) {

    let result = await this.dev.paramDelete(param.id);
    if (result) {
      await this.listGolbalParams();
      this.nzMessageService.success('删除成功');
    } else {
      this.nzMessageService.error("删除失败")
    }
  }
  async paramUpdate() {
    let result = await this.dev.paramUpdate(this.selectedParam);
    if (result) {
      await this.listGolbalParams();
      this.nzMessageService.success("更新成功")
    } else {
      this.nzMessageService.error("更新失败")
    }
  }
}
