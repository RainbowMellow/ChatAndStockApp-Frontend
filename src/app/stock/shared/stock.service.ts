import { Injectable } from '@angular/core';
import {Stock} from './stock.model';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {SocketStock} from '../../app.module';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private socket: SocketStock) { }

  listenForStocks(): Observable<Stock[]> {
    return this.socket
      .fromEvent<Stock[]>('stocks');
  }

  listenForDeleteStock(): Observable<Stock[]> {
    return this.socket
      .fromEvent<Stock[]>('deleteStock');
  }

  listenForEditStock(): Observable<Stock[]> {
    return this.socket
      .fromEvent<Stock[]>('editStock');
  }

  saveEdit(stock: Stock): void {
    this.socket.emit('editSave', stock);
  }

  deleteStock(stock: Stock): void {
    this.socket.emit('deleteStock', stock);
  }

  getStocks(): void {
    this.socket.emit('getStocks');
  }
}
