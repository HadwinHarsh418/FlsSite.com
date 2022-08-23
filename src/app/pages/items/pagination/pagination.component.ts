import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  totalElemnt: number = 1;
  // totalElements:number;
  rowPerPage: number = 1;
  numberOfPages: number = 1;
  pagesArray = [1];
  activePg: number = 1;
  activePgSize: number = 25;
  totalNumber: number;
  pagesNumbers: any[] = [];
  begin: number;

  @Input() set totalPages(val: number) {
    this.totalElemnt = val;
    this.calculatePagination();
  }
  @Input() set totalElements(val: number) {
    this.totalNumber = val;
  }

  @Input() set rowOnPage(val: number) {
    this.rowPerPage = val;
    this.calculatePagination();
  };

  @Output() pageChanged: EventEmitter<number> = new EventEmitter();
  @Output()
  pageSizeChanged: EventEmitter<number> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  calculatePagination(backEnable: boolean = false) {
    this.numberOfPages = this.totalElemnt;
    // this.numberOfPages
    this.pagesArray = [];

    for (let i = 1; i <= this.numberOfPages; i++) {
      this.pagesArray.push(i)
    } if (backEnable) {
      if (this.activePg > 1) {
        this.begin = this.activePg - 1;
      }
      else {
        this.begin--
      }
    } else {
      if (this.activePg == 1) {
        this.begin = 0;
      }
      else {
        this.begin++
      }
    }

    if (this.activePg < this.numberOfPages) {
      let end = this.begin + 3;
      this.pagesNumbers = this.pagesArray.slice(this.begin, end);
    }
  }

  changePage(page) {
    if (this.activePg == page) {
      return;
    }
    else if (page >= this.numberOfPages) {
      let spage = page - 1
      this.begin= spage;
      let end = this.numberOfPages;
      this.pagesNumbers = this.pagesArray.slice(this.begin, end);
    }
    else{
      let spage = page - 1
      this.begin= spage;
      let end = this.begin + 3;
      this.pagesNumbers = this.pagesArray.slice(this.begin, end);
    }
    this.activePg = page;
    this.pageChanged.emit(this.activePg)
  }
  changePageSize(pageSize) {
    if (this.activePgSize == pageSize) {
      return;
    }
    this.activePgSize = pageSize;
    this.pageSizeChanged.emit(this.activePgSize)
    this.activePg = 1;
    this.pageChanged.emit(this.activePg)
  }
  changepageInc() {
    if (this.activePg < this.numberOfPages) {
      this.activePg++;
      this.calculatePagination()
      this.pageChanged.emit(this.activePg);
    }
  }
  changepageDec() {
    if (this.activePg > 1) {
      this.activePg--;
      this.calculatePagination(true)
      this.pageChanged.emit(this.activePg);
    }
  }
}
