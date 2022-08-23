import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-item',
  templateUrl: './image-item.component.html',
  styleUrls: ['./image-item.component.css']
})
export class ImageItemComponent implements OnInit {
  @Input() fl: any = null;
  @Output() deleteImg: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  deleteMe() {
    this.deleteImg.emit({item :this.fl, type :'projectAttacment'})
  }

  get icon() {
    let namArr  = this.fl.attachmentName.split('.');
    let extn = namArr[namArr.length - 1];
    let imgExtn = ['jpg', 'jpeg', 'png', 'gif']
    return imgExtn.includes(extn) ? `${environment.imgUlr}/${this.fl.attachmentPath}` : 'assets/images/others/doc-icon.png'
  }

}
