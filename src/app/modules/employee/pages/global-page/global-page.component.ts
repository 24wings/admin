

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService, EmpService } from '../../../lib';
import { ParamType } from '../../../../constant';


enum View {
  ListParams = 1,
  CreateParam,
  EditParam
}
@Component({
  selector: 'app-global-page',
  templateUrl: './global-page.component.html',
  styleUrls: ['./global-page.component.css']
})
export class GlobalPageComponent implements OnInit {
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
  employee: IUser;
  constructor(public emp: EmpService, public route: ActivatedRoute, public store: StorageService) {
    this.employee = this.store.employee
    this.marketId = this.employee.mktId

  }

  async ngOnInit() {
    await this.listGolbalParams();
  }
  async listGolbalParams() {
    let result = await this.emp.listGolbalParams(this.marketId, this.page - 1, this.pageSize);
    this.dataSet = result.rows;
    this.total = result.count;
  }
  // async golbalParamCreate() {
  //   this.newParam.mktId = this.marketId;
  //   await this.emp.golbalParamsCreate(this.newParam);
  //   await this.listGolbalParams();
  // }
  // async deleteParam(param: IParam) {
  //   await this.emp.paramDelete(param.id);
  //   await this.listGolbalParams();
  // }
  async paramUpdate() {
    await this.emp.paramUpdate(this.selectedParam);
    await this.listGolbalParams();
  }
}
