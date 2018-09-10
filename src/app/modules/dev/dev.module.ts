import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { GroupCompanyPageComponent } from './pages/group-company-page/group-company-page.component';
import { MarketPageComponent } from './pages/market-page/market-page.component';
import { GroupCompanyMainPageComponent } from './pages/group-company-main-page/group-company-main-page.component';
import { GroupCompanyEmployeePageComponent } from './pages/group-company-employee-page/group-company-employee-page.component';
import { GroupCompanyMenuManagePageComponent } from './pages/group-company-menu-manage-page/group-company-menu-manage-page.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { registerLocaleData } from "@angular/common";
import zh from "@angular/common/locales/zh";
import { LibModule } from '../lib';
registerLocaleData(zh);

import { OrgPageComponent } from './pages/org-page/org-page.component';
import { RolePageComponent } from './pages/role-page/role-page.component';


import { MarketMainNavComponent } from './com/market-main-nav/market-main-nav.component';
import { MarketGolbalSettingPageComponent } from './pages/market-golbal-setting-page/market-golbal-setting-page.component';
import { MarketLocalSettingPageComponent } from './pages/market-local-setting-page/market-local-setting-page.component';
import { DeveloperPageComponent } from './pages/developer-page/developer-page.component';
import { MetaManagePageComponent } from './pages/meta-manage-page/meta-manage-page.component';
import { Menu2PageComponent } from './pages/menu2-page/menu2-page.component';
import { MetaCreatePageComponent } from './pages/meta-create-page/meta-create-page.component';
import { MetaDetailPageComponent } from './pages/meta-detail-page/meta-detail-page.component';
import { MetaEditPageComponent } from './pages/meta-edit-page/meta-edit-page.component';
import { DynamicPageComponent } from './pages/dynamic-page/dynamic-page.component';
import { SharedModule } from '@shared/shared.module';
import { CommodityTypeComponent } from './pages/commodity-type/commodity-type.component';
import { SubjectComponent } from './pages/subject/subject.component';
import { MarketSubjectComponent } from './pages/market-subject/market-subject.component';
// import { LayoutDefaultComponent } from '../../layout/default/default.component';

const routes: Routes = [
  // { path: '', redirectTo: '/menu' },
  // {
  //   path: "group-company", component: HomePageComponent, children: [
  //     { path: '', component: GroupCompanyPageComponent }
  //   ],
  // },
  // { path: '', redirectTo: '/admin/dev/menu', pathMatch: 'full' },
  // {path:'',resolve:{name:''},r},


  { path: 'menu', component: MenuPageComponent, data: { title: '菜单设计' } },
  { path: '', redirectTo: 'menu', pathMatch: "full" },
  { path: "group-company", component: GroupCompanyPageComponent, data: { title: '组织管理' } },
  {
    path: 'market', component: GroupCompanyMainPageComponent, data: { title: '组织详情' }, children: [
      { path: ':marketId/menu', component: GroupCompanyMenuManagePageComponent, data: { title: '组织菜单' } },
      { path: ':marketId/org', component: OrgPageComponent, data: { title: '组织管理' } },
      { path: ":marketId/employee", component: GroupCompanyEmployeePageComponent, data: { title: '组织员工' } },
      { path: ':marketId/role', component: RolePageComponent, data: { title: '组织角色' } },
      {
        path: ':marketId/golbal-setting', component: MarketGolbalSettingPageComponent, data: { title: '全局参数设置' }
      },
      {
        path: ':marketId/local-setting',
        component: MarketLocalSettingPageComponent,
        data: { title: '本地数据管理' }
      }
    ]
  },

  { path: 'developer', component: DeveloperPageComponent, data: { title: '开发者管理' } },
  { path: 'meta', component: MetaManagePageComponent, data: { title: '元数据管理' } },
  { path: "menu2", component: Menu2PageComponent, data: { title: "菜单2" } },
  { path: "meta-create", component: MetaCreatePageComponent, data: { title: '创建元数据' } },
  { path: 'meta/:objectCode/edit', component: MetaCreatePageComponent, data: { title: '编辑元数据' } },
  { path: 'meta/:objectCode/detail', component: MetaDetailPageComponent, data: { title: '元数据详情页面' } },
  { path: 'dynamic/:menuCode', component: DynamicPageComponent, data: { title: '动态视图页面' } },
  { path: "commodity-type", component: CommodityTypeComponent, data: { title: "商品品类管理" } },
  { path: "subject", component: SubjectComponent, data: { title: "市场固定收支" } },


];

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    CommonModule, NgZorroAntdModule.forRoot(),
    RouterModule.forChild(routes),

    FormsModule, ReactiveFormsModule,
    LibModule.forRoot()
  ],
  declarations: [
    MenuPageComponent,
    GroupCompanyPageComponent,
    MarketPageComponent,
    GroupCompanyMainPageComponent,
    GroupCompanyEmployeePageComponent,
    GroupCompanyMenuManagePageComponent,
    OrgPageComponent,
    RolePageComponent,
    MarketGolbalSettingPageComponent,
    MarketMainNavComponent,
    Menu2PageComponent,
    MetaDetailPageComponent,
    MetaEditPageComponent,
    CommodityTypeComponent,
    // DynamicPageCom,
    DynamicPageComponent,

    // SubjectComponentponent,
    MarketLocalSettingPageComponent,
    DeveloperPageComponent,
    MetaManagePageComponent,
    MetaCreatePageComponent,
    CommodityTypeComponent,
    SubjectComponent,
    MarketSubjectComponent

  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DevModule { }
