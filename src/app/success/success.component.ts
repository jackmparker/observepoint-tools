import { Component, Input } from '@angular/core';

@Component({
  selector: 'success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent {

  @Input() message: any;
  @Input() show: boolean;

  onCloseClick() {
    this.show = false;
  }

}
