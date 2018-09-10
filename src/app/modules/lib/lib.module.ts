import { NgModule, ModuleWithProviders } from "@angular/core";

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from "@angular/router";
import { HttpModule, JsonpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { CommonService, EmpService, } from "./service";
import { BackDirective, BgImgDirective, MenuCodeDirective } from "./directive";
import { ImageViewerDirective } from "./directive/image-viewer.directive";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { DevService } from './service/dev.service';
import { MyHttpService } from "./service/http.service";
import { StorageService } from "./service/storage.service";
import { AppConfig } from "../../app.config";
import { CrawlService } from "./service/crawl.service";

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    JsonpModule,
    HttpClientModule,
    // BrowserAnimationsModule,
    NgZorroAntdModule.forRoot()
  ],
  declarations: [
    // NzPopconfirmDirective,

    BgImgDirective,
    BackDirective,
    ImageViewerDirective,
    MenuCodeDirective


  ],
  exports: [
    NgZorroAntdModule,
    CommonModule,
    HttpModule,
    FormsModule,
    JsonpModule,
    BgImgDirective,
    BackDirective,
    ImageViewerDirective,
    MenuCodeDirective
    // NzPopconfirmDirective,


  ],
  providers: [
    AppConfig,
    CommonService,
    BackDirective,
    BgImgDirective,
    ImageViewerDirective,
    MyHttpService,
    StorageService,
    DevService,
    EmpService,
    CrawlService
  ]
})
export class LibModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LibModule,
      providers: [
        CommonService,
        BackDirective,
        BgImgDirective,

        ImageViewerDirective,
        MyHttpService,
        StorageService,
        DevService,
        EmpService,
        CrawlService,
      ]
    };
  }
}
