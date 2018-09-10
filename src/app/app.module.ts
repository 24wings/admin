import { NgModule, LOCALE_ID, APP_INITIALIZER, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DelonModule } from './delon.module';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { AppComponent } from './app.component';
import { RoutesModule } from './routes/routes.module';
import { LayoutModule } from './layout/layout.module';
import { StartupService } from '@core/startup/startup.service';
import { DefaultInterceptor } from '@core/net/default.interceptor';
import { SimpleInterceptor } from '@delon/auth';
// import { AdXlsxModule } from '@delon/abc';
// angular i18n
import { registerLocaleData } from '@angular/common';
import localeZhHans from '@angular/common/locales/zh-Hans';
registerLocaleData(localeZhHans);

// @delon/form: JSON Schema form
import { JsonSchemaModule } from '@shared/json-schema/json-schema.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DevLoginComponent } from './pages/dev-login/dev-login.component';
import { LibModule } from './modules/lib';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { LayoutDefaultComponent } from "./layout/default/default.component"
import { AppConfig, } from './app.config';
import { SingleViewComponent } from '@shared/single-view/single-view.component';
import { RelationViewComponent } from '@shared/relation-view/relation-view.component';
import { FieldComponent } from '@shared/field/field.component';
import { QueryToolbarComponent } from '@shared/query-toolbar/query-toolbar.component';
import { QueryModalComponent } from '@shared/query-modal/query-modal.component';

export function StartupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

const COMPONENTS = [SingleViewComponent, RelationViewComponent, FieldComponent, QueryToolbarComponent, QueryModalComponent];
@NgModule({
  declarations: [
    // LayoutDefaultComponent,
    LoginPageComponent,
    DevLoginComponent,
    AppComponent
    // ...COMPONENTS
  ],

  imports: [

    SharedModule,
    LibModule.forRoot(),
    FormsModule,
    // AdXlsxModule.forRoot(),
    ReactiveFormsModule,
    NgZorroAntdModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,
    DelonModule.forRoot(),
    CoreModule,

    LayoutModule,
    RoutesModule,
    // JSON-Schema form
    JsonSchemaModule,

  ],
  providers: [
    { provide: AppConfig, useClass: AppConfig },

    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true
    }



  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: []
})
export class AppModule { }
