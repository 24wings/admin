import { Component, OnInit } from '@angular/core';
import { EmpService, StorageService } from '../../../lib';
import { PageParameter } from 'share_platform/framework/util';

enum View {
  ListTxn = 1,
  CreatTxa,
  UpdateTxa
}
@Component({
  selector: 'app-txnarea',
  templateUrl: './txnarea.component.html',
  styles: []
})
export class TxnareaComponent implements OnInit {
  txnarea: ITxnArea;
  txnareas: ITxnArea[]
  View = View;
  state = View.ListTxn;
  mktId: number
  page: number = 1
  pageSize: number = 10
  count: number
  editTxn: ITxnArea
  newTxnarea: ITxnArea = {
    txnName: ""
  }
  constructor(
    public emp: EmpService,
    public sto: StorageService
  ) { }


  async AddTxa() {
    await this.emp.txnAreaCreate(this.newTxnarea)
    this.state = View.ListTxn
    this.ListTxa()

  }
  async ListTxa() {
    let pageParameter: PageParameter = {
      pageIndex: this.page - 1,
      pageSize: this.pageSize
    }
    let result = await this.emp.txnAreaList(pageParameter)
    this.txnareas = result.rows
    this.count = result.count

  }
  async deleteTxn(txnarea) {

    await this.emp.txnAreaDelete(txnarea.txnId)
    this.ListTxa()
  }
  async showTxa(txnarea) {
    this.state = View.UpdateTxa
    this.editTxn = txnarea
  }
  async updateTxa() {
    await this.emp.txnAreaUpdate(this.editTxn)
    this.state = View.ListTxn;
    this.ListTxa()

  }
  ngOnInit() {
    this.mktId = this.sto.employee.mktId
    this.ListTxa()
  }

  handleCancel() {
    this.state = View.ListTxn
  }


}
