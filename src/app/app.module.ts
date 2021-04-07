import { BrowserModule } from '@angular/platform-browser';
import {Injectable, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {Socket, SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {environment} from '../environments/environment.prod';
import {NgxsModule} from '@ngxs/store';
import {ChatState} from './chat/state/chat.state';

@Injectable()
export class SocketChat extends Socket {

  constructor() {
    super({ url: 'http://localhost:4100', options: {} });
  }

}

@Injectable()
export class SocketStock extends Socket {

  constructor() {
    super({ url: 'http://localhost:4300', options: {} });
  }

}
// const config: SocketIoConfig = {url: 'http://localhost:4300', options: {}};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule,
    FormsModule,
    NgbModule,
    CommonModule,
    NgxsModule.forRoot([ChatState], {
      developmentMode: !environment.production
    })
  ],
  providers: [SocketChat, SocketStock],
  bootstrap: [AppComponent]
})
export class AppModule { }
