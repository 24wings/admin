import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";


interface LoginOption {
  label: string;
  value: {
    url: string;
  };
}
import {
  StorageService,
  MyHttpService,
  DevService,
  EmpService
} from "../../modules/lib";
import { MenuType } from "../../constant";
// import { EmptyError } from "rxjs";
@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
  username: string = "";
  password: string = "";
  selectedLoginOption: LoginOption;
  isElectron: boolean = false;
  loading: boolean = false;


  constructor(


    public router: Router,
    public storage: StorageService,

    public http: MyHttpService,
    public lowHttp: Http,
    public dev: DevService,
    public emp: EmpService

  ) { }



  async ngOnInit() {

  }
  async login() {
    if (!this.loading) {

      this.loading = true;
      let result = await this.emp.EmpLogin(this.username, this.password);
      this.loading = false;

      if (result) {

        this.storage.employee = result.employee;

        this.storage.userType = MenuType.Market
        this.storage.shop_user_name = this.storage.employee.userName
        this.storage.menuList = result.menus
        this.storage.token = result.token
        this.router.navigateByUrl('/admin/employee/role')
      }


    }
  }


}
