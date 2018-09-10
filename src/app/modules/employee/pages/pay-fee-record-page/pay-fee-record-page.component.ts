import { Component, OnInit } from '@angular/core';
import { EmpService, CommonService, StorageService } from '../../../lib';
import { EntityEnum } from '../../../../entity.enum';




enum View {
  List,
  PreFinishRecord
}

@Component({
  selector: 'app-pay-fee-record-page',
  templateUrl: './pay-fee-record-page.component.html',
  styles: []
})
export class PayFeeRecordPageComponent implements OnInit {
  state = View.List;
  View = View;
  phone: string = '15120051417';
  daterange: Date[] = [];
  status: 'active' | 'finish' = 'active';
  // selectedPayFeeRecord: IPayFeeRecord;

  // payFeeRecords: IPayFeeRecord[] = [];
  constructor(public emp: EmpService, public common: CommonService, public storage: StorageService) { }

  ngOnInit() {
    this.common.singleTableQuery(EntityEnum.Customer, { mktId: this.storage.employee.mktId, mobi: this.phone })
    this.queryMemberPayFeeOrders();
  }
  async  queryMemberPayFeeOrders() {
    // this.payFeeRecords = await this.emp.payFeeRecordQuery(this.phone, this.status);
  }
  // preFinishRecord(data: IPayFeeRecord) {
  //   this.queryRecordDetail(data.recordId);
  //   this.selectedPayFeeRecord = data;
  //   this.state = View.PreFinishRecord;
  // }

  async queryRecordDetail(recordId) {
    // this.emp.payFeeRecordDetail(recordId);

  }

  async   finishRecord() {
    // await this.emp.payFeeRecordFinish(this.selectedPayFeeRecord.recordId, this.selectedPayFeeRecord.realChargeMoney);
  }


}
