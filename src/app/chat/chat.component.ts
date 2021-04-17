import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Observable, Subject} from 'rxjs';
import {debounce, debounceTime, distinctUntilChanged, take, takeUntil} from 'rxjs/operators';
import {ChatClient} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';
import {ChatState} from './state/chat.state';
import {Select, Store} from '@ngxs/store';
import {ListenForClients, StopListeningForClients} from './state/chat.actions';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageFC = new FormControl('');
  nameFC = new FormControl('');
  messages: ChatMessage[] = [];
  clientsTyping: ChatClient[] = [];
  unsubscriber$ = new Subject();

  @Select(ChatState.clients)
  clients$: Observable<ChatClient[]> | undefined;

  chatClient: ChatClient | undefined;
  error$: Observable<string> | undefined;

  constructor(private chatService: ChatService, private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ListenForClients());

    this.chatService.listenForMessages()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(message => {
        this.messages.push(message);
        console.log(message.sender + ', ' + message.message + ', ' + message.timeSent);
      });

    // this.clients$ = this.chatService.listenForClients();
    console.log(this.clients$);

    this.error$ = this.chatService.listenForErrors();

    this.messageFC.valueChanges
      .pipe(takeUntil(this.unsubscriber$),
            debounceTime(500))
      .subscribe((value) => {
        this.chatService.sendTyping(value.length > 0);
      });

    this.chatService.listenForClientTyping()
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((chatClient) => {

        if (chatClient.isTyping && !this.clientsTyping.find((c) => c.id === chatClient.id)) {
          this.clientsTyping.push(chatClient);
        } else if (!chatClient.isTyping && this.clientsTyping.find((c) => c.id === chatClient.id)){
           this.clientsTyping = this.clientsTyping.filter((c) => c.id !== chatClient.id);
        }
      });

    this.chatService.listenForWelcome()
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe(welcome => {
        this.messages = welcome.messages;
        this.chatClient = this.chatService.chatClient = welcome.client;
      });
    if (this.chatService.chatClient)
    {
      this.chatService.sendName(this.chatService.chatClient.name);
    }
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.store.dispatch(new StopListeningForClients());
  }

  sendMessage(): void {
    console.log(this.messageFC.value);
    this.chatService.sendMessage(this.messageFC.value);
    this.messageFC.reset('');
  }

  sendName(): void {
    // Remember to validate name
    if (this.nameFC.value) {
      this.chatService.sendName(this.nameFC.value);
    }
  }
}
