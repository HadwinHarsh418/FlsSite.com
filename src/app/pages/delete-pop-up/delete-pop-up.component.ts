import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-delete-pop-up',
  templateUrl: './delete-pop-up.component.html',
  styleUrls: ['./delete-pop-up.component.css']
})
export class DeletePopUpComponent implements OnInit {
  @Input() id;
  deleteItem: boolean;
  constructor(public activeModal: NgbActiveModal,
    private itemService: ItemsService,
    private toastr: ToastrManager
  ) { }

  ngOnInit(): void {
  }
  close(status = false) {
    this.activeModal.close(status);
  }

  delete() {
    this.deleteItem = true;
    this.itemService.deleteItem(this.id).subscribe((res) => {
      if (res) {
        this.deleteItem = false;
        this.toastr.successToastr('Item Deleted successfuly')
        this.close(true);
      }
    })
    // this.close(true);
  }

}
