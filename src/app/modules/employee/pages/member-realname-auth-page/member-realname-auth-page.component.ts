import { Component, OnInit } from '@angular/core';
import { EmpService } from '../../../lib';

enum View {
  WaitAuth,
  HadAuth,
  AuthDetail
}
@Component({
  selector: 'app-member-realname-auth-page',
  templateUrl: './member-realname-auth-page.component.html',
  styles: []
})
export class MemberRealnameAuthPageComponent implements OnInit {
  state = View.WaitAuth;
  View = View;
  memberRealnameAuths: IMemberRealnameAuth[] = [];

  toWaitAuth() {
    this.state = View.WaitAuth;
    // this.listProcesingMemberRealnameAuth();
  }
  toHadAuth() {
    this.state = View.HadAuth;
    // this.listNoneProcesingMemberRealnameAuth();

  }
  constructor(public employee: EmpService) { }

  ngOnInit() {
  }
  // async listProcesingMemberRealnameAuth() {
  //   this.memberRealnameAuths = await this.employee.memberRealnameAuthByStatus(MemberRealnameStatus.Processing);

  // }
  // async listNoneProcesingMemberRealnameAuth() {
  //   this.memberRealnameAuths = await this.employee.memberRealnameAuthNotInStatus(MemberRealnameStatus.Processing);
  // }



}
