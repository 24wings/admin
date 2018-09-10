import { Directive, HostListener, } from '@angular/core';
import { Router, Route } from '@angular/router';
import { Location } from '@angular/common';
@Directive({
  selector: '[appBack]'
})
export class BackDirective {
  @HostListener('click')
  goBack() {
    this.location.back();
  }
  constructor(public location: Location) {

  }

}
