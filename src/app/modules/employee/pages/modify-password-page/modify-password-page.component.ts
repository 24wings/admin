import { Component, OnInit } from '@angular/core';
import { AdStandardFormRowModule } from '@delon/abc';
import { EmpService, StorageService } from '../../../lib';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
@Component({
  selector: 'app-modify-password-page',
  templateUrl: './modify-password-page.component.html',
  styles: ["./modify-password-page.component.css"]
})

export class ModifyPasswordPageComponent implements OnInit {
  password: string = "";
  newpassword: string = "";
  epId: number;
  employee: IUser
  constructor(public emp: EmpService, public store: StorageService, public message: NzMessageService, public router: Router) {
    this.employee = this.store.employee;
    this.epId = this.employee.id
  }

  ngOnInit() {
  }
  async modify() {
    if (this.password == this.newpassword) {

      let result = await this.emp.modifyPassword(this.epId, this.password);
      if (result) {
        this.message.success('修改成功，请重新登录');
        this.router.navigateByUrl("/admin/login")
      }

    } else {
      this.message.warning('密码不一致');
    }

  }
}
