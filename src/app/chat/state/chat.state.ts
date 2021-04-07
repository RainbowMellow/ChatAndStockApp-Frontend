import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ChatClient} from '../shared/chat-client.model';
import {ListenForClients, UpdateClients} from './chat.actions';
import {ChatService} from '../shared/chat.service';

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
  constructor(private chatService: ChatService) {
  }
  @Selector()
  static clients(state: ChatStateModel): ChatClient[] {
    return state.chatClients;
  }

  @Action(ListenForClients)
  getClients(ctx: StateContext<ChatStateModel>): void {
    this.chatService.listenForClients()
      .subscribe(clients => {
        const state = ctx.getState();
        const newState: ChatStateModel = {
          ...state,
          chatClients: clients
        };

        ctx.setState(newState);
      });
  }

  @Action(UpdateClients)
  updateClients(ctx: StateContext<ChatStateModel>, uc: UpdateClients): void {
    this.chatService.listenForClients()
      .subscribe(clients => {
        ctx.dispatch(new UpdateClients(clients));
      });
  }
}
