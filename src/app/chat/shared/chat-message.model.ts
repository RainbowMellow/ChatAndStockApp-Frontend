import { ChatClient } from './chat-client.model';

export interface ChatMessage {
  sender: ChatClient;
  message: string;
  timeSent: Date;
}
