import {Component, OnDestroy, OnInit} from '@angular/core';
import {Stock} from './shared/stock.model';
import {Observable, Subject} from 'rxjs';
import {StockService} from './shared/stock.service';
import {FormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {
  stocks$: Observable<Stock[]> | undefined;
  unsubscribe$ = new Subject();
  currentStock: Stock | undefined;
  value = new FormControl('');

  name = new FormControl('');
  description = new FormControl('');

  closeResult: string;

  constructor(private stockService: StockService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.stockService.getStocks();
    this.stocks$ = this.stockService.listenForStocks();
    this.stocks$.subscribe(r => {console.log(r.length); });

  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onClickStock(stock: Stock): void {
    this.currentStock = stock;
    this.value.setValue(this.currentStock.value);
    this.name.setValue(this.currentStock.name);
    this.description.setValue(this.currentStock.description);
    console.log(this.currentStock.name + ' clicked!');
  }

  increaseAmount(): void {
    const newValue = Math.round((this.currentStock.value + 0.01) * 100) / 100;
    this.value.setValue(newValue);
    this.currentStock.value = newValue;
    this.stockService.saveEdit(this.currentStock);
    this.stocks$ = this.stockService.listenForEditStock();
  }

  decreaseAmount(): void {
    const newValue = Math.round((this.currentStock.value - 0.01) * 100) / 100;
    this.value.setValue(newValue);
    this.currentStock.value = newValue;
    this.stockService.saveEdit(this.currentStock);
    this.stocks$ = this.stockService.listenForEditStock();
  }

  saveEdit(): void {
    this.stockService.saveEdit(this.currentStock);
    this.stocks$ = this.stockService.listenForEditStock();
  }

  deleteStock(): void {
    console.log('Deleting ' + this.currentStock.name);
    this.stockService.deleteStock(this.currentStock);
    this.currentStock = null;
    this.stocks$ = this.stockService.listenForDeleteStock();
  }


  //region ModalStuff

  openDelete(content): void {
    this.modalService.open(content, {ariaLabelledBy: 'delete'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.deleteStock();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEdit(content): void {
    this.modalService.open(content, {ariaLabelledBy: 'edit'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.currentStock.name = this.name.value;
      this.currentStock.description = this.description.value;
      this.saveEdit();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  //endregion
}
