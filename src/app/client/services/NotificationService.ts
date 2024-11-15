import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor() { }

    // Request permission from the user
    requestPermission(): void {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                } else {
                    console.log('Notification permission denied.');
                }
            });
        } else {
            console.warn('This browser does not support desktop notifications.');
        }
    }

    // Show a notification
    showNotification(title: string, options?: NotificationOptions): void {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                const notification = new Notification(title, options);
                notification.onclick = () => {
                    window.focus(); // Bring the window to focus
                    // Optionally navigate to the chat component
                    window.location.href = '/chat';
                };
            }
        }
    }

}
