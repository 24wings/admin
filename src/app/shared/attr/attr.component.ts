import { Component, OnInit, Input } from '@angular/core';
import { QueryAttribute } from '../../share_platform/framework/entity/QueryAttribute';

@Component({
  selector: 'app-attr',
  templateUrl: './attr.component.html',
  styles: []
})
export class AttrComponent implements OnInit {
  @Input() attr: QueryAttribute
  constructor() { }

  ngOnInit() {
    console.log(this.attr);
  }

}
