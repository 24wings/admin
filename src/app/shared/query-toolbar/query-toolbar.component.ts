import { Component, OnInit, Input, Output, EventEmitter, ViewChildren } from '@angular/core';
import { FieldComponent } from '@shared/field/field.component';
import { QueryField } from 'share_platform/framework/util';
import { QueryCondition } from '../../share_platform/framework/util';

@Component({
  selector: 'app-query-toolbar',
  templateUrl: './query-toolbar.component.html',
  styles: []
})
export class QueryToolbarComponent implements OnInit {
  @ViewChildren(FieldComponent) fieldComponents: FieldComponent[];
  @Input() queryFields: QueryCondition[] = [];
  @Output() onSearch = new EventEmitter();
  @Input() showSearchButton: boolean = true;

  constructor() { }

  ngOnInit() {
  }
  search(): QueryCondition[] {
    let fields: QueryCondition[] = [];
    let fieldArrs = this.fieldComponents.map(field => field.getFieldQueryOptions());
    fieldArrs.forEach(fieldArr => fields.push(...fieldArr));
    this.onSearch.emit(fields);
    return fields;
  }

}
