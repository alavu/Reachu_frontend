import {Component, OnDestroy, OnInit} from '@angular/core';
import { ChatService } from '../../services/chat-service';
import { ChatMessage } from 'src/app/admin/pages/model/ChatMessage';
import { UserStorageService } from 'src/app/auth/services/user-stoarge.service';
import { ClientService } from '../../services/client.service';
import {ConnectedPartners} from "../../../model/ConnectedPartners";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ClientVideocallComponent} from "../video-call/client-videocall.component";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AppNotification} from "../../../model/AppNotification";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageInput: string = '';
  userId!: number;
  messageList: any[] = [];
  roomId!: number;
  // connectedPartners: any[] = [];
  connectedPartners: ConnectedPartners[] = [];
  selectedPartner: any;
  isChatVisible: boolean = false;
  notifications: AppNotification[] = [];
  isNotificationsPanelVisible: boolean = false;
  private newMessageSubscription!: Subscription;
  private activeRoomId!: number | null;
  private notificationIdCounter: number = 1;

  constructor(private chatService: ChatService,
              private dialog: MatDialog,
              private  router: Router,
              private snackBar: MatSnackBar,
              private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.userId = UserStorageService.getUserId();
    this.loadConnectedPartners();  // Fetch connected partners on load
      this.listenerMessage();

      if (Notification.permission !== 'granted') {
          Notification.requestPermission();
      }

      // Subscribe to new message events
      this.newMessageSubscription = this.chatService.getNewMessageSubject().subscribe((roomId: number) => {
          if (this.activeRoomId !== roomId) {
              // Find the partner and increment unreadCount
              const partner = this.connectedPartners.find(p => this.getRoomId(this.userId, p.id) === roomId);
              if (partner) {
                  partner.unreadCount = (partner.unreadCount || 0) + 1;

                  // Create a new notification
                  const newNotification: AppNotification = {
                      id: this.notificationIdCounter++,
                      message: `New message from ${partner.name}`,
                      timestamp: new Date(),
                      isRead: false,
                      type: 'message'
                  };
                  this.notifications.unshift(newNotification); // Add to the beginning

                  // Show desktop notification
                  if (Notification.permission === 'granted') {
                      new Notification(`New message from ${partner.name}`, {
                          body: 'You have received a new message.',
                          icon: 'assets/icons/message-icon.png' // Optional: Your icon path
                      });
                  }

                  // Optional: Show a snackbar notification
                  this.snackBar.open(`New message from ${partner.name}`, 'View', {
                      duration: 3000,
                      horizontalPosition: 'right',
                      verticalPosition: 'top',
                  }).onAction().subscribe(() => {
                      this.selectPartner(partner);
                  });

              }
          }
      });
  }

    ngOnDestroy(): void {
        if (this.newMessageSubscription) {
            this.newMessageSubscription.unsubscribe();
        }
    }

  // When a partner is selected, create a chat room and show chat window
  selectPartner(partner: any) {
      this.selectedPartner = partner
      console.log("Selected partner:", this.selectedPartner);
      this.activeRoomId = this.getRoomId(this.userId, partner.id);
      this.createRoom(partner.id);

      // Reset unread count
      const selected = this.connectedPartners.find(p => p.id === partner.id);
      if (selected) {
          selected.unreadCount = 0;
      }
  }

createRoom(selectedUserId: number) {
  this.roomId = this.getRoomId(this.userId, selectedUserId);
  this.chatService.joinRoom(this.roomId);
  this.listenerMessage();
}

  sendMessage() {
    console.log("Selected partner xxxx",this.selectedPartner.id)
      if (!this.selectedPartner) {
          this.snackBar.open('Please select a partner to send a message.', 'Close', {
              duration: 3000,
          });
          return;
      }

    const chatMessage: ChatMessage = {
          id: 0,
        message: this.messageInput,
        user_id: this.userId,
        partner_id: this.selectedPartner.id
    }
    this.chatService.sendMessage(this.roomId, chatMessage);
    this.messageInput = '';
  }

  // listenerMessage() {
  //   this.chatService.getMessageSubject().subscribe((messages: any) => {
  //     this.messageList = messages.map((item: any) => ({
  //       ...item,
  //       message_side: item.user === this.userId ? 'sender' : 'receiver'
  //     }));
  //   });
  // }

    listenerMessage() {
        this.chatService.getMessageSubject().subscribe((messages: any) => {
            this.messageList = messages.map((item: any) => ({
                ...item,
                message_side: item.user_id === this.userId ? 'sender' : 'receiver'
            }));

            // Trigger in-app notification for the latest message
            if (messages.length > 0) {
                const latestMessage = messages[messages.length - 1];
                if (latestMessage.user_id !== this.userId) { // Only notify for incoming messages
                    // Increment unread message count for the sender
                    const partner = this.connectedPartners.find(p => p.id === latestMessage.user_id);
                    if (partner) {
                        partner.unreadCount = (partner.unreadCount || 0) + 1;

                        // Add to notifications array
                        this.notifications.unshift({
                            id: this.notificationIdCounter++,
                            message: `New message from ${partner.name}`,
                            timestamp: new Date(latestMessage.timeStamp),
                            isRead: false,
                            type: 'message'
                        });

                        // Show desktop notification
                        if (Notification.permission === 'granted') {
                            new Notification(`New message from ${partner.name}`, {
                                body: latestMessage.message,
                                icon: 'assets/icons/message-icon.png' // Ensure this path is correct
                            });
                        }

                        // Optional: Show a snackbar notification
                        this.snackBar.open(`New message from ${partner.name}`, 'View', {
                            duration: 3000,
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                        }).onAction().subscribe(() => {
                            this.selectPartner(partner);
                        });
                    }
                }
            }
        });
    }


    getRoomId(userId1: number, userId2: number): number {
    return userId1 < userId2 ? userId1 * 1000 + userId2 : userId2 * 1000 + userId1;
  }

    loadConnectedPartners(): void {
        this.clientService.getConnectedPartners(this.userId).subscribe({
            next: (partners: any[]) => {
                this.connectedPartners = partners;
            },
            error: (error) => {
                console.error('Error fetching connected partners', error);
            },
            complete: () => {
                console.log('Finished loading connected partners');
            }
        });
    }

    videoCall(): void {
        this.dialog.open(ClientVideocallComponent, {
            width: '100%', // Optional: Configure dialog width
            height: '100%', // Optional: Configure dialog height
            // data: { exampleData: 'Your data here' } // Optional: Pass data to the component
        });
    }

    viewNotifications() {
        this.isNotificationsPanelVisible = !this.isNotificationsPanelVisible;
    }

    markAsRead(notification: AppNotification) {
        notification.isRead = true;
    }

    clearNotifications() {
        this.notifications = [];
    }

    trackByMessage(index: number, message: ChatMessage): string {
        return `${message.user_id}-${message.timeStamp}`;
    }

}


