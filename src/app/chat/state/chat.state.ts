import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ChatClient} from '../shared/chat-client.model';
import {ListenForClients, StopListeningForClients, UpdateClients} from './chat.actions';
import {ChatService} from '../shared/chat.service';
import {Subscription} from 'rxjs';

export interface ChatStateModel {
  chatClients: ChatClient[];
}

@State<ChatStateModel>({
  name: 'chat',
  defaults: {
    chatClients: []
  }
})
@Injectable()
export class ChatState {
  private clientsUnsub: Subscription | undefined;
  constructor(private chatService: ChatService) {
  }
  @Selector()
  static clients(state: ChatStateModel): ChatClient[] {
    return state.chatClients;
  }

  @Action(ListenForClients)
  getClients(ctx: StateContext<ChatStateModel>): void {
    this.clientsUnsub = this.chatService.listenForClients()
      .subscribe(clients => {
        ctx.dispatch(new UpdateClients(clients));
      });
  }

  @Action(StopListeningForClients)
  stopListeningForClients(ctx: StateContext<ChatStateModel>): void {
    if (this.clientsUnsub) {
      this.clientsUnsub.unsubscribe();
    }
  }

  @Action(UpdateClients)
  updateClients(ctx: StateContext<ChatStateModel>, uc: UpdateClients): void {
    this.chatService.listenForClients()
      .subscribe(clients => {
        const state = ctx.getState();
        const oldClients = [...state.chatClients];
        oldClients.push({id: '22', name: 'dd', isTyping: false});
        const newState: ChatStateModel = {
          ...state,
          chatClients: uc.clients
        };
        ctx.setState(newState);
      });
  }
}
