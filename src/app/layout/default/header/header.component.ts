import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { MenuType } from '../../../constant';
import { StorageService } from '../../../modules/lib';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class HeaderComponent {
  searchToggleStatus: boolean;

  constructor(public settings: SettingsService, ) {

  }

  toggleCollapsedSideabar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

}
