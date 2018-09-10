import { Component, OnInit } from '@angular/core';
import { DevService } from '../../../lib';
import { ActivatedRoute } from '@angular/router';
enum ViewType {
  Single = 'single',
  Relation = 'relation'
}
@Component({
  selector: 'app-dynamic-page',
  templateUrl: './dynamic-page.component.html',
  styles: []
})
export class DynamicPageComponent implements OnInit {
  ViewType = ViewType;
  menu: IMenu;
  private menuCode: string;
  /**
   *    关系型视图配置数据
   */
  config: ViewConfig;

  // testRelationConfig: ViewConfig = {
  //   "viewType": "relation",
  //   "singleConfig": { "objectCode": '5', "initQuery": [] },
  //   "relationConfig": {
  //     "searchbar": true, "objectCode": '6',
  //     "buttons": [
  //       { "text": "组织", "action": "this.initChildren([{ field: 'marketId', value: data.mktId, compare: '=' }])", "objectCode": '7', "firstLoad": true, "searchbar": false }
  //     ]
  //   },
  // };

  constructor(public dev: DevService, public route: ActivatedRoute) {
    this.menuCode = this.route.snapshot.params.menuCode;
  }

  ngOnInit() {
    this.menuDetail();

  }
  async menuDetail() {
    this.menu = await this.dev.menuDetailByMenuCode(this.menuCode);
    this.config = this.menu.config as any;
    console.log(this.config);
    // debugger
  }

}
