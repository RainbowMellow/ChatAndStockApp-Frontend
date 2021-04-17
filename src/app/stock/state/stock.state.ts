import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Subscription} from 'rxjs';
import {Stock} from '../shared/stock.model';
import {StockService} from '../shared/stock.service';
import {ListenForStocks, StopListeningForStocks, UpdateStocks} from './stock.actions';

export interface StockStateModel {
  stocks: Stock[];
}

@State<StockStateModel>({
  name: 'stock',
  defaults: {
    stocks: []
  }
})
@Injectable()
export class StockState {
  private stocksUnsub: Subscription | undefined;
  constructor(private stockService: StockService) {
  }

  @Selector()
  static stocks(state: StockStateModel): Stock[] {
    console.log(state.stocks.length);
    return state.stocks;
  }

  @Action(ListenForStocks)
  getStocks(ctx: StateContext<StockStateModel>): void {
    this.stocksUnsub = this.stockService.listenForStocks()
      .subscribe(stocks => {
        ctx.dispatch(new UpdateStocks(stocks));
      });
  }

  @Action(StopListeningForStocks)
  stopListeningForStocks(ctx: StateContext<StockStateModel>): void {
    if (this.stocksUnsub) {
      this.stocksUnsub.unsubscribe();
    }
  }

  @Action(UpdateStocks)
  updateClients(ctx: StateContext<StockStateModel>, uc: UpdateStocks): void {
    const state = ctx.getState();
    const newState: StockStateModel = {
      ...state,
      stocks: uc.stocks
    };
    ctx.setState(newState);
  }
}
