import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import {ReactiveFormsModule} from '@angular/forms';
import {StockState} from './state/stock.state';
import {NgxsModule} from '@ngxs/store';


@NgModule({
  declarations: [StockComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([StockState])
  ]
})
export class StockModule { }
