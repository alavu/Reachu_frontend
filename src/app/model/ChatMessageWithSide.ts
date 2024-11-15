import { ChatMessage } from './chat-message.model';

export interface ChatMessageWithSide extends ChatMessage {
    message_side: 'sender' | 'receiver';
}
