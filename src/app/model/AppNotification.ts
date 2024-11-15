export interface AppNotification {
    id: number;
    message: string;
    timestamp: Date;
    isRead: boolean;
    type: 'message' | 'status' | 'other'; // Extend as needed
}
