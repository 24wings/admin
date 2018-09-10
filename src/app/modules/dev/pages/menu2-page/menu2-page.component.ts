import { Component, OnInit } from '@angular/core';

import { NzTreeNode } from 'ng-zorro-antd';
import { DevService, StorageService } from '../../../lib';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu2-page',
  templateUrl: './menu2-page.component.html',
  styles: []
})
export class Menu2PageComponent implements OnInit {

  menuNodes: NzTreeNode[] = [];
  menu: IMenu;
  marketId: number;
  develop: IDevelop;
  optionParentMenus: any;
  mouseAction(name: string, e: any): void {
    console.log(name, e);

    this.menuNodes = [new NzTreeNode({
      title: this.menu.text,
      key: '0' as any,
      expanded: true,
      children: []
    })];
  }
  constructor(public dev: DevService, public route: ActivatedRoute, public storage: StorageService) {
    this.develop = this.storage.dev

  }

  ngOnInit() {
    // this.menuList()

  }

}
