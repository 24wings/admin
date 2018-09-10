import { Injectable } from "@angular/core";
import { MenuType } from "../../../constant";
import { User } from "@delon/theme";

@Injectable()
export class StorageService {
  set name(name: string) {
    localStorage.setItem("name", name);

  }
  set token(str: string) {
    localStorage.setItem('token', str);

  }
  get token() {
    return localStorage.getItem('token');

  }

  get name() {
    return localStorage.getItem("name");
  }
  get userType() {
    return localStorage.getItem('user_type') ? parseInt(localStorage.getItem('user_type')) as any : MenuType.Market
  }
  set userType(userType: MenuType) {
    localStorage.setItem('user_type', userType + '');
  }
  set dev(dev: IDevelop) {
    localStorage.setItem("dev", JSON.stringify(dev));
  }
  get dev() {
    return localStorage.getItem("dev") ? JSON.parse(localStorage.getItem("dev")) : false;
  }

  set shop_user_name(user_name: string) {
    localStorage.setItem("shop_user_name", user_name);
  }
  get shop_user_name() {
    return localStorage.getItem("shop_user_name");
  }



  get user(): null {
    return localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {};
  }

  get menuList(): IMenu[] {
    return localStorage.getItem("menu-list")
      ? JSON.parse(localStorage.getItem("menu-list"))
      : [];
  }
  set menuList(menus: IMenu[]) {
    localStorage.setItem("menu-list", JSON.stringify(menus));
  }




  get gcId() {
    return sessionStorage.getItem('gcId') ? parseInt(sessionStorage.getItem('gcId')) : 0
  }
  set gcId(gcId: number) {
    sessionStorage.setItem('gcId', gcId + '')
  }





  set employee(employee: IUser) {
    localStorage.setItem("employee", JSON.stringify(employee))
  }
  get employee(): IUser {
    return localStorage.getItem("employee") ? JSON.parse(localStorage.getItem("employee")) : {};
  }
  // set localPage(paramValue: string) {
  //   localStorage.setItem("paramKey", paramValue)
  // }
  getLocal(key: string): IParam {
    let local = localStorage.getItem("local") ? JSON.parse(localStorage.getItem("local")) : {};
    return local[key] ? local[key] : {}
  }
  getLocalValue(key: string, defaultValue?: any): any {
    return this.getLocal(key) ? this.getLocal(key).paramValue : defaultValue;
  }
  setLocal(key: string, value: IParam) {
    let local = localStorage.getItem('local') ? JSON.parse(localStorage.getItem('local')) : {};
    local[key] = value;
    localStorage.setItem('local', JSON.stringify(local));
  }



  set lockPassword(lockPassword: string) {
    sessionStorage.setItem("lock", lockPassword)
  }

  get lockPassword() {
    return sessionStorage.getItem("lock")
  }
  constructor() { }
}
