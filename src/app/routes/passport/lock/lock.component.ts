import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from '@delon/theme';
import { StorageService } from '../../../modules/lib';
import { NzMessageService } from 'ng-zorro-antd';


enum View {
  setPassword,//设置锁屏密码
  okPassword,//解锁
}
@Component({
  selector: 'passport-lock',
  templateUrl: './lock.component.html',
})
export class UserLockComponent {
  f: FormGroup;
  lockPassword: string = "";
  UnlockPassword: string = "";
  state = View.setPassword;
  View = View;


  constructor(
    public settings: SettingsService,
    fb: FormBuilder,
    private router: Router,
    public storage: StorageService,
    public message: NzMessageService

  ) {
    this.f = fb.group({
      password: [null, Validators.required],
    });
  }

  async submit() {
    if (this.UnlockPassword == this.storage.lockPassword) {
      this.message.success('解锁成功');
      this.storage.lockPassword = '';
      this.router.navigate(['/admin/dev']);

    } else {
      this.message.warning('密码不正确');
    }


  }
  async setLock() {

    this.storage.lockPassword = this.lockPassword
    this.state = View.okPassword
  }

  async  ngOnInit() {
    if (this.storage.lockPassword) {
      this.state = View.okPassword
    } else {
      this.state = View.setPassword
    }

  }
}
