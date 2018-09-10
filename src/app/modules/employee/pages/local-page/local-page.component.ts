
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
  selector: 'app-local-page',
  templateUrl: './local-page.component.html',
  styleUrls: ['./local-page.component.css']
})
export class LocalPageComponent implements OnInit {
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
  employee: IUser;
  param: IParam
  constructor(public emp: EmpService, public route: ActivatedRoute, public store: StorageService) {
    this.employee = this.store.employee
    this.marketId = this.employee.mktId;

  }

  async ngOnInit() {
    await this.listLocalParams();
  }
  async listLocalParams() {
    let result = await this.emp.listLocalParams(this.marketId, this.page - 1, this.pageSize);


    this.dataSet = result.rows;
    this.dataSet.forEach(data => data.paramValue = this.store.getLocalValue(data.paramKey, data.defaultValue));
    this.total = result.count;
  }

  setLocal() {
    this.store.setLocal(this.selectedParam.paramKey, this.selectedParam)
    this.state = View.ListParams;
  }

}
