import { Component, OnInit, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { QueryAttribute } from '../../share_platform/framework/entity/QueryAttribute';
import { AttrComponent } from '@shared/attr/attr.component';

@Component({
  selector: 'app-query-attr-toolbar',
  templateUrl: './query-attr-toolbar.component.html',
  styles: []
})
export class QueryAttrToolbarComponent implements OnInit {

  @ViewChildren("attrCom") attrComs: AttrComponent[];

  @Input() queryAttributes: QueryAttribute[] = [];
  @Output() onSearch = new EventEmitter<QueryAttribute[]>();

  @Input() showSearchButton: boolean = true;
  constructor() { }

  ngOnInit() {


  }
  search(): QueryAttribute[] {

    this.onSearch.emit(this.queryAttributes);
    return this.queryAttributes;
  }


}
