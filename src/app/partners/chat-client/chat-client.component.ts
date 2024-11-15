/*
import {Component, OnDestroy, OnInit} from '@angular/core';
import {PartnerChatService} from "../services/partner-chat.service";
import {UserStorageService} from "../../auth/services/user-stoarge.service";
import {ChatService} from "../../client/services/chat-service";
import {MatDialog} from "@angular/material/dialog";
import {ClientVideocallComponent} from "../../client/pages/video-call/client-videocall.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../model/User";
import {Subscription} from "rxjs";
import {NotificationService} from "../../client/services/NotificationService";
import {ChatMessage} from "../../model/ChatMessage";

@Component({
  selector: 'app-chat-client',
  templateUrl: './chat-client.component.html',
  styleUrls: ['./chat-client.component.scss']
})
export class ChatClientComponent implements OnInit, OnDestroy {

    messageInput: string = '';
    partnerId!: number;
    // messageList: any[] = [];
    messageList: ChatMessage[] = [];
    roomId!: number;
    selectedUser: User | null = null;
    connectedUsers: User[] = [];
    isLoadingConnectedUsers: boolean = true;
    unreadMessages: { [userId: number]: number } = {};

    private subscriptions: Subscription = new Subscription();

    constructor(private partnerChat: PartnerChatService,
                private chatService: ChatService,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private notificationService: NotificationService,
    ) { }

    ngOnInit(): void {
        this.partnerId = UserStorageService.getUserId();
        console.log('Retrieved partnerId:', this.partnerId);
        this.loadConnectedUsers();
        this.listenerMessage();
        this.notificationService.requestPermission();
    }

    ngOnDestroy(): void {
        // Unsubscribe to prevent memory leaks
        this.subscriptions.unsubscribe();
    }

    // selectPartner(user: any) {
    //     this.selectedUser = user.id;
    //     console.log("selected user yyyy", this.selectedUser)
    //     this.createRoom(user.id);
    // }

    selectPartner(user: User) {
        this.selectedUser = user; // Assign the entire user object
        console.log("Selected user:", this.selectedUser);
        this.createRoom(user.id);
    }


    createRoom(selectedUserId: number) {
        this.roomId = this.getRoomId(this.partnerId, selectedUserId);
        console.log('Creating/joining room with ID:', this.roomId);
        this.chatService.joinRoom(this.roomId);
        // this.listenerMessage();
    }

        sendMessage() {
        if (!this.selectedUser) {
            this.snackBar.open('Please select a user to chat with.', 'Close', { duration: 3000 });
            return;
        }

        if (!this.messageInput.trim()) {
            this.snackBar.open('Cannot send empty message.', 'Close', { duration: 3000 });
            return;
        }

        console.log("Selected user ID:", this.selectedUser.id);
        const chatMessage: ChatMessage = {
            message: this.messageInput,
            user_id: this.selectedUser.id,
            partner_id: this.partnerId
        }
        this.chatService.sendMessage(this.roomId, chatMessage);
        this.messageInput = '';
    }


    listenerMessage() {
        const messageSub = this.chatService.getMessageSubject().subscribe({
            next: (messages: ChatMessage[]) => {
                console.log('Received messages:', messages);
                this.messageList = messages.map((item: ChatMessage) => ({
                    ...item,
                    message_side: item.user_id === this.partnerId ? 'sender' : 'receiver'
                }));

                // Trigger in-app notification for the latest message
                if (messages.length > 0) {
                    const latestMessage = messages[messages.length - 1];
                    if (latestMessage.user_id !== this.partnerId) { // Only notify for incoming messages
                        // Increment unread message count for the sender
                        if (this.unreadMessages[latestMessage.user_id]) {
                            this.unreadMessages[latestMessage.user_id]++;
                        } else {
                            this.unreadMessages[latestMessage.user_id] = 1;
                        }

                        // Trigger snack-bar notification
                        this.snackBar.open(`New message from ${this.getUserName(latestMessage.user_id)}`, 'View', {
                            duration: 5000,
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                        }).onAction().subscribe(() => {
                            // Scroll to the latest message
                            const chatContainer = document.querySelector('.flex-1.overflow-y-auto');
                            if (chatContainer) {
                                chatContainer.scrollTop = chatContainer.scrollHeight;
                            }

                            // Reset unread message count when user views messages
                            this.unreadMessages[latestMessage.user_id] = 0;
                        });
                        this.notificationService.showNotification(
                            `New message from ${this.getUserName(latestMessage.user_id)}`,
                            {
                                body: latestMessage.message,
                                icon: 'assets/icons/chat-icon.png', // Ensure this path is correct
                            }
                        );
                    }
                }
            },
            error: (error) => {
                console.error('Error receiving messages:', error);
            }
        });
        this.subscriptions.add(messageSub);
    }

    getRoomId(userId1: number, userId2: number): number {
        return userId1 < userId2 ? userId1 * 1000 + userId2 : userId2 * 1000 + userId1;
    }

    // loadConnectedUsers(): void {
    //     this.partnerChat.getConnectedUsers(this.partnerId).subscribe({
    //         next: (partners: any[]) => {
    //             this.connectedUsers = partners;
    //         },
    //         error: (error) => {
    //             console.error('Error fetching connected partners', error);
    //         },
    //         complete: () => {
    //             console.log('Finished loading connected partners');
    //         }
    //     });
    // }

/!*    loadConnectedUsers(): void {
        if (!this.partnerId) {
            console.error('Invalid partnerId:', this.partnerId);
            this.snackBar.open('Invalid user ID. Please refresh or contact support.', 'Close', { duration: 3000 });
            this.isLoadingConnectedUsers = false;
            return;
        }

        const connectedUsersSub = this.partnerChat.getConnectedUsers(this.partnerId).subscribe({
            next: (partners: User[] | null) => { // Allow for null
                console.log('Received partners:', partners);
                if (partners && Array.isArray(partners)) {
                    this.connectedUsers = partners;
                    if (partners.length === 0) {
                        this.snackBar.open('No connected users found.', 'Close', { duration: 3000 });
                    }
                    this.isLoadingConnectedUsers = false;
                } else {
                    console.error('Received null or invalid data for connected users.');
                    this.connectedUsers = []; // Fallback to empty array
                    this.snackBar.open('Failed to load connected users.', 'Close', { duration: 3000 });
                    this.isLoadingConnectedUsers = false;
                }
            },
            error: (error) => {
                console.error('Error fetching connected partners:', error);
                this.connectedUsers = []; // Fallback to empty array
                this.snackBar.open('Failed to load connected users.', 'Close', { duration: 3000 });
            },
            complete: () => {
                console.log('Finished loading connected partners.');
            }
        });
    }*!/

    loadConnectedUsers(): void {
        if (!this.partnerId) {
            console.error('Invalid partnerId:', this.partnerId);
            this.snackBar.open('Invalid user ID. Please refresh or contact support.', 'Close', { duration: 3000 });
            this.isLoadingConnectedUsers = false;
            return;
        }

        const connectedUsersSub = this.partnerChat.getConnectedUsers(this.partnerId).subscribe({
            next: (partners: User[]) => {
                console.log('Received partners:', partners);
                this.connectedUsers = partners;
                if (partners.length === 0) {
                    this.snackBar.open('No connected users found.', 'Close', { duration: 3000 });
                }
                this.isLoadingConnectedUsers = false;
            },
            error: (error) => {
                console.error('Error fetching connected partners:', error);
                this.connectedUsers = []; // Fallback to empty array
                this.snackBar.open('Failed to load connected users.', 'Close', { duration: 3000 });
                this.isLoadingConnectedUsers = false;
            },
            complete: () => {
                console.log('Finished loading connected partners.');
            }
        });

        this.subscriptions.add(connectedUsersSub);
    }

    videoCallWithUser(): void {
        if (!this.selectedUser) {
            this.snackBar.open('Please select a user to video call.', 'Close', { duration: 3000 });
            return;
        }
        this.dialog.open(ClientVideocallComponent, {
            width: '80%',
            height: '80%',
            data: { user: this.selectedUser } // Pass selected user data if needed
        });
    }

    // Utility method to get user name by ID
    getUserName(userId: number): string {
        const user = this.connectedUsers.find(u => u.id === userId);
        return user ? user.name : 'Unknown';
    }

}
*/

import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartnerChatService } from "../services/partner-chat.service";
import { ChatService } from "../../client/services/chat-service";
import { MatDialog } from "@angular/material/dialog";
import { ClientVideocallComponent } from "../../client/pages/video-call/client-videocall.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from "../../model/User";
import { Subscription } from "rxjs";
import { NotificationService } from "../../client/services/NotificationService";
import { ChatMessage } from "../../model/ChatMessage";
import {UserStorageService} from "../../auth/services/user-stoarge.service";

interface Notification {
    message: string;
    time: Date;
}

@Component({
    selector: 'app-chat-client',
    templateUrl: './chat-client.component.html',
    styleUrls: ['./chat-client.component.scss']
})
export class ChatClientComponent implements OnInit, OnDestroy {

    messageInput: string = '';
    partnerId!: number;
    messageList: ChatMessage[] = [];
    roomId!: number;
    selectedUser: User | null = null;
    connectedUsers: User[] = [];
    isLoadingConnectedUsers: boolean = true;
    unreadMessages: { [userId: number]: number } = {};
    notifications: Notification[] = [];
    showNotifications: boolean = false;

    private subscriptions: Subscription = new Subscription();

    constructor(
        private partnerChat: PartnerChatService,
        private chatService: ChatService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private notificationService: NotificationService,
    ) { }

    ngOnInit(): void {
        this.partnerId = UserStorageService.getUserId();
        console.log('Retrieved partnerId:', this.partnerId);
        this.loadConnectedUsers();
        this.listenerMessage();
        this.notificationService.requestPermission();
    }

    ngOnDestroy(): void {
        // Unsubscribe to prevent memory leaks
        this.subscriptions.unsubscribe();
    }

    selectPartner(user: User) {
        this.selectedUser = user; // Assign the entire user object
        console.log("Selected user:", this.selectedUser);
        this.createRoom(user.id);
    }

    createRoom(selectedUserId: number) {
        this.roomId = this.getRoomId(this.partnerId, selectedUserId);
        console.log('Creating/joining room with ID:', this.roomId);
        this.chatService.joinRoom(this.roomId);
    }

    sendMessage() {
        if (!this.selectedUser) {
            this.snackBar.open('Please select a user to chat with.', 'Close', { duration: 3000 });
            return;
        }

        if (!this.messageInput.trim()) {
            this.snackBar.open('Cannot send empty message.', 'Close', { duration: 3000 });
            return;
        }

        console.log("Selected user ID:", this.selectedUser.id);
        const chatMessage: ChatMessage = {
            message: this.messageInput,
            user_id: this.partnerId, // Assuming sender is the current user
            partner_id: this.selectedUser.id,
            // timeStamp: new Date()
        }
        this.chatService.sendMessage(this.roomId, chatMessage);
        this.messageInput = '';
    }

    listenerMessage() {
        const messageSub = this.chatService.getMessageSubject().subscribe({
            next: (messages: ChatMessage[]) => {
                console.log('Received messages:', messages);
                this.messageList = messages.map((item: ChatMessage) => ({
                    ...item,
                    message_side: item.user_id === this.partnerId ? 'sender' : 'receiver'
                }));

                // Trigger in-app notification for the latest message
                if (messages.length > 0) {
                    const latestMessage = messages[messages.length - 1];
                    if (latestMessage.user_id !== this.partnerId) { // Only notify for incoming messages
                        // Increment unread message count for the sender
                        if (this.unreadMessages[latestMessage.user_id]) {
                            this.unreadMessages[latestMessage.user_id]++;
                        } else {
                            this.unreadMessages[latestMessage.user_id] = 1;
                        }

                        // Add to notifications array
                        this.notifications.unshift({
                            message: `New message from ${this.getUserName(latestMessage.user_id)}`,
                            time: new Date(latestMessage.timeStamp)
                        });

                        // Trigger snack-bar notification
                        this.snackBar.open(`New message from ${this.getUserName(latestMessage.user_id)}`, 'View', {
                            duration: 5000,
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                        }).onAction().subscribe(() => {
                            // Scroll to the latest message
                            const chatContainer = document.querySelector('.flex-1.overflow-y-auto');
                            if (chatContainer) {
                                chatContainer.scrollTop = chatContainer.scrollHeight;
                            }

                            // Reset unread message count when user views messages
                            this.unreadMessages[latestMessage.user_id] = 0;
                        });
                        this.notificationService.showNotification(
                            `New message from ${this.getUserName(latestMessage.user_id)}`,
                            {
                                body: latestMessage.message,
                                icon: 'assets/icons/chat-icon.png', // Ensure this path is correct
                            }
                        );
                    }
                }
            },
            error: (error) => {
                console.error('Error receiving messages:', error);
            }
        });
        this.subscriptions.add(messageSub);
    }

    getRoomId(userId1: number, userId2: number): number {
        return userId1 < userId2 ? userId1 * 1000 + userId2 : userId2 * 1000 + userId1;
    }

    loadConnectedUsers(): void {
        if (!this.partnerId) {
            console.error('Invalid partnerId:', this.partnerId);
            this.snackBar.open('Invalid user ID. Please refresh or contact support.', 'Close', { duration: 3000 });
            this.isLoadingConnectedUsers = false;
            return;
        }

        const connectedUsersSub = this.partnerChat.getConnectedUsers(this.partnerId).subscribe({
            next: (partners: User[]) => {
                console.log('Received partners:', partners);
                this.connectedUsers = partners;
                if (partners.length === 0) {
                    this.snackBar.open('No connected users found.', 'Close', { duration: 3000 });
                }
                this.isLoadingConnectedUsers = false;
            },
            error: (error) => {
                console.error('Error fetching connected partners:', error);
                this.connectedUsers = []; // Fallback to empty array
                this.snackBar.open('Failed to load connected users.', 'Close', { duration: 3000 });
                this.isLoadingConnectedUsers = false;
            },
            complete: () => {
                console.log('Finished loading connected partners.');
            }
        });

        this.subscriptions.add(connectedUsersSub);
    }

    videoCallWithUser(): void {
        if (!this.selectedUser) {
            this.snackBar.open('Please select a user to video call.', 'Close', { duration: 3000 });
            return;
        }
        this.dialog.open(ClientVideocallComponent, {
            width: '80%',
            height: '80%',
            data: { user: this.selectedUser } // Pass selected user data if needed
        });
    }

    // Utility method to get user name by ID
    getUserName(userId: number): string {
        const user = this.connectedUsers.find(u => u.id === userId);
        return user ? user.name : 'Unknown';
    }

    // Toggle notifications dropdown
    toggleNotifications(): void {
        this.showNotifications = !this.showNotifications;
        if (this.showNotifications) {
            // Reset unread messages count when viewing notifications
            this.unreadMessages = {};
        }
    }

    // Mark all notifications as read
    markNotificationsAsRead(): void {
        this.notifications = [];
        this.showNotifications = false;
    }

    // Getter to calculate total unread messages
    get totalUnreadMessages(): number {
        return Object.values(this.unreadMessages).reduce((a, b) => a + b, 0);
    }
}

