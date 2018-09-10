import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LibModule } from '../modules/lib';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';

// region: third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { SingleViewComponent } from '@shared/single-view/single-view.component';
import { RelationViewComponent } from '@shared/relation-view/relation-view.component';
import { FieldComponent } from '@shared/field/field.component';
import { QueryToolbarComponent } from '@shared/query-toolbar/query-toolbar.component';
import { QueryModalComponent } from './query-modal/query-modal.component';
import { QueryAttrToolbarComponent } from './query-attr-toolbar/query-attr-toolbar.component';
import { AttrComponent } from './attr/attr.component';
import { QuerySelectModalComponent } from './query-select-modal/query-select-modal.component';
const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule
];
// endregion

// region: your componets & directives
const COMPONENTS = [SingleViewComponent, RelationViewComponent, FieldComponent, QueryToolbarComponent, QueryModalComponent, QuerySelectModalComponent];
const DIRECTIVES = [];
// endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgZorroAntdModule.forRoot(),
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES,
    LibModule.forRoot()
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    QueryAttrToolbarComponent,
    AttrComponent,
    QuerySelectModalComponent
  ],
  exports: [
    ...COMPONENTS,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES,
    // your components

    ...DIRECTIVES,

  ]
})
export class SharedModule { }
