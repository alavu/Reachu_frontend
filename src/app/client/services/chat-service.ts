import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {BehaviorSubject, map, Observable, Subject} from 'rxjs';
import { ChatMessage } from 'src/app/admin/pages/model/ChatMessage';
import { UserStorageService } from 'src/app/auth/services/user-stoarge.service';
import {environment} from "../../environment";

const BASIC_URL = environment.apiBaseUrl;
@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private stompClient: any;
    private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
    private newMessageSubject: Subject<number> = new Subject<number>(); // Emits roomId

    constructor(private httpClient: HttpClient) {
        this.initConnectionSocket();
    }

    initConnectionSocket() {
        const url = `${BASIC_URL}/chat-socket`;
      const socket = new SockJS(url);
      this.stompClient = Stomp.over(socket);

      const token = UserStorageService.getToken();

      this.stompClient.connect(
          { Authorization: `Bearer ${token}` },
          (frame: string) => {
              console.log('Connected: ' + frame);
          },
          (error: any) => {
              console.error('STOMP connection error: ', error);
              // Attempt reconnection after a delay
              setTimeout(() => {
                  this.initConnectionSocket();
              }, 5000); // Retry after 5 seconds
          }
      );
    }

    joinRoom(roomId: number) {
        console.log('Joining room:', roomId);
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
                console.log('Received message:', messages.body);
                const messageContent = JSON.parse(messages.body);
                const currentMessage = this.messageSubject.getValue();
                currentMessage.push(messageContent);
                this.messageSubject.next(currentMessage);

                // Emit new message event
                this.newMessageSubject.next(roomId);
            });
        } else {
            console.error('STOMP client is not connected.');
        }

        this.loadMessage(roomId);
    }

    // Emits the roomId when a new message arrives
    emitNewMessage(roomId: number) {
        this.newMessageSubject.next(roomId);
    }


    getNewMessageSubject(): Observable<number> {
        return this.newMessageSubject.asObservable();
    }

    sendMessage(roomId: number, chatMessage: ChatMessage) {
        if (this.stompClient && this.stompClient.connected) {
            console.log("chat message",chatMessage)
            this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
        } else {
            console.error('STOMP client is not connected. Cannot send message.');
        }
    }

    getMessageSubject() {
        return this.messageSubject.asObservable();
    }

    loadMessage(roomId: number): void {
        this.httpClient.get<any[]>(`${BASIC_URL}/api/chat/${roomId}`).pipe(
            map(result => {
                return result.map(res => {
                    return {
                        id: res.id,
                        user: res.user_name,
                        partner_id: res.partner_id,
                        message: res.message,
                        timeStamp: res.timeStamp
                    } as ChatMessage;
                });
            })
        ).subscribe({
            next: (chatMessage: ChatMessage[]) => {
                this.messageSubject.next(chatMessage);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
}

