import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Jsonp, Http, RequestOptionsArgs } from "@angular/http";
import { Location } from "@angular/common";
import { FormGroup, FormControl } from "@angular/forms";
import { CommonService } from "./common.service";


declare var WeixinJSBridge: any;
@Injectable()
export class ConfigService {
  fieldsToFromGroup(fields: any[]) {
    let group: any = {};
    // this.createUserFormGroup=
    // fields.forEach(field => {
    //   console.log(field);
    //   group[field.key] = new FormControl(field.value || "", field.validators);
    //   // filed.key
    // });
    return new FormGroup(group);
  }

  // 根据ip获取用户地理位置
  // async ipLocalAddress() {
  //   let localAddress: Address = await this.api.Get('/api.ipAddress.go');
  //   return { code: localAddress.data.city_id, name: localAddress.data.city };
  // }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public http: Http,
    public jsonp: Jsonp,
    public location: Location,
    public common: CommonService,

  ) { }

  clearObject(obj: Object): void {
    for (let key in obj) {
      if (typeof obj[key] == "object") {
        this.clearObject(obj[key]);
      } else {
        delete obj[key];
      }
    }
  }
}
