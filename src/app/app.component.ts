import {Component, OnDestroy, OnInit} from '@angular/core';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {ChatService} from './chat/shared/chat.service';
import {Observable, Subject} from 'rxjs';
import {ChatClient} from './chat/shared/chat-client.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'test-project-frontend';
  clients$: Observable<ChatClient[]> | undefined;
  unsubscribe$ = new Subject();

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {

    this.clients$ = this.chatService.listenForClients();

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
