import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";

import { Observable } from "rxjs";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class ContentTypeInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.headers.get("content-type") != "application/json") {
      req.headers.set("content-type", "application/json");
    }
    console.log(`req`, req);
    return next.handle(req);
  }
}
