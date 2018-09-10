import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonService } from '../service';

@Directive({
  selector: '[menuCode]'
})
export class MenuCodeDirective {



  constructor(public common: CommonService, private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  @Input() set menuCode(code: string) {
    if (code && this.common.checkMenuCodeExisit(code)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
