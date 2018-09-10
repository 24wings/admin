import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbPageComponent } from './pages/db-page/db-page.component';
import { ToolPageComponent } from './pages/tool-page/tool-page.component';
import { TablePageComponent } from './pages/table-page/table-page.component';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LibModule } from '../lib';
import { DbDetailPageComponent } from './pages/db-detail-page/db-detail-page.component';
import { ZbjPageComponent } from './pages/zbj-page/zbj-page.component';



@NgModule({
  imports: [
    FormsModule,
    LibModule.forRoot(),
    RouterModule.forChild([

      { path: '', component: DbPageComponent, data: { title: '数据库管理' } },
      { path: 'db/:dbId/table', component: TablePageComponent, data: { title: '表管理' } },
      { path: 'db/:dbId/table/:tableId', component: TablePageComponent, data: { title: "表详情" } },
      { path: 'db', component: DbPageComponent },
      { path: 'db/:dbId', component: DbDetailPageComponent, data: { title: '数据库详情' } },
      { path: 'zbj', component: ZbjPageComponent, data: { title: '猪八戒' } }
      //
      // {path:'api-test',component:ApiPageComponent}

    ]),


    CommonModule
  ],
  declarations: [DbPageComponent,
    ToolPageComponent,
    TablePageComponent,
    ZbjPageComponent,
    DbDetailPageComponent,
    // ApiPageComponent
  ]
})
export class ToolModule { }
