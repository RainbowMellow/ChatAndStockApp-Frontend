import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// tslint:disable-next-line:max-line-length
const routes: Routes = [{ path: 'chats', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule) }, { path: 'stocks', loadChildren: () => import('./stock/stock.module').then(m => m.StockModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
