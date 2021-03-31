import {Component, OnDestroy, OnInit} from '@angular/core';
import {Stock} from './shared/stock.model';
import {Observable, Subject} from 'rxjs';
import {StockService} from './shared/stock.service';
import {FormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

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

  constructor(private stockService: StockService) { }

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
    console.log(this.currentStock.name + ' clicked!');
  }

  increaseAmount(): void {
    console.log(this.value.value + 1);
    this.value.setValue(Math.round((this.value.value + 0.01) * 100) / 100);
  }

  decreaseAmount(): void {
    console.log(this.value.value - 1);
    this.value.setValue(Math.round((this.value.value - 0.01) * 100) / 100);
  }

  saveEdit(): void {
    this.currentStock.value = this.value.value;
    this.stockService.saveEdit(this.currentStock);
    this.stocks$ = this.stockService.listenForEditStock();
  }

  deleteStock(): void {
    console.log('Deleting ' + this.currentStock.name);
    this.stockService.deleteStock(this.currentStock);
    this.currentStock = null;
    this.stocks$ = this.stockService.listenForDeleteStock();
  }
}
