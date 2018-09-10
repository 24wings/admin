import { Injectable } from "@angular/core";

import { NzMessageService } from "ng-zorro-antd";
import {
  Http,
  RequestOptions,
  RequestOptionsArgs,
  Headers
} from "@angular/http";
import { AppConfig } from "../../../app.config";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable()
export class MyHttpService {
  httpTimeout: number = 3000;
  isMock: boolean = false;
  isDev: boolean = true;
  get ip(): string {
    return this.appConfig.ip;
  }



  Get(url: string, options?: RequestOptionsArgs, authHeader: boolean = true) {
    if (this.isMock) {
      return this.mockGet(url);
    }

    if (!options) options = { headers: new Headers({ Authorization: `Bearer ${this.stroge.token}` }) }
    else options.headers = new Headers({ Authorization: `Bearer ${this.stroge.token}` });
    return this.http
      .get(`${this.ip}${url}`, options)
      .toPromise()
      .then((rtn) => {
        let result = rtn.json() as any;
        if (rtn.status > 400 && rtn.status < 500) {
          return result = { ok: false, msg: '资源访问错误:' + rtn.json().message, status: rtn.status }
        } else if (rtn.status >= 500) {
          return result = { ok: false, msg: this.appConfig.debug ? rtn.json().msg : '服务器内部错误:', status: rtn.status }
        }
        if (!result.ok) { return this.createMessage("error", result.data) && false; }
        return result.data;
      }
      ).catch((e) => {
        this.handleError(e);
      });
  }
  Post(url: string, body: any, options?: RequestOptionsArgs): Promise<any> {
    if (this.isMock) {
      return this.mockGet(url);
    }
    if (!options) options = { headers: new Headers({ Authorization: `Bearer ${this.stroge.token}` }) }
    else options.headers = new Headers({ Authorization: `Bearer ${this.stroge.token}` });

    return this.http
      .post(`${this.ip}${url}`, body, options)
      .toPromise()
      .then(rtn => {
        let result = rtn.json() as any;;
        if (rtn.status > 400 && rtn.status < 500) {
          result = { ok: false, data: '资源访问错误:' + rtn.json().message, status: rtn.status }
        } else if (rtn.status >= 500) {
          result = { ok: false, data: this.appConfig.debug ? rtn.json().msg : '服务器内部错误:', status: rtn.status }
        }
        if (!result.ok) {
          this.createMessage("error", result.msg);
          return false;
        } else {
          return result.data;
        }

      }).catch(e => this.handleError(e));
    /**超过timeout 时间就会执行以下代码,返回错误信息 */


  }

  Delete(url: string, options?: RequestOptionsArgs) {
    url = url.startsWith("http") ? url : `${this.ip}${url}`;
    options = options ? options : {};
    return this.http
      .delete(`${this.ip}${url}`)
      .toPromise()
      .then(rtn => {
        let result = rtn as any;
        return result.ok
          ? result.data
          : this.createMessage("error", result.data);
      });
  }

  Put(url: string, body, options?: RequestOptionsArgs) {
    url = url.startsWith("http") ? url : `${this.ip}${url}`;
    options = options ? options : {};
    // options.withCredentials = true;
    return this.http
      .put(`${this.ip}${url}`, body)
      .toPromise()
      .then(rtn => {
        let result = rtn as any;
        return result.ok
          ? result.data
          : this.createMessage("error", result.data);
      });
  }
  async handleError(res: Response) {
    switch (res.status) {
      case 404:
        this.createMessage('error', '404请求的资源不存在');
        break;
      case 500:
        let body = await res.json();
        this.createMessage('error', this.appConfig.debug ? body.msg : '服务器内部错误');
        break;
      default:
        this.createMessage('error', res.status + '尚未捕获的请求异常');

        break;
    }
    return false;
  }
  localGet(url: string) {
    return this.http.get(url).toPromise();
  }
  localGetJSON(url: string) {
    return this.http
      .get(url)
      .toPromise()
      .then(rtn => rtn.json());
  }
  mockGet(url: string) {
    return this.http
      .get("/assets/mock" + url + ".json")
      .toPromise()
      .then(rtn => rtn.json())
      .then(rtn => rtn.data);
  }

  createMessage(type: "error" | "success" | "warning", text) {
    return this._message.create(type, `${text}`);
  }
  constructor(public http: Http,
    private _message: NzMessageService, public appConfig: AppConfig, public stroge: StorageService) { }
}
