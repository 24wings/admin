import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appImageViewer]',
  host: {
    '(click)': 'showImage($event.target)'
  }
})
export class ImageViewerDirective {
  @Input() appImageViewer: { src: string, label?: string, summary?: string };// = { src: 'http://res.cloudinary.com/dnf1ydl7w/image/upload/c_fit,h_600,q_80,w_900/path%2Fto%2Fimage%2Fpjqek3dlyogvg6sctm8m', label: '1/1' };

  showImage(image: HTMLImageElement) {
    console.log(image);
    if (!this.appImageViewer) {
      this.appImageViewer = { src: image.src, label: image.alt }
    }
    console.log(this.appImageViewer);
    let divEl = document.createElement('div');
    divEl.innerHTML = `
    <div class="cover">
    <div class="img-box">
    <div>
    <div class="viewer-close">
    <i class="glyphicon glyphicon-remove"></i>
    </div>
      <figure>
        <img class="img-responsive" src="${this.appImageViewer.src}"
          alt="">
      </figure>
      <div class="viewer-pagenum">
       ${this.appImageViewer.label}
      </div>
    </div>
    </div>
  </div>
  
   `;
    divEl.querySelector('.viewer-close').addEventListener('click', (e) => {
      divEl.remove();
    })
    document.body.appendChild(divEl);

  }
  constructor() { }

}
