import { Component, OnInit } from '@angular/core';
import { StorageService, DevService } from '../../modules/lib';
import { Router } from '@angular/router';
import { MenuType } from '../../constant';
// import {} from '../..'
@Component({
  selector: 'app-dev-login',
  templateUrl: './dev-login.component.html',
  styleUrls: ['./dev-login.component.css']
})
export class DevLoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  constructor(public storage: StorageService, public dev: DevService, public router: Router) { }

  ngOnInit() {

  }
  async login() {
    this.loading = true;
    let result = await this.dev.devLogin(this.username, this.password);
    this.loading = false;
    console.log(result)
    if (result) {
      this.storage.name = (result.dev as IDevelop).devUserName;
      this.storage.dev = result.dev;
      this.storage.userType = MenuType.Develop;
      this.storage.menuList = (result.menus as IMenu[]).filter(menu => MenuType.Develop == menu.menuType);
      this.storage.token = result.token;
      this.router.navigateByUrl('/admin/dev');
    }
  }

}
