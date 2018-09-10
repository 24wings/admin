import { Component, OnInit } from '@angular/core';
import { TransFeeRule, TransArea, RecPaySubject } from 'share_platform/market/entity';
import { EmpService, StorageService } from '../../../lib';
import { PageParameter } from 'share_platform/framework/util';
import { NzMessageService } from 'ng-zorro-antd';
enum View {
  mList,
  mCreat,
  mUpdate
}
@Component({
  selector: 'app-trans-fee-rule',
  templateUrl: './trans-fee-rule.component.html',
  styles: []
})
export class TransFeeRuleComponent implements OnInit {
  View = View;
  state = View.mList;
  page: number = 1;
  pageSize: number = 10;
  count: number;
  pageParameter: PageParameter = {
    pageIndex: this.page,
    pageSize: this.pageSize
  }
  transFeeRule: TransFeeRule = {}
  transFeeRules: TransFeeRule[] = []
  transAreas: TransArea[] = []
  recPaySubjects: RecPaySubject[] = []
  constructor(public empService: EmpService, public storage: StorageService, public nzMessage: NzMessageService) { }

  ngOnInit() {
    this.queryTransFeeRuleList()
    this.queryTransAreaList();
    this.queryRecPaySubjectList();
  }

  async queryTransFeeRuleList() {

    let result = await this.empService.queryTransFeeRuleList(this.pageParameter);
    if (result) {
      this.transFeeRules = result.paging.rows
      this.count = result.count
    }
  }

  async queryTransAreaList() {
    let result = await this.empService.txnAreaList()
    if (result) {
      this.transAreas = result.rows
    }
  }

  async queryRecPaySubjectList() {
    let result = await this.empService.listInternalSujects(this.storage.employee.mktId)
    if (result) {
      this.recPaySubjects = result.paging.rows;
    }
  }

  async saveTransFeeRule() {
    let result = await this.empService.createTransFeeRule(this.transFeeRule);
    if (result) {
      this.nzMessage.info(result.msg)
    }
  }

  async updateStatus(id: number, status: boolean) {
    let result = await this.empService.updateTransFeeRule(id, status)
    if (result) {
      this.nzMessage.info(result.msg)
    }
  }

}
