import { Directive, Input, HostBinding, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[bgImg]'
})
export class BgImgDirective {
  @HostBinding('style.background-image')
  @Input() bgImg: any;


  constructor(public el: ElementRef, public safe: DomSanitizer) {
    setTimeout(() => {

      this.bgImg = safe.bypassSecurityTrustStyle(<any>this.bgImg)
    }, 500);
  }

}
